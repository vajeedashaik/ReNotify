'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Menu, Plus, MoreHorizontal } from 'lucide-react';

export default function ProductPreview() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">Simple, clean, and powerful</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Design that gets out of your way. Focus on what matters—your data and your schedule.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative max-w-5xl mx-auto"
                >
                    {/* Dashboard Container */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-2xl overflow-hidden aspect-[16/10] flex flex-col">

                        {/* Mock Header */}
                        <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6">
                            <div className="flex items-center space-x-4">
                                <Menu size={20} className="text-slate-400" />
                                <span className="font-semibold text-slate-700">Dashboard</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Search size={20} className="text-slate-400" />
                                <Bell size={20} className="text-slate-400" />
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                                    JD
                                </div>
                            </div>
                        </div>

                        {/* Mock Body */}
                        <div className="flex-1 flex overflow-hidden">
                            {/* Mock Sidebar */}
                            <div className="w-64 bg-white border-r border-slate-200 flex-col py-6 px-4 space-y-2 hidden md:flex">
                                <div className="h-2 w-20 bg-slate-100 rounded mb-6" />
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium">All Items</div>
                                <div className="p-2 text-slate-500 text-sm font-medium">Warranties</div>
                                <div className="p-2 text-slate-500 text-sm font-medium">Archived</div>
                            </div>

                            {/* Mock Content */}
                            <div className="flex-1 p-8 bg-slate-50/50">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-xl font-bold text-slate-800">My Products</h3>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm">
                                        <Plus size={16} /> Add New
                                    </button>
                                </div>

                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    {[
                                        { name: "MacBook Pro M2", date: "Oct 24, 2024", status: "Active", color: "text-green-600 bg-green-50" },
                                        { name: "Sony Bravia 55' TV", date: "Aug 12, 2024", status: "Expiring Soon", color: "text-amber-600 bg-amber-50" },
                                        { name: "Dyson V15 Detect", date: "Jan 05, 2025", status: "Active", color: "text-green-600 bg-green-50" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100" />
                                                <div>
                                                    <div className="font-medium text-slate-800">{item.name}</div>
                                                    <div className="text-xs text-slate-500">Purchased {item.date}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.color}`}>
                                                    {item.status}
                                                </span>
                                                <MoreHorizontal size={16} className="text-slate-400" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Glass Overlay for Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-[20px] blur-xl -z-10 opacity-70" />
                </motion.div>
            </div>
        </section>
    );
}
