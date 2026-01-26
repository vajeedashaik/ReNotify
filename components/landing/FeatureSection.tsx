'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Calendar, Zap, ShieldCheck } from 'lucide-react';

const features = [
    {
        title: "Centralized Purchase Tracking",
        description: "Keep all your invoices, bills, and product details in one secure vault. No more digging through emails or drawers when you need them.",
        icon: ShoppingBag,
        color: "bg-blue-100 text-blue-600",
        visual: (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex-shrink-0" />
                        <div className="ml-4 flex-1">
                            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-slate-100 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        )
    },
    {
        title: "Warranty & AMC Timelines",
        description: "Visualize your protection plans. Know exactly when a warranty expires or when an AMC needs renewal.",
        icon: ShieldCheck,
        color: "bg-indigo-100 text-indigo-600",
        visual: (
            <div className="relative h-64 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 p-6 shadow-sm flex flex-col justify-center">
                <div className="relative pt-8">
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-100 rounded-full" />
                    <div className="absolute top-0 left-0 w-2/3 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full" />

                    <div className="absolute -top-1.5 left-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
                    <div className="absolute -top-1.5 left-2/3 w-4 h-4 bg-indigo-500 rounded-full border-2 border-white shadow-sm" />

                    <div className="mt-4 flex justify-between text-sm text-slate-500 font-medium">
                        <span>Purchase Date</span>
                        <span>Expiry Date</span>
                    </div>
                </div>
            </div>
        )
    },
    {
        title: "Smart Automations",
        description: "Set it and forget it. ReNotify automatically calculates upcoming dates and sends you gentle nudges so you're always prepared.",
        icon: Zap,
        color: "bg-violet-100 text-violet-600",
        visual: (
            <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm flex items-center justify-center">
                        <div className="w-8 h-8 rounded bg-slate-100" />
                    </div>
                ))}
            </div>
        )
    }
];

export default function FeatureSection() {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to stay organized</h2>
                    <p className="text-lg text-slate-600">Built to handle all your product lifecycles with precision and care.</p>
                </div>

                <div className="space-y-32">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7 }}
                            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
                        >
                            {/* Text Side */}
                            <div className="lg:w-1/2">
                                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                                    <feature.icon size={28} />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                                <p className="text-lg text-slate-600 leading-relaxed">
                                    {feature.description}
                                </p>
                                <motion.div
                                    className="mt-8 h-1 w-20 bg-slate-200 rounded-full overflow-hidden"
                                    whileInView={{ width: 80 }}
                                    initial={{ width: 0 }}
                                >
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                                </motion.div>
                            </div>

                            {/* Visual Side */}
                            <div className="lg:w-1/2 w-full">
                                <div className="relative aspect-[4/3] bg-gradient-to-br from-white to-blue-50 rounded-3xl border border-white/80 shadow-soft-lg p-8 overflow-hidden group">
                                    <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
                                    <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-500">
                                        {feature.visual}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
