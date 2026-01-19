"use client";

import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

const MOCK_HISTORICAL_DATA = [
    { name: 'Mon', spend: 400, approved: 120, rejected: 20 },
    { name: 'Tue', spend: 300, approved: 98, rejected: 15 },
    { name: 'Wed', spend: 600, approved: 180, rejected: 45 },
    { name: 'Thu', spend: 800, approved: 240, rejected: 30 },
    { name: 'Fri', spend: 500, approved: 150, rejected: 10 },
    { name: 'Sat', spend: 200, approved: 60, rejected: 5 },
    { name: 'Sun', spend: 100, approved: 30, rejected: 2 },
];

const QUALITY_DATA = [
    { name: 'Approved', value: 82 },
    { name: 'User Error', value: 12 },
    { name: 'System Error', value: 6 },
];

const COLORS = ['#10b981', '#64748b', '#f43f5e'];

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white p-8 space-y-6">
            <header>
                <h1 className="text-2xl font-bold">Operational Performance</h1>
                <p className="text-zinc-500 text-sm">Real-time health of the content assembly line</p>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Accept Rate', value: '82.4%', sub: '+2.1% from target', color: 'text-emerald-500' },
                    { label: 'Refund Rate', value: '4.8%', sub: 'Target <5%', color: 'text-emerald-500' },
                    { label: 'Avg QC Time', value: '24s', sub: 'Target <30s', color: 'text-blue-500' },
                    { label: 'Daily Throughput', value: '1,420', sub: 'Jobs/24h', color: 'text-white' },
                ].map((kpi, i) => (
                    <div key={i} className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <div className="text-xs text-zinc-500 font-medium uppercase mb-1">{kpi.label}</div>
                        <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                        <div className="text-[10px] text-zinc-600 mt-1 uppercase font-bold tracking-tight">{kpi.sub}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Credit Utilization */}
                <div className="lg:col-span-2 p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                    <h3 className="text-sm font-semibold mb-6">Credit Spend vs Production (7D)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_HISTORICAL_DATA}>
                                <defs>
                                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                                    itemStyle={{ color: '#e4e4e7' }}
                                />
                                <Area type="monotone" dataKey="spend" stroke="#4f46e5" fillOpacity={1} fill="url(#colorSpend)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quality Triage */}
                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col">
                    <h3 className="text-sm font-semibold mb-6">Output Yield Triage</h3>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={QUALITY_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {QUALITY_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-3 w-full mt-4">
                            {QUALITY_DATA.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                                        <span className="text-zinc-400">{item.name}</span>
                                    </div>
                                    <span className="font-bold">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottleneck Monitor */}
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                <h3 className="text-sm font-semibold mb-6">Pipeline Velocity & Health</h3>
                <div className="grid grid-cols-5 gap-4">
                    {[
                        { name: 'Base Gen', time: '45s', health: 98, status: 'Normal' },
                        { name: 'Cloth Swap', time: '82s', health: 72, status: 'Warning' },
                        { name: 'Upscale', time: '65s', health: 95, status: 'Normal' },
                        { name: 'Video Prep', time: '142s', health: 88, status: 'Slow' },
                        { name: 'Render', time: '12s', health: 99, status: 'Normal' },
                    ].map((step, idx) => (
                        <div key={idx} className="p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                            <div className="text-[10px] text-zinc-500 uppercase font-bold mb-2">{step.name}</div>
                            <div className="text-lg font-bold mb-1">{step.time}</div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${step.health > 90 ? 'bg-emerald-500' : step.health > 80 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                        style={{ width: `${step.health}%` }}
                                    />
                                </div>
                                <span className={`text-[10px] font-bold ${step.status === 'Warning' ? 'text-rose-500' : step.status === 'Slow' ? 'text-amber-500' : 'text-zinc-500'}`}>
                                    {step.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
