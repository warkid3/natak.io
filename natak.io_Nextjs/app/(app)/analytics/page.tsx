"use client";

import React, { useEffect, useState } from 'react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Loader2, TrendingUp, AlertCircle, Zap, CheckCircle2, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AnalyticsData {
    kpi: {
        creditsRemaining: number;
        creditsUsedWeek: number;
        totalCompleted: number;
        successRate: number;
    };
    charts: {
        usage: { name: string; date: string; credits: number }[];
        topCharacters: { name: string; count: number }[];
        typeSplit: { name: string; value: number; fill: string }[];
    };
}

const COLORS = ['#3b82f6', '#eab308', '#10b981', '#f43f5e'];

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/analytics');
            if (!res.ok) throw new Error('Failed to load data');
            const json = await res.json();
            setData(json);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <p className="text-white font-bold">Failed to load analytics</p>
                <Button onClick={fetchData} variant="outline">Retry</Button>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header Removed as requested */}
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    label="Credits Remaining"
                    value={data.kpi.creditsRemaining.toLocaleString()}
                    sub="Available Balance"
                    icon={<CreditCard className="w-4 h-4 text-primary" />}
                    trend="Balance"
                />
                <KpiCard
                    label="7-Day Consumption"
                    value={data.kpi.creditsUsedWeek.toLocaleString()}
                    sub="Credits Used"
                    icon={<Zap className="w-4 h-4 text-amber-500" />}
                    trend="Spending"
                />
                <KpiCard
                    label="Total Output"
                    value={data.kpi.totalCompleted.toLocaleString()}
                    sub="Jobs Completed"
                    icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    trend="Lifetime"
                />
                <KpiCard
                    label="Success Rate"
                    value={`${data.kpi.successRate.toFixed(1)}%`}
                    sub="System Health"
                    icon={<TrendingUp className="w-4 h-4 text-blue-500" />}
                    trend="Target > 95%"
                />
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Usage Trend */}
                <Card className="lg:col-span-2 bg-[#1A1A1D] border-white/5">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-white uppercase tracking-wide">Usage Trend</CardTitle>
                        <CardDescription className="text-slate-500 text-xs uppercase tracking-widest">
                            Credit consumption over last 30 days
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.charts.usage}>
                                <defs>
                                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#CCFF00" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#CCFF00" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#666"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={30}
                                />
                                <YAxis
                                    stroke="#666"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '4px' }}
                                    itemStyle={{ color: '#CCFF00', fontWeight: 'bold' }}
                                    cursor={{ stroke: '#CCFF00', strokeWidth: 1 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="credits"
                                    stroke="#CCFF00"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorSpend)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Content Split */}
                <Card className="bg-[#1A1A1D] border-white/5">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-white uppercase tracking-wide">Production Type</CardTitle>
                        <CardDescription className="text-slate-500 text-xs uppercase tracking-widest">
                            Image vs Video Split
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        {data.charts.typeSplit.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.charts.typeSplit}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.charts.typeSplit.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} stroke="rgba(0,0,0,0.5)" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '4px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        formatter={(value) => <span className="text-slate-400 text-xs font-bold uppercase ml-1">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center text-slate-600">
                                <p className="text-xs uppercase tracking-widest">No data available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Top Models */}
            <Card className="bg-[#1A1A1D] border-white/5">
                <CardHeader>
                    <CardTitle className="text-lg font-bold text-white uppercase tracking-wide">Top Models</CardTitle>
                    <CardDescription className="text-slate-500 text-xs uppercase tracking-widest">
                        Most frequently used characters/LoRAs
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-[250px]">
                    {data.charts.topCharacters.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.charts.topCharacters} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                <XAxis type="number" stroke="#666" fontSize={10} hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    stroke="#9ca3af"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    width={120}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '4px' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-600">
                            <p className="text-xs uppercase tracking-widest">No character usage data</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function KpiCard({ label, value, sub, icon, trend }: { label: string, value: string, sub: string, icon: React.ReactNode, trend: string }) {
    return (
        <div className="bg-[#1A1A1D] border border-white/5 rounded-sm p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-sm text-slate-400 group-hover:text-white transition-colors">
                    {icon}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 italic">
                    {trend}
                </span>
            </div>
            <div className="space-y-1">
                <h3 className="text-3xl font-[900] italic text-white tracking-tighter">{value}</h3>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</span>
                    <span className="text-[9px] text-slate-600 uppercase tracking-wide mt-1">{sub}</span>
                </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl group-hover:from-primary/10 transition-all" />
        </div>
    );
}
