"use client";

import React, { createContext, useRef, useState, useEffect, useCallback } from "react";
import { useMouseState } from "./useMouseState";

export const MouseStateContext = createContext<ReturnType<
  typeof useMouseState
> | null>(null);

interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  rotationFactor?: number;
  perspective?: number;
  dampingFactor?: number;
}

export default function CardContainer({
  children,
  className = "",
  containerClassName = "",
  rotationFactor = 15,
  perspective = 1200,
  dampingFactor = 0.9,
}: CardContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseState = useMouseState();
  const rotationRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const isTouchRef = useRef(false);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    isTouchRef.current = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const startAnimation = useCallback(() => {
    if (isTouchRef.current || isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const animate = () => {
      if (!containerRef.current) {
        isAnimatingRef.current = false;
        return;
      }

      const rot = rotationRef.current;
      const tgt = targetRef.current;
      const factor = 1 - dampingFactor;

      rot.x += (tgt.x - rot.x) * factor;
      rot.y += (tgt.y - rot.y) * factor;

      containerRef.current.style.transform = `rotateY(${rot.x}deg) rotateX(${rot.y}deg)`;

      // Stop animating when close enough
      if (Math.abs(tgt.x - rot.x) + Math.abs(tgt.y - rot.y) < 0.01) {
        isAnimatingRef.current = false;
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [dampingFactor]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (isTouchRef.current || !containerRef.current) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();

    const x = (e.clientX - left - width / 2) / rotationFactor;
    const y = (e.clientY - top - height / 2) / rotationFactor;

    targetRef.current = { x, y: -y };
    startAnimation();
  }

  function handleMouseEnter() {
    mouseState.setMouseEntered(true);
  }

  function handleMouseLeave() {
    if (!containerRef.current) return;
    mouseState.setMouseEntered(false);
    targetRef.current = { x: 0, y: 0 };
    startAnimation();
  }

  return (
    <MouseStateContext.Provider value={mouseState}>
      <div
        className={`flex items-center justify-center p-2 ${containerClassName}`}
        style={{ perspective: `${perspective}px` }}
      >
        <div
          ref={containerRef}
          className={`relative flex items-center justify-center ${className}`}
          style={{ transformStyle: "preserve-3d" }}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </div>
      </div>
    </MouseStateContext.Provider>
  );
}
