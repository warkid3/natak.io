"use client";

import React from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    count: number;
    loading: boolean;
}

export const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, count, loading }: DeleteConfirmationModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                    >
                        <div className="bg-[#0F0F11] border border-red-900/40 rounded-xl shadow-2xl shadow-red-900/20 overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                                        <Trash2 className="w-5 h-5 text-red-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white mb-1">Delete {count} Assets?</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Are you sure you want to delete these items? This action cannot be undone and will permanently remove them from your storage.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-black/20 border-t border-white/5 flex gap-3 justify-end">
                                <Button
                                    variant="ghost"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="text-slate-400 hover:text-white"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={onConfirm}
                                    disabled={loading}
                                    className="bg-red-600 hover:bg-red-700 text-white border-none shadow-lg shadow-red-900/20"
                                >
                                    {loading ? 'Deleting...' : 'Confirm Delete'}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
