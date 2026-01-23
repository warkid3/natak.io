"use client";

import React, { useState } from 'react';
import { OperationsJob } from '@/types/operations';
import { X } from 'lucide-react';

interface JobDetailsModalProps {
    job: OperationsJob;
    onClose: () => void;
    onAction: (action: 'retry' | 'approve' | 'reject') => void;
}

export default function JobDetailsModal({ job, onClose, onAction }: JobDetailsModalProps) {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">{job.character_name || 'Unknown Character'}</h2>
                        <p className="text-sm text-zinc-500 font-mono">{job.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Preview */}
                <div className="p-6 space-y-6">
                    {job.output_url && (
                        <div className="aspect-video bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800">
                            <img src={job.output_url} alt="Output" className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Job Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <InfoCard label="Status" value={job.status.toUpperCase()} />
                        <InfoCard label="Platform" value={job.platform} />
                        <InfoCard label="Format" value={job.format} />
                        <InfoCard label="Progress" value={`${job.progress}%`} />
                        <InfoCard label="Current Step" value={`${job.current_step}/5`} />
                        <InfoCard label="Cost" value={`$${job.cost.toFixed(2)}`} />
                        <InfoCard label="Retry Count" value={job.retry_count.toString()} />
                        <InfoCard label="Safety Profile" value={job.is_nsfw ? 'Unfiltered' : 'Standard'} />
                    </div>

                    {/* Prompt */}
                    <div className="space-y-2">
                        <label className="text-xs text-zinc-500 uppercase font-bold">Prompt</label>
                        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm">
                            {job.prompt}
                        </div>
                    </div>

                    {/* Error (if failed) */}
                    {job.error && (
                        <div className="space-y-2">
                            <label className="text-xs text-rose-500 uppercase font-bold">Error</label>
                            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 text-sm text-rose-400">
                                {job.error}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-zinc-800">
                        {job.status === 'failed' && (
                            <button
                                onClick={() => onAction('retry')}
                                className="flex-1 bg-rose-500 text-white py-3 rounded-lg font-bold hover:bg-rose-600 transition-all"
                            >
                                Retry Job
                            </button>
                        )}
                        {job.status === 'completed' && job.quality_status === 'pending' && (
                            <>
                                <button
                                    onClick={() => onAction('approve')}
                                    className="flex-1 bg-emerald-500 text-black py-3 rounded-lg font-bold hover:bg-emerald-600 transition-all"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => onAction('reject')}
                                    className="flex-1 bg-zinc-800 text-white py-3 rounded-lg font-bold hover:bg-zinc-700 transition-all"
                                >
                                    Reject
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
            <div className="text-xs text-zinc-500 uppercase font-bold mb-1">{label}</div>
            <div className="text-lg font-bold">{value}</div>
        </div>
    );
}
