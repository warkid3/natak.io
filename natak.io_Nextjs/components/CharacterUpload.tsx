"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

interface CharacterUploadProps {
    onUploadStart: () => void;
    onUploadComplete: () => void;
    onFileChange?: (count: number) => void;
}

export default function CharacterUpload({ onUploadStart, onUploadComplete, onFileChange }: CharacterUploadProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [name, setName] = useState("");
    const [triggerWord, setTriggerWord] = useState("");
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    // Auto-generate trigger word on mount
    useEffect(() => {
        const generateTrigger = () => {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let result = "";
            for (let i = 0; i < 4; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };
        setTriggerWord(generateTrigger());
    }, []);

    // Sync file count with parent safely to avoid "Cannot update during render" error
    useEffect(() => {
        if (onFileChange) {
            onFileChange(files.length);
        }
    }, [files.length, onFileChange]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles((prev) => {
            const combined = [...prev, ...acceptedFiles];
            if (combined.length > 30) {
                // Use setTimeout to avoid blocking state updates or UI freezes
                setTimeout(() => alert("Maximum 30 images allowed. Trimming extra images."), 0);
                return combined.slice(0, 30);
            }
            return combined;
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        maxFiles: 30, // Dropzone internal limit
    });

    const handleRemove = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const promptClearAll = () => {
        setShowClearConfirm(true);
    };

    const confirmClearAll = () => {
        setFiles([]);
        setShowClearConfirm(false);
    };

    const startTraining = async () => {
        if (files.length < 20) {
            alert(`You have ${files.length} images. Minimum 20 required.`);
            return;
        }
        if (files.length > 30) {
            alert(`You have ${files.length} images. Maximum 30 allowed.`);
            return;
        }
        if (!name || !triggerWord) {
            alert("Please provide a name.");
            return;
        }

        setUploading(true);
        onUploadStart();

        try {
            // 1. Get presigned URLs for all files
            const uploadPromises = files.map(async (file) => {
                const res = await fetch("/api/lora/upload-url", {
                    method: "POST",
                    body: JSON.stringify({ filename: file.name, contentType: file.type }),
                });
                const { url, key } = await res.json();

                // 2. Upload to R2
                await fetch(url, {
                    method: "PUT",
                    body: file,
                    headers: { "Content-Type": file.type },
                });

                return key; // Return the R2 key (path)
            });

            const uploadedKeys = await Promise.all(uploadPromises);

            // 3. Trigger Training
            const trainRes = await fetch("/api/lora/train", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    triggerWord,
                    imageKeys: uploadedKeys,
                }),
            });

            const trainData = await trainRes.json();
            if (!trainRes.ok) throw new Error(trainData.error || "Training failed to start");

            onUploadComplete();
        } catch (error: any) {
            console.error(error);
            alert(`Error: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const isValidCount = files.length >= 20 && files.length <= 30;

    return (
        <div className="space-y-6">
            <ConfirmDialog
                isOpen={showClearConfirm}
                title="Discard all images?"
                description="This will remove all currently selected images from the upload queue."
                confirmText="Discard All"
                variant="danger"
                onConfirm={confirmClearAll}
                onCancel={() => setShowClearConfirm(false)}
            />

            <div>
                <h3 className="text-lg font-bold text-white mb-4">Train New Identity</h3>

                {/* Embedded Guidelines */}
                <div className="bg-purple-900/20 border border-purple-500/20 rounded-lg p-4 mb-6">
                    <h4 className="font-bold text-sm text-purple-400 mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4" /> Recommended Dataset (30 Images)
                    </h4>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-zinc-300">
                        <div className="flex justify-between border-b border-white/5 pb-1"><span>Close-ups (Face)</span> <span className="font-bold text-white">12</span></div>
                        <div className="flex justify-between border-b border-white/5 pb-1"><span>Three-quarter views</span> <span className="font-bold text-white">9</span></div>
                        <div className="flex justify-between border-b border-white/5 pb-1"><span>Profile views</span> <span className="font-bold text-white">6</span></div>
                        <div className="flex justify-between border-b border-white/5 pb-1"><span>Varied expressions</span> <span className="font-bold text-white">3</span></div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Character Name</label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Cyber Samurai"
                    className="bg-black/40 border-white/10 text-white"
                />
            </div>

            <div className="relative">
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${isDragActive ? "border-purple-500 bg-purple-500/10" : "border-zinc-700 hover:border-zinc-500"
                        }`}
                >
                    <input {...getInputProps()} />
                    <p className="text-zinc-400">
                        Drag & drop 20-30 images here, or click to select
                    </p>
                    <p className="text-xs text-zinc-500 mt-2">
                        (Supported: JPG, PNG, WEBP)
                    </p>
                </div>
                {files.length > 0 && (
                    <button
                        onClick={(e) => { e.stopPropagation(); promptClearAll(); }}
                        className="absolute top-2 right-2 z-10 text-xs text-red-400 hover:text-red-300 bg-zinc-900/80 hover:bg-zinc-900 px-3 py-1.5 rounded border border-red-900/50 transition-colors"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="grid grid-cols-5 gap-2">
                <AnimatePresence>
                    {files.map((file, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative aspect-square rounded-md overflow-hidden group"
                        >
                            <img
                                src={URL.createObjectURL(file)}
                                alt="preview"
                                className="object-cover w-full h-full"
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(i);
                                }}
                                className="absolute top-1 right-1 bg-red-500/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ✕
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="flex justify-between items-center text-sm">
                <span className={`${isValidCount ? "text-green-400" : "text-red-400"} font-bold`}>
                    {files.length} / 30 Images {files.length < 20 && "(Min 20 required)"}
                </span>
                <div className="bg-zinc-800/50 border border-white/5 rounded-md px-3 py-1.5 text-xs text-zinc-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    Est. Time: 10-20min
                </div>
            </div>

            <Button
                onClick={startTraining}
                disabled={uploading || !isValidCount || !name}
                className={`w-full font-bold py-3 ${isValidCount ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white" : "bg-zinc-800 text-zinc-500 cursor-not-allowed"}`}
            >
                {uploading ? "Uploading & Initializing..." : "Start Training (Generate for Free)"}
            </Button>
        </div>
    );
}
