"use client";

import React, { useState, useEffect } from 'react';
import { Users, FileText, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
    { id: 'organization', label: 'Organization', icon: Building2 },
];

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('users');
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAdminAccess();
    }, []);

    const checkAdminAccess = async () => {
        try {
            const userId = 'cceb1f9e-0dde-458d-a010-282cdf34e805'; // TODO: Get from auth
            const res = await fetch(`/api/admin/users?userId=${userId}`);

            if (res.status === 403) {
                setIsAdmin(false);
            } else {
                setIsAdmin(true);
            }
        } catch (error) {
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center">Loading...</div>;
    }

    if (!isAdmin) {
        return <UnauthorizedView />;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
                    <p className="text-zinc-500">Manage users, view audit logs, and configure organization settings</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <div className="w-64 flex-shrink-0">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-2 sticky top-8">
                            {TABS.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all",
                                            activeTab === tab.id
                                                ? 'bg-primary text-black'
                                                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        {activeTab === 'users' && <UsersTab />}
                        {activeTab === 'audit' && <AuditLogsTab />}
                        {activeTab === 'organization' && <OrganizationTab />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function UnauthorizedView() {
    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center p-8">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-500/10 flex items-center justify-center">
                    <Users className="w-10 h-10 text-rose-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
                <p className="text-zinc-500 mb-6">
                    You need administrator privileges to access this page. Contact your organization admin for access.
                </p>
                <a href="/" className="px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors inline-block">
                    Return to Dashboard
                </a>
            </div>
        </div>
    );
}

function UsersTab() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInvite, setShowInvite] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const userId = 'cceb1f9e-0dde-458d-a010-282cdf34e805';
            const res = await fetch(`/api/admin/users?userId=${userId}`);
            const data = await res.json();
            setUsers(data.users || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const changeRole = async (targetUserId: string, newRole: string) => {
        try {
            const userId = 'cceb1f9e-0dde-458d-a010-282cdf34e805';
            await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, targetUserId, role: newRole }),
            });
            fetchUsers();
        } catch (error) {
            console.error('Failed to change role:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold">User Management</h2>
                    <p className="text-sm text-zinc-500">{users.length} users in organization</p>
                </div>
                <button
                    onClick={() => setShowInvite(true)}
                    className="px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Invite User
                </button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-zinc-950 border-b border-zinc-800">
                        <tr className="text-left text-xs text-zinc-500 uppercase font-bold">
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Tier</th>
                            <th className="px-6 py-4">Credits</th>
                            <th className="px-6 py-4">Last Login</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {loading ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-zinc-500">Loading...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-zinc-500">No users found</td></tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold">{user.name || 'Unnamed'}</div>
                                        <div className="text-xs text-zinc-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => changeRole(user.id, e.target.value)}
                                            className="bg-zinc-950 border border-zinc-800 rounded px-3 py-1 text-sm"
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="creator">Creator</option>
                                            <option value="viewer">Viewer</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-zinc-800 rounded text-xs font-bold">{user.tier}</span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm">{user.credits?.toLocaleString() || 0}</td>
                                    <td className="px-6 py-4 text-sm text-zinc-500">
                                        {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-xs px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors">
                                            Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showInvite && <InviteModal onClose={() => setShowInvite(false)} onSuccess={fetchUsers} />}
        </div>
    );
}

function AuditLogsTab() {
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const userId = 'cceb1f9e-0dde-458d-a010-282cdf34e805';
            const res = await fetch(`/api/admin/audit-logs?userId=${userId}&limit=50`);
            const data = await res.json();
            setLogs(data.logs || []);
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Audit Logs</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-zinc-950 border-b border-zinc-800">
                        <tr className="text-left text-xs text-zinc-500 uppercase font-bold">
                            <th className="px-6 py-4">Timestamp</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Action</th>
                            <th className="px-6 py-4">Resource</th>
                            <th className="px-6 py-4">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-zinc-800/30 transition-colors">
                                <td className="px-6 py-4 text-zinc-500 font-mono text-xs">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-4">{log.profiles?.email || 'System'}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs font-bold">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs">{log.resource_type || '-'}</td>
                                <td className="px-6 py-4 text-zinc-500 text-xs max-w-md truncate">
                                    {JSON.stringify(log.details)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function OrganizationTab() {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-6">Organization Settings</h2>
            <div className="space-y-4">
                <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Organization Name</label>
                    <input
                        type="text"
                        defaultValue="Default Organization"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white"
                    />
                </div>
                <div>
                    <label className="text-sm text-zinc-400 mb-2 block">Tier</label>
                    <select className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white">
                        <option value="Starter">Starter</option>
                        <option value="Pro" selected>Pro</option>
                        <option value="Agency">Agency</option>
                    </select>
                </div>
                <button className="mt-6 px-6 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors">
                    Save Changes
                </button>
            </div>
        </div>
    );
}

function InviteModal({ onClose, onSuccess }: any) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('creator');

    const handleInvite = async () => {
        try {
            const userId = 'cceb1f9e-0dde-458d-a010-282cdf34e805';
            await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, email, role }),
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Invite failed:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-6">
                <h2 className="text-xl font-bold mb-4">Invite User</h2>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-zinc-400 mb-2 block">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white"
                            placeholder="user@example.com"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-zinc-400 mb-2 block">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white"
                        >
                            <option value="creator">Creator</option>
                            <option value="viewer">Viewer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleInvite}
                            disabled={!email}
                            className="flex-1 px-4 py-2 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            Send Invite
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
