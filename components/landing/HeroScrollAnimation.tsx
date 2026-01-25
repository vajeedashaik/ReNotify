'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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

    // Map scroll (0 to 1) to frame index (0 to 79)
    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

    // Smooth out the frame transition slightly
    const smoothFrameIndex = useSpring(frameIndex, { stiffness: 200, damping: 30 });

    // Preload Images
    useEffect(() => {
        let loadedCount = 0;
        const imgArray: HTMLImageElement[] = [];

        const loadImages = async () => {
            for (let i = 0; i < FRAME_COUNT; i++) {
                const img = new Image();
                // Format number with leading zeros (000, 001, etc.)
                const formattedIndex = i.toString().padStart(3, '0');
                img.src = `/hero-sequence/frame_${formattedIndex}.jpg`;

                await new Promise((resolve) => {
                    img.onload = () => {
                        loadedCount++;
                        setLoadingProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
                        resolve(true);
                    };
                    // Handle error so one bad image doesn't break everything
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

        // Use the floor of the smooth index to get an integer frame
        const currentFrame = images[Math.floor(index)];
        if (!currentFrame) return;

        // Responsive Canvas Handling (Maintain Aspect Ratio / Cover)
        const setCanvasSize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
        };
        // Ensure size is correct (can optimize to not call every frame)
        if (canvas.width !== canvas.parentElement?.clientWidth) {
            setCanvasSize();
        }

        // Draw Image 'Cover' style
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

    // Listen to frame index changes and draw
    useMotionValueEvent(smoothFrameIndex, "change", (latest) => {
        if (!isLoading) {
            // Clamp index
            const idx = Math.max(0, Math.min(latest, FRAME_COUNT - 1));
            renderFrame(idx);
        }
    });

    // Initial draw when loaded
    useEffect(() => {
        if (!isLoading && images.length > 0) {
            renderFrame(0);
        }
    }, [isLoading, images]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (!isLoading && images.length > 0) renderFrame(smoothFrameIndex.get());
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isLoading, images, smoothFrameIndex]);


    return (
        <div ref={containerRef} className="relative h-[250vh] bg-white">
            <div className="sticky top-0 h-screen w-full overflow-hidden">

                {/* Loading State */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-50 z-50">
                        <div className="text-center">
                            <div className="mb-4 text-4xl font-bold text-blue-600 animate-pulse">{loadingProgress}%</div>
                            <div className="text-slate-500">Loading experience...</div>
                        </div>
                    </div>
                )}

                {/* Canvas Layer */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-transparent to-white/90 pointer-events-none" />


                {/* Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="text-center max-w-4xl px-4 pointer-events-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
                                Never miss <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    important moments.
                                </span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                                ReNotify seamlessly tracks your purchases, warranties, and service reminders so you can focus on what matters.
                            </p>

                            <div className="flex items-center justify-center gap-4">
                                <Link
                                    href="/login"
                                    className="px-8 py-4 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    Get Started <ArrowRight size={18} />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-slate-400 flex flex-col items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                >
                    <span className="text-sm font-medium uppercase tracking-widest">Scroll to explore</span>
                    <div className="w-1 h-12 bg-slate-200 rounded-full overflow-hidden">
                        <motion.div
                            className="w-full bg-blue-500"
                            style={{ height: "30%" }}
                            animate={{ y: [0, 40, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
