"use client";

import React, { useState, useEffect } from 'react';
import { OperationsJob, PipelineStep, QualityStatus } from '@/types/operations';
import { cn } from '@/lib/utils';
import { ImageJobModal, VideoJobModal, MotionControlJobModal } from '@/components/modals';
import { Grid3x3, List } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// Helper to determine job type
function getJobType(job: OperationsJob): 'image' | 'video' | 'motion_control' {
    const config = job as any;
    // Check for Motion Control (Wan 2.2)
    if (config.video_model === 'Wan 2.2 Animate' || config.config?.video_model === 'Wan 2.2 Animate') {
        return 'motion_control';
    }
    // Check for Video (LTX-2 or other video models)
    if (job.format === 'Video' || config.video_model || config.config?.generateVideo) {
        return 'video';
    }
    // Default to image
    return 'image';
}

const STATUS_COLORS = {
    queued: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    processing: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    failed: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    paused: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

export default function OperationsPage() {
    const [jobs, setJobs] = useState<OperationsJob[]>([]);
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [inspectedJob, setInspectedJob] = useState<OperationsJob | null>(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Get current user
        const getUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserId(user.id);
        };
        getUser();
    }, []);

    useEffect(() => {
        fetchJobs();
    }, [filter]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/ops/queue?filter=${filter}`);
            const data = await res.json();
            setJobs(data.jobs || []);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (jobId: string, action: 'retry' | 'approve' | 'reject') => {
        try {
            const endpoint = action === 'retry' ? '/api/ops/retry' : `/api/ops/qc/${action}`;
            await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobId, reason: action === 'reject' ? 'Quality issue' : undefined })
            });
            setInspectedJob(null);
            fetchJobs();
        } catch (error) {
            console.error(`${action} failed:`, error);
        }
    };

    const handleSavePrompt = async (prompt: string, jobId: string) => {
        if (!inspectedJob) return;

        try {
            const jobType = getJobType(inspectedJob);
            const res = await fetch('/api/prompts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    title: `${inspectedJob.character_name || 'Job'} - ${new Date().toLocaleDateString()}`,
                    generationType: jobType,
                    sourceJobId: jobId,
                    modelConfig: (inspectedJob as any).config || null
                })
            });

            if (res.ok) {
                console.log('Prompt saved successfully');
            }
        } catch (error) {
            console.error('Failed to save prompt:', error);
        }
    };

    // Render the appropriate modal based on job type
    const renderJobModal = () => {
        if (!inspectedJob) return null;

        const jobType = getJobType(inspectedJob);
        const commonProps = {
            job: inspectedJob,
            onClose: () => setInspectedJob(null),
            onAction: (action: 'retry' | 'approve' | 'reject') => handleAction(inspectedJob.id, action),
            onSavePrompt: handleSavePrompt
        };

        switch (jobType) {
            case 'motion_control':
                return <MotionControlJobModal {...commonProps} />;
            case 'video':
                return <VideoJobModal {...commonProps} />;
            default:
                return <ImageJobModal {...commonProps} />;
        }
    };

    const getActionRequired = (job: OperationsJob) => {
        if (job.status === 'failed') return { label: 'Retry Step', color: 'text-rose-500 bg-rose-500/10' };
        if (job.status === 'completed' && job.quality_status === QualityStatus.PENDING)
            return { label: 'Ready for QC', color: 'text-blue-500 bg-blue-500/10' };
        if (job.status === 'processing' && job.progress > 0)
            return { label: 'Monitoring', color: 'text-amber-500 bg-amber-500/10' };
        return null;
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white p-8">
            <header className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold">Queue Manager</h1>
                    <p className="text-zinc-500 text-sm">Monitor active GPU threads and triage exceptions</p>
                </div>

                {/* View Toggle */}
                <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('table')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2",
                            viewMode === 'table' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                        )}
                    >
                        <List className="w-4 h-4" />
                        Table
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2",
                            viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                        )}
                    >
                        <Grid3x3 className="w-4 h-4" />
                        Grid
                    </button>
                </div>
            </header>

            {/* Filters */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                {['All Jobs', 'Processing', 'Failed', 'QC Required', 'Stuck (>10m)'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f.toLowerCase().replace(' ', '_').replace('_(>10m)', ''))}
                        className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap",
                            filter === f.toLowerCase().replace(' ', '_').replace('_(>10m)', '')
                                ? 'bg-white text-black border-white'
                                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                        )}
                    >
                        {f}
                    </button>
                ))}
            </div>


            {loading ? (
                <div className="text-center py-20 text-zinc-500">Loading...</div>
            ) : jobs.length === 0 ? (
                <EmptyQueueState />
            ) : viewMode === 'table' ? (
                <TableView jobs={jobs} onInspect={setInspectedJob} getActionRequired={getActionRequired} />
            ) : (
                <GridView jobs={jobs} onInspect={setInspectedJob} />
            )}

            {renderJobModal()}
        </div>
    );
}

function TableView({ jobs, onInspect, getActionRequired }: any) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
            <table className="w-full text-left text-sm">
                <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-500 uppercase text-[10px] font-black tracking-widest">
                    <tr>
                        <th className="px-6 py-4">Job Info</th>
                        <th className="px-6 py-4">Pipeline Status</th>
                        <th className="px-6 py-4">Action Required</th>
                        <th className="px-6 py-4">Metrics</th>
                        <th className="px-6 py-4 text-right">Control</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                    {jobs.map((job: OperationsJob) => {
                        const action = getActionRequired(job);
                        return (
                            <tr
                                key={job.id}
                                onClick={() => onInspect(job)}
                                className="hover:bg-zinc-800/30 transition-colors group cursor-pointer"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden flex-shrink-0">
                                            {job.output_url && (
                                                <img src={job.output_url} alt="Preview" className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold flex items-center gap-2">
                                                {job.character_name || 'Unknown'}
                                                {job.is_nsfw && <span className="text-[9px] px-1 bg-rose-500/20 text-rose-500 rounded font-black">18+</span>}
                                            </div>
                                            <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter">
                                                {job.id.slice(0, 8)} • {job.format} • {job.platform}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3 mb-1.5">
                                        <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-widest", STATUS_COLORS[job.status])}>
                                            {job.status}
                                        </span>
                                        <span className="text-[10px] text-zinc-500 font-bold uppercase">
                                            Step {job.current_step}/5
                                        </span>
                                    </div>
                                    <div className="w-40 bg-zinc-800 h-1 rounded-full overflow-hidden relative">
                                        <div
                                            className={cn("h-full transition-all duration-1000",
                                                job.status === 'failed' ? 'bg-rose-500' :
                                                    job.status === 'completed' ? 'bg-blue-500' : 'bg-emerald-500'
                                            )}
                                            style={{ width: `${job.progress}%` }}
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {action ? (
                                        <span className={cn("px-2 py-1 rounded text-[10px] font-bold border border-transparent", action.color)}>
                                            {action.label}
                                        </span>
                                    ) : (
                                        <span className="text-[10px] text-zinc-700 font-medium">None</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-zinc-300">${job.cost.toFixed(2)}</div>
                                    <div className="text-[10px] text-zinc-600 italic">{new Date(job.created_at).toLocaleTimeString()}</div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md text-xs font-bold transition-all opacity-0 group-hover:opacity-100">
                                        Inspect
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

function GridView({ jobs, onInspect }: any) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {jobs.map((job: OperationsJob) => (
                <div
                    key={job.id}
                    onClick={() => onInspect(job)}
                    className="relative bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer group transition-all hover:-translate-y-1 hover:shadow-2xl"
                >
                    <div className="aspect-[3/4] bg-zinc-800 relative">
                        {job.output_url ? (
                            <img
                                src={job.output_url}
                                alt="Preview"
                                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                No Preview
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-3 flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border shadow-lg", STATUS_COLORS[job.status])}>
                                    {job.status}
                                </span>
                            </div>
                            <div className="space-y-1 text-white">
                                <div className="font-bold text-xs truncate">{job.character_name || 'Unknown'}</div>
                                <div className="flex items-center gap-1">
                                    <div className="flex-1 bg-white/20 h-1 rounded-full overflow-hidden">
                                        <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${job.progress}%` }} />
                                    </div>
                                    <span className="text-[8px] font-bold text-zinc-300">{job.progress}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {job.status === 'failed' && (
                        <div className="bg-rose-500 text-white text-[9px] font-black py-1 px-2 text-center">
                            ERROR DETECTED
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

function EmptyQueueState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4">
            {/* Illustration */}
            <div className="mb-8 relative">
                <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Background glow */}
                    <circle cx="120" cy="120" r="100" fill="url(#glow)" opacity="0.1" />

                    {/* Main elements - empty queue visualization */}
                    <g opacity="0.3">
                        {/* Queue slots - empty */}
                        <rect x="60" y="80" width="120" height="16" rx="8" stroke="#3f3f46" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                        <rect x="60" y="112" width="120" height="16" rx="8" stroke="#3f3f46" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                        <rect x="60" y="144" width="120" height="16" rx="8" stroke="#3f3f46" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                    </g>

                    {/* Center icon */}
                    <circle cx="120" cy="120" r="30" fill="#18181b" stroke="#27272a" strokeWidth="2" />
                    <path d="M120 105 L120 135 M105 120 L135 120" stroke="#52525b" strokeWidth="3" strokeLinecap="round" />

                    {/* Floating particles */}
                    <circle cx="85" cy="60" r="3" fill="#ccff00" opacity="0.4">
                        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="155" cy="70" r="2" fill="#6366f1" opacity="0.3">
                        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="90" cy="180" r="2.5" fill="#ccff00" opacity="0.5">
                        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="165" cy="175" r="2" fill="#6366f1" opacity="0.4">
                        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2.2s" repeatCount="indefinite" />
                    </circle>

                    <defs>
                        <radialGradient id="glow">
                            <stop offset="0%" stopColor="#ccff00" />
                            <stop offset="100%" stopColor="#6366f1" />
                        </radialGradient>
                    </defs>
                </svg>
            </div>

            {/* Text */}
            <h3 className="text-xl font-bold mb-2">No Jobs Queued</h3>
            <p className="text-zinc-500 text-sm text-center max-w-md mb-8">
                Your operations queue is empty. Start by creating a new generation job to see it appear here with real-time tracking.
            </p>

            {/* CTA */}
            <a
                href="/creative"
                className="px-6 py-3 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Queue New Job
            </a>
        </div>
    );
}

