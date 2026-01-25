'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, ArrowRight } from 'lucide-react';

export default function CTASection() {
    return (
        <footer className="bg-white pt-24 pb-12 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Main CTA */}
                <div className="bg-slate-900 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden mb-24">
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
                    </div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Ready to get organized?
                        </h2>
                        <p className="text-slate-300 text-lg mb-10">
                            Join thousands of users who never miss a warranty claim or AMC renewal.
                            Start tracking your purchases intelligently today.
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-50 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                            Get Started Now <ArrowRight size={20} />
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
