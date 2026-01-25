'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';

const FRAME_COUNT = 80;

export default function CalendarScrollAnimation() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);
    const smoothFrameIndex = useSpring(frameIndex, { stiffness: 200, damping: 30 });

    useEffect(() => {
        const imgArray: HTMLImageElement[] = [];
        const loadImages = async () => {
            for (let i = 0; i < FRAME_COUNT; i++) {
                const img = new Image();
                const formattedIndex = i.toString().padStart(3, '0');
                img.src = `/calendar-sequence/frame_${formattedIndex}.jpg`;
                await new Promise((resolve) => {
                    img.onload = () => resolve(true);
                    img.onerror = () => resolve(false);
                });
                imgArray.push(img);
            }
            setImages(imgArray);
            setIsLoading(false);
        };
        loadImages();
    }, []);

    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const currentFrame = images[Math.floor(index)];
        if (!currentFrame) return;

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
            {/* Layout: Text Left, Anim Right. 30/70 Split. */}

            <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row items-center justify-center overflow-hidden p-4 md:p-8 gap-8">

                {/* Text Container (Left - 30%) */}
                <div className="w-full md:w-[35%] flex flex-col justify-center z-10 p-4 order-2 md:order-1">
                    <motion.div
                        className="max-w-lg text-left"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: false, amount: 0.5 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4 shadow-sm">
                            Automated Reminders
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                            Always on time
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Get notified before your warranty expires or your AMC is due.
                            Never miss an important date again with our automated calendar system.
                        </p>
                    </motion.div>
                </div>

                {/* Animation Card (Right - 70%) */}
                <div className="w-full md:w-[65%] h-[50vh] md:h-[60vh] relative order-1 md:order-2">
                    <div className="relative w-full h-full rounded-[40px] border border-slate-200 shadow-2xl overflow-hidden bg-slate-50">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
