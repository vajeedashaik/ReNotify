'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

const FRAME_COUNT = 80;

export default function HeroScrollAnimation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Scroll progress relative to the container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Map scroll (0 to 1) to frame index
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);
    const smoothFrameIndex = useSpring(frameIndex, { stiffness: 200, damping: 30 });

    // Preload Images
    useEffect(() => {
        let loadedCount = 0;
        const imgArray: HTMLImageElement[] = [];

        const loadImages = async () => {
            for (let i = 0; i < FRAME_COUNT; i++) {
                const img = new Image();
                const formattedIndex = i.toString().padStart(3, '0');
                img.src = `/hero-sequence/frame_${formattedIndex}.jpg`;

                await new Promise((resolve) => {
                    img.onload = () => {
                        loadedCount++;
                        setLoadingProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
                        resolve(true);
                    };
                    img.onerror = () => resolve(false);
                });

                imgArray.push(img);
            }
            setImages(imgArray);
            setIsLoading(false);
        };

        loadImages();
    }, []);

    // Render to Canvas
    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const currentFrame = images[Math.floor(index)];
        if (!currentFrame) return;

        // Responsive Canvas Handling
        const setCanvasSize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
        };

        if (canvas.width !== canvas.parentElement?.clientWidth || canvas.height !== canvas.parentElement?.clientHeight) {
            setCanvasSize();
        }

        const hRatio = canvas.width / currentFrame.width;
        const vRatio = canvas.height / currentFrame.height;
        const ratio = Math.max(hRatio, vRatio);

        const centerShift_x = (canvas.width - currentFrame.width * ratio) / 2;
        const centerShift_y = (canvas.height - currentFrame.height * ratio) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            currentFrame,
            0, 0, currentFrame.width, currentFrame.height,
            centerShift_x, centerShift_y, currentFrame.width * ratio, currentFrame.height * ratio
        );
    };

    useMotionValueEvent(smoothFrameIndex, "change", (latest) => {
        if (!isLoading) {
            const idx = Math.max(0, Math.min(latest, FRAME_COUNT - 1));
            renderFrame(idx);
        }
    });

    useEffect(() => {
        if (!isLoading && images.length > 0) {
            renderFrame(0);
        }
    }, [isLoading, images]);

    useEffect(() => {
        const handleResize = () => {
            if (!isLoading && images.length > 0) renderFrame(smoothFrameIndex.get());
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isLoading, images, smoothFrameIndex]);


    return (
        <div ref={containerRef} className="relative h-[150vh] bg-white">
            <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row items-center justify-center overflow-hidden p-4 md:p-8 gap-8">

                {/* Loading State Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
                        <div className="text-center">
                            <div className="mb-4 text-4xl font-bold text-blue-600 animate-pulse">{loadingProgress}%</div>
                            <div className="text-slate-500">Loading experience...</div>
                        </div>
                    </div>
                )}

                {/* Text Container (Left - 30%) */}
                <div className="w-full md:w-[35%] flex flex-col justify-center z-10 p-4 order-2 md:order-1">
                    <motion.div
                        className="max-w-lg"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
                            Never miss <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                important moments.
                            </span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            ReNotify seamlessly tracks your purchases, warranties, and service reminders so you can focus on what matters.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/app/login"
                                className="px-8 py-3.5 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                Get Started <ArrowRight size={18} />
                            </Link>
                            <Link
                                href="/admin/login"
                                className="px-8 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-full font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                            >
                                <ShieldCheck size={18} /> Admin Login
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Animation Card (Right - 70%) */}
                <div className="w-full md:w-[65%] h-[50vh] md:h-[60vh] relative order-1 md:order-2">
                    <div className="relative w-full h-full rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden bg-slate-50">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full object-cover"
                        />

                        {/* Scroll Indicator Inside Card */}
                        <motion.div
                            className="absolute bottom-8 left-8 text-slate-400/80 flex items-center gap-3 z-20 backdrop-blur-sm px-4 py-2 rounded-full bg-white/30"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5, duration: 1 }}
                        >
                            <div className="w-1 h-8 bg-slate-400/30 rounded-full overflow-hidden">
                                <motion.div
                                    className="w-full bg-slate-600"
                                    style={{ height: "30%" }}
                                    animate={{ y: [0, 24, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </div>
                            <span className="text-xs font-medium uppercase tracking-widest text-slate-600">Scroll</span>
                        </motion.div>
                    </div>
                </div>

            </div>
        </div>
    );
}
