'use client';

import React from 'react';

export default function LandingBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Animated blue gradient base */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-700 via-accent-600 to-accent-800 opacity-95 animate-gradient-shift"
        style={{ backgroundSize: '200% 200%' }}
      />
      {/* Soft overlay for depth */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-primary-900/30 via-transparent to-accent-900/20"
        aria-hidden="true"
      />

      {/* Floating 3D blobs - desktop: 6 blobs, mobile: 3 */}
      <div
        className="absolute inset-0 [transform-style:preserve-3d]"
        style={{ perspective: '1200px' }}
      >
        <div
          className="absolute w-[min(40vw,320px)] h-[min(40vw,320px)] rounded-full blur-3xl opacity-30 bg-gradient-to-br from-primary-400 to-accent-500 animate-float"
          style={{
            top: '10%',
            left: '5%',
            transform: 'rotateX(15deg) rotateY(-10deg)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute w-[min(35vw,280px)] h-[min(35vw,280px)] rounded-full blur-3xl opacity-25 bg-gradient-to-tr from-accent-400 to-primary-600 animate-float-reverse"
          style={{
            top: '50%',
            right: '0%',
            transform: 'rotateX(-20deg) rotateY(15deg)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute w-[min(45vw,360px)] h-[min(45vw,360px)] rounded-full blur-3xl opacity-20 bg-gradient-to-bl from-primary-500 via-accent-400 to-primary-600 animate-float-slow"
          style={{
            bottom: '5%',
            left: '20%',
            transform: 'rotateX(10deg) rotateY(20deg)',
          }}
          aria-hidden="true"
        />
        {/* Additional blobs - hidden on small screens for performance */}
        <div
          className="absolute hidden sm:block w-[min(30vw,240px)] h-[min(30vw,240px)] rounded-full blur-3xl opacity-25 bg-gradient-to-br from-accent-300 to-primary-500 animate-float"
          style={{
            top: '25%',
            right: '15%',
            transform: 'rotateX(-15deg) rotateY(-5deg)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute hidden md:block w-[min(28vw,220px)] h-[min(28vw,220px)] rounded-full blur-3xl opacity-20 bg-gradient-to-tl from-primary-400 to-accent-600 animate-float-reverse"
          style={{
            bottom: '30%',
            right: '25%',
            transform: 'rotateX(5deg) rotateY(-15deg)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute hidden lg:block w-[min(25vw,200px)] h-[min(25vw,200px)] rounded-full blur-3xl opacity-25 bg-gradient-to-br from-accent-500 to-primary-700 animate-float-slow"
          style={{
            top: '60%',
            left: '5%',
            transform: 'rotateX(-10deg) rotateY(10deg)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Subtle grid overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />
    </div>
  );
}
