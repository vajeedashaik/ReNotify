'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CTASection() {
    return (
        <footer className="bg-white pt-24 pb-12 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Main CTA */}
                <div className="text-center mb-24 max-w-3xl mx-auto">
                    <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-xl mb-8">
                        <Bell className="text-blue-600 w-8 h-8" />
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tight">
                        Never miss an important date.
                    </h2>

                    <p className="text-slate-500 text-xl mb-12 leading-relaxed">
                        Simple, automated, and reliable. ReNotify keeps your purchases and warranties organized so you can focus on what matters.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/app/login"
                            className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
                        >
                            Get Started <ArrowRight size={20} />
                        </Link>

                        <Link
                            href="/admin/login"
                            className="w-full sm:w-auto px-10 py-4 bg-white text-slate-600 border border-slate-200 rounded-full font-bold hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                        >
                            <ShieldCheck size={20} /> Admin Login
                        </Link>
                    </div>
                </div>

                {/* Footer Content */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-100">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <div className="p-1.5 bg-blue-50 rounded-lg">
                            <Bell className="text-blue-600" size={20} />
                        </div>
                        <span className="text-lg font-bold text-slate-800">ReNotify</span>
                    </div>

                    <div className="flex items-center space-x-8 text-sm text-slate-500">
                        <Link href="#" className="hover:text-slate-800 transition-colors">Privacy</Link>
                        <Link href="#" className="hover:text-slate-800 transition-colors">Terms</Link>
                        <Link href="#" className="hover:text-slate-800 transition-colors">Support</Link>
                    </div>

                    <div className="mt-4 md:mt-0 text-sm text-slate-400">
                        © {new Date().getFullYear()} ReNotify. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}
