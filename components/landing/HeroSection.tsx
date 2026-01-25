'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bell, Shield, Clock, ArrowRight } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-b from-blue-50/50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Text Content */}
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
                                Never miss a deadline again
                            </span>
                            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
                                Organize your purchases, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    timely reminders.
                                </span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                ReNotify keeps track of your warranties, AMCs, and important dates automatically.
                                Store details, get alerts, and stay worry-free.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link
                                    href="/login"
                                    className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Get Started <ArrowRight size={18} />
                                </Link>
                                <Link
                                    href="/login"
                                    className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold hover:bg-slate-50 transition-all flex items-center justify-center"
                                >
                                    Login
                                </Link>
                            </div>
                        </motion.div>
                    </div>

                    {/* Visual Element */}
                    <div className="lg:w-1/2 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative w-full aspect-square max-w-[500px] mx-auto"
                        >
                            {/* Main Circle */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-full opacity-50 blur-3xl" />

                            {/* Central Bell */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <div className="w-64 h-64 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/60 shadow-glass flex items-center justify-center relative">
                                    <div className="p-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                                        <Bell className="text-white w-24 h-24" />
                                    </div>

                                    {/* Floating Elements around Bell */}
                                    <motion.div
                                        animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                                        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                                        className="absolute -top-12 -right-12 p-4 bg-white rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100"
                                    >
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Shield className="text-green-600 w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500">Warranty</div>
                                            <div className="text-sm font-bold text-slate-800">Active</div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
                                        transition={{ duration: 6, repeat: Infinity, delay: 2 }}
                                        className="absolute -bottom-8 -left-8 p-4 bg-white rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100"
                                    >
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <Clock className="text-orange-600 w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500">Reminder</div>
                                            <div className="text-sm font-bold text-slate-800">In 2 days</div>
                                        </div>
                                    </motion.div>

                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
