"use client";

import React from 'react';

const MOCK_KPIS = [
    { label: 'Accept Rate', value: '82.4%', sub: '+2.1% from target', color: 'text-emerald-500' },
    { label: 'Refund Rate', value: '4.8%', sub: 'Target <5%', color: 'text-emerald-500' },
    { label: 'Avg QC Time', value: '24s', sub: 'Target <30s', color: 'text-blue-500' },
    { label: 'Daily Throughput', value: '1,420', sub: 'Jobs/24h', color: 'text-white' },
];

const PIPELINE_STEPS = [
    { name: 'Base Gen', time: '45s', health: 98, status: 'Normal' },
    { name: 'Cloth Swap', time: '82s', health: 72, status: 'Warning' },
    { name: 'Upscale', time: '65s', health: 95, status: 'Normal' },
    { name: 'Video Prep', time: '142s', health: 88, status: 'Slow' },
    { name: 'Render', time: '12s', health: 99, status: 'Normal' },
];

export default function OperationsDashboard() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold">Operational Performance</h1>
                <p className="text-zinc-500 text-sm">Real-time health of the content assembly line</p>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {MOCK_KPIS.map((kpi, i) => (
                    <div key={i} className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <div className="text-xs text-zinc-500 font-medium uppercase mb-1">{kpi.label}</div>
                        <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                        <div className="text-[10px] text-zinc-600 mt-1 uppercase font-bold">{kpi.sub}</div>
                    </div>
                ))}
            </div>

            {/* Pipeline Velocity & Health */}
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                <h3 className="text-sm font-semibold mb-6">Pipeline Velocity & Health</h3>
                <div className="grid grid-cols-5 gap-4">
                    {PIPELINE_STEPS.map((step, idx) => (
                        <div key={idx} className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                            <div className="text-[10px] text-zinc-500 uppercase font-bold mb-2">{step.name}</div>
                            <div className="text-lg font-bold mb-1">{step.time}</div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${step.health > 90 ? 'bg-emerald-500' :
                                                step.health > 80 ? 'bg-amber-500' : 'bg-rose-500'
                                            }`}
                                        style={{ width: `${step.health}%` }}
                                    />
                                </div>
                                <span className={`text-[10px] font-bold ${step.status === 'Warning' ? 'text-rose-500' :
                                        step.status === 'Slow' ? 'text-amber-500' : 'text-zinc-500'
                                    }`}>
                                    {step.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <div className="text-xs text-zinc-500 font-medium uppercase mb-2">Active Batches</div>
                    <div className="text-3xl font-bold">12</div>
                </div>
                <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <div className="text-xs text-zinc-500 font-medium uppercase mb-2">Pending QC</div>
                    <div className="text-3xl font-bold text-amber-500">48 Items</div>
                </div>
            </div>
        </div>
    );
}
