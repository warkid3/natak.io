"use client";

import React, { useState } from 'react';
import { JobStatus, PipelineStep, Job } from '@/lib/types';
import { STATUS_COLORS } from '@/lib/constants';
import { JobInspectorPanel } from './JobInspectorPanel';

const MOCK_JOBS: Job[] = [
    { id: 'JOB-001', character: 'Model_A_V2', platform: 'Instagram', isNSFW: false, format: 'Video', status: JobStatus.PROCESSING, currentStep: PipelineStep.VIDEO_PREP, progress: 65, timestamp: '14:20:05', cost: 0.15, retryCount: 0 },
    { id: 'JOB-002', character: 'Brand_Amb_01', platform: 'Twitter', isNSFW: false, format: 'Photo', status: JobStatus.FAILED, currentStep: PipelineStep.UPSCALE, progress: 40, timestamp: '14:21:12', cost: 0.02, error: 'Server Timeout', retryCount: 1 },
    { id: 'JOB-003', character: 'Model_A_V2', platform: 'Instagram', isNSFW: false, format: 'Photo', status: JobStatus.QUEUED, currentStep: PipelineStep.BASE_GEN, progress: 0, timestamp: '14:22:15', cost: 0.05, retryCount: 0 },
    { id: 'JOB-004', character: 'Vogue_01', platform: 'Client', isNSFW: false, format: 'Photo', status: JobStatus.COMPLETED, currentStep: PipelineStep.FINAL_RENDER, progress: 100, timestamp: '14:18:30', cost: 0.05, qualityStatus: 'Pending', retryCount: 0 },
    { id: 'JOB-005', character: 'Brand_Amb_01', platform: 'Instagram', isNSFW: false, format: 'Video', status: JobStatus.PAUSED, currentStep: PipelineStep.CLOTH_SWAP, progress: 20, timestamp: '14:15:00', cost: 0.02, retryCount: 0 },
    { id: 'JOB-006', character: 'Model_A_V2', platform: 'Instagram', isNSFW: false, format: 'Photo', status: JobStatus.COMPLETED, currentStep: PipelineStep.FINAL_RENDER, progress: 100, timestamp: '14:10:00', cost: 0.05, qualityStatus: 'Pending', retryCount: 0 },
    { id: 'JOB-007', character: 'Vogue_01', platform: 'Client', isNSFW: false, format: 'Photo', status: JobStatus.COMPLETED, currentStep: PipelineStep.FINAL_RENDER, progress: 100, timestamp: '14:05:00', cost: 0.05, qualityStatus: 'Pending', retryCount: 0 },
    { id: 'JOB-008', character: 'Brand_Amb_01', platform: 'Twitter', isNSFW: false, format: 'Video', status: JobStatus.PROCESSING, currentStep: PipelineStep.BASE_GEN, progress: 15, timestamp: '14:25:00', cost: 0.15, retryCount: 0 },
];

export function QueueManager() {
    const [filter, setFilter] = useState<string>('all jobs');
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
    const [inspectedJob, setInspectedJob] = useState<Job | null>(null);

    const filteredJobs = MOCK_JOBS.filter(job => {
        if (filter === 'all jobs') return true;
        if (filter === 'active') return job.status === JobStatus.PROCESSING;
        if (filter === 'failed') return job.status === JobStatus.FAILED;
        return true;
    });

    return (
        <div className="relative h-full flex flex-col p-6 overflow-hidden">
            {/* Advanced Action Bar */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8">
                <div className="space-y-1">
                    <h2 className="text-sm font-black tracking-tighter uppercase text-white leading-none italic whitespace-nowrap">
                        Production <span className="text-lime">Pipeline</span>
                    </h2>
                    <p className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest">Real-time oversight of active GPU assembly threads.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto scale-90 origin-right">
                    {/* View Toggles */}
                    <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-2xl shadow-inner">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${viewMode === 'table' ? 'bg-zinc-800 text-lime shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
                            Table
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${viewMode === 'grid' ? 'bg-zinc-800 text-lime shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            Grid
                        </button>
                    </div>
                </div>
            </header>

            {/* Filter Chips */}
            <div className="flex gap-2 pb-4 overflow-x-auto no-scrollbar">
                {['All Jobs', 'Active', 'Failed', 'QC Required', 'Stuck'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f.toLowerCase())}
                        className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${filter === f.toLowerCase()
                            ? 'bg-lime text-black border-lime'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pr-1 mt-4">
                {viewMode === 'table' ? (
                    <div className="bg-zinc-950/40 border border-zinc-900 rounded-[20px] overflow-hidden">
                        <table className="w-full text-left text-[10px] border-separate border-spacing-0">
                            <thead className="bg-zinc-950 text-zinc-500 uppercase font-black tracking-[0.2em]">
                                <tr>
                                    <th className="px-6 py-4 border-b border-zinc-900">Origin Identity</th>
                                    <th className="px-6 py-4 border-b border-zinc-900">Status</th>
                                    <th className="px-6 py-4 border-b border-zinc-900 text-right">Cost</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900">
                                {filteredJobs.map((job) => (
                                    <tr
                                        key={job.id}
                                        onClick={() => setInspectedJob(job)}
                                        className="hover:bg-white/5 transition-all group cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-zinc-800 overflow-hidden shrink-0 border border-white/5">
                                                    <img
                                                        src={`https://picsum.photos/seed/${job.id}/60/60`}
                                                        alt="Preview"
                                                        className={`w-full h-full object-cover ${job.status === JobStatus.QUEUED ? 'opacity-20' : 'opacity-100'}`}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-black text-white uppercase tracking-tight truncate max-w-[120px]">
                                                        {job.character}
                                                    </div>
                                                    <div className="text-[7px] font-black text-zinc-600 uppercase tracking-widest mt-0.5">
                                                        {job.platform}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-block px-2 py-0.5 rounded-full text-[7px] font-black border uppercase tracking-widest ${STATUS_COLORS[job.status]}`}>
                                                {job.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="font-black text-white">${job.cost.toFixed(2)}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredJobs.map((job) => (
                            <div
                                key={job.id}
                                onClick={() => setInspectedJob(job)}
                                className="relative bg-zinc-900/40 border border-zinc-800 rounded-[20px] overflow-hidden cursor-pointer group hover:border-lime/30 transition-all"
                            >
                                <div className="aspect-[4/3] relative">
                                    <img
                                        src={`https://picsum.photos/seed/${job.id}/400/300`}
                                        alt="Preview"
                                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-between">
                                        <div className="flex justify-end">
                                            <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border backdrop-blur-md ${STATUS_COLORS[job.status]}`}>
                                                {job.status}
                                            </span>
                                        </div>

                                        <div>
                                            <div className="font-black text-white text-sm tracking-tighter uppercase italic truncate">{job.character}</div>
                                            <div className="mt-2 w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                                <div className="bg-lime h-full shadow-[0_0_8px_rgba(223,255,0,0.6)]" style={{ width: `${job.progress}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Docked Inspector Panel */}
            {inspectedJob && (
                <JobInspectorPanel
                    job={inspectedJob}
                    onClose={() => setInspectedJob(null)}
                    onAction={(a: string) => {
                        console.log(`Action: ${a} for ${inspectedJob.id}`);
                        setInspectedJob(null);
                    }}
                />
            )}
        </div>
    );
}
