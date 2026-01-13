"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Bell, Zap, Monitor, Activity, LogOut, ChevronRight } from "lucide-react";
import { GlowButton } from "@/components/GlowButton";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AdminSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AdminSettingsModal({ isOpen, onClose }: AdminSettingsModalProps) {
    const [activeTab, setActiveTab] = useState("system");
    const [toggles, setToggles] = useState({
        maintenance: false,
        notifications: true,
        sounds: true,
        animations: true,
    });

    const toggle = (key: keyof typeof toggles) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

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
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 m-auto w-full max-w-2xl h-[600px] glass rounded-[40px] border border-white/10 z-[101] overflow-hidden flex flex-col md:flex-row shadow-[0_0_50px_rgba(255,77,166,0.1)]"
                    >
                        {/* Sidebar */}
                        <div className="w-full md:w-64 bg-white/5 border-r border-white/5 p-6 flex flex-col gap-2">
                            <h2 className="text-xl font-black uppercase tracking-tighter mb-8 px-4 flex items-center gap-3">
                                <SettingsIcon className="text-neon-pink" />
                                Settings
                            </h2>

                            {[
                                { id: "system", label: "System", icon: Monitor },
                                { id: "notifications", label: "Notifications", icon: Bell },
                                { id: "security", label: "Security", icon: Shield },
                                { id: "about", label: "About", icon: Activity },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all",
                                        activeTab === tab.id
                                            ? "bg-neon-pink/10 text-neon-pink font-bold"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <tab.icon size={18} />
                                    <span className="text-sm">{tab.label}</span>
                                    {activeTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
                                </button>
                            ))}

                            <div className="mt-auto pt-6 border-t border-white/5">
                                <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-red-400 hover:bg-red-500/10 w-full transition-all">
                                    <LogOut size={18} />
                                    <span className="text-sm font-bold">Log Out</span>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-8 overflow-y-auto relative">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                            >
                                <X size={20} />
                            </button>

                            {activeTab === "system" && (
                                <div className="space-y-8">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-bold text-white">System Controls</h3>
                                        <p className="text-gray-400 text-sm">Manage core platform behaviors.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <ToggleItem
                                            label="Maintenance Mode"
                                            desc="Disables public access to the site."
                                            active={toggles.maintenance}
                                            onClick={() => toggle('maintenance')}
                                            color="pink"
                                        />
                                        <ToggleItem
                                            label="Enable Animations"
                                            desc="Global toggle for UI motion effects."
                                            active={toggles.animations}
                                            onClick={() => toggle('animations')}
                                            color="blue"
                                        />
                                        <ToggleItem
                                            label="Sound Effects"
                                            desc="UI feedback sounds."
                                            active={toggles.sounds}
                                            onClick={() => toggle('sounds')}
                                            color="purple"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === "notifications" && (
                                <div className="space-y-8">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-bold text-white">Notifications</h3>
                                        <p className="text-gray-400 text-sm">Configure alerts and chirps.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <ToggleItem
                                            label="Push Notifications"
                                            desc="Receive browser alerts."
                                            active={toggles.notifications}
                                            onClick={() => toggle('notifications')}
                                            color="yellow"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === "about" && (
                                <div className="space-y-8">
                                    <div className="text-center py-12">
                                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(255,77,166,0.3)] mb-6">
                                            <span className="text-5xl font-black text-white">R</span>
                                        </div>
                                        <h3 className="text-3xl font-black uppercase tracking-tighter">Rand Admin</h3>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function SettingsIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}

interface ToggleItemProps {
    label: string;
    desc: string;
    active: boolean;
    onClick: () => void;
    color?: "pink" | "blue" | "purple" | "yellow";
}

function ToggleItem({ label, desc, active, onClick, color = "pink" }: ToggleItemProps) {
    const colors = {
        pink: "bg-neon-pink shadow-[0_0_15px_#FF4DA6]",
        blue: "bg-neon-blue shadow-[0_0_15px_#4BD0FF]",
        purple: "bg-neon-purple shadow-[0_0_15px_#9B5CFF]",
        yellow: "bg-yellow-400 shadow-[0_0_15px_#FACC15]",
    };

    return (
        <div
            onClick={onClick}
            className="flex items-center justify-between p-4 rounded-2xl glass hover:bg-white/5 cursor-pointer group transition-all"
        >
            <div>
                <div className="font-bold text-white group-hover:text-neon-blue transition-colors">{label}</div>
                <div className="text-xs text-gray-500">{desc}</div>
            </div>
            <div className={cn(
                "w-12 h-6 rounded-full relative transition-colors duration-300",
                active ? "bg-white/20" : "bg-white/5"
            )}>
                <div className={cn(
                    "absolute top-1 left-1 w-4 h-4 rounded-full transition-all duration-300",
                    active ? `translate-x-6 ${colors[color]}` : "bg-gray-500"
                )} />
            </div>
        </div>
    );
}
