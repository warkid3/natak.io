import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Fetch Profile (Credits)
        const { data: profile } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', user.id)
            .single();

        // 2. Fetch Jobs (Counts & Stats)
        const { data: jobs } = await supabase
            .from('jobs')
            .select('id, status, cost, created_at, character_id, config')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        const allJobs = jobs || [];
        const completedJobs = allJobs.filter(j => j.status === 'completed');
        const jobsLast7Days = allJobs.filter(j => {
            const date = new Date(j.created_at);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return date > sevenDaysAgo;
        });

        const creditsRemaining = profile?.credits || 0;
        const totalJobs = allJobs.length;
        const totalCompleted = completedJobs.length;
        const successRate = totalJobs > 0 ? (totalCompleted / totalJobs) * 100 : 100;

        // Calculate Credits Used (Total & Last 7 Days)
        // Note: Using job cost as a proxy for 'credits used' if ledger is not fully populated yet
        // Ideally we query credits_ledger, but for MVP job cost aggregation is often sufficient/faster
        const creditsUsedWeek = jobsLast7Days.reduce((acc, job) => acc + (job.cost || 0), 0);

        // 3. Prepare Chart Data: Usage Over Time (Last 30 Days)
        const usageMap = new Map<string, number>();
        const today = new Date();

        // Initialize last 30 days with 0
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = date.toISOString().split('T')[0];
            usageMap.set(dateKey, 0);
        }

        allJobs.forEach(job => {
            const dateKey = job.created_at.split('T')[0];
            if (usageMap.has(dateKey)) {
                usageMap.set(dateKey, (usageMap.get(dateKey) || 0) + (job.cost || 0));
            }
        });

        const usageChartData = Array.from(usageMap.entries()).map(([date, credits]) => ({
            name: new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }), // "Jan 20"
            date: date,
            credits: credits
        }));

        // 4. Prepare Chart Data: Top Characters
        const charMap = new Map<string, number>();
        allJobs.forEach(job => {
            if (job.character_id) {
                charMap.set(job.character_id, (charMap.get(job.character_id) || 0) + 1);
            }
        });

        // Resolve Character Names (Optional: Could do a join, but separate query keeps it simple for now)
        const charIds = Array.from(charMap.keys());
        let characterNames: Record<string, string> = {};

        if (charIds.length > 0) {
            const { data: chars } = await supabase
                .from('characters')
                .select('id, name')
                .in('id', charIds);

            chars?.forEach(c => {
                characterNames[c.id] = c.name;
            });
        }

        const topCharacters = Array.from(charMap.entries())
            .map(([id, count]) => ({
                name: characterNames[id] || 'Unknown Model',
                count: count
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5

        // 5. Prepare Chart Data: Content Type Split
        let videoCount = 0;
        let imageCount = 0;

        allJobs.forEach(job => {
            // Check config for video flag or infer from model
            const isVideo = job.config?.generateVideo === true;
            if (isVideo) videoCount++;
            else imageCount++;
        });

        const typeData = [
            { name: 'Images', value: imageCount, fill: '#3b82f6' }, // Blue
            { name: 'Videos', value: videoCount, fill: '#eab308' }, // Yellow
        ].filter(d => d.value > 0);


        return NextResponse.json({
            kpi: {
                creditsRemaining,
                creditsUsedWeek,
                totalCompleted,
                successRate
            },
            charts: {
                usage: usageChartData,
                topCharacters,
                typeSplit: typeData
            }
        });

    } catch (error) {
        console.error('[API] Analytics error:', error);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}
