"use client";

import React, { useContext, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { MouseStateContext } from "./CardContainer";

interface CardItemProps {
  children: React.ReactNode;
  className?: string;
  as?:
    | "div"
    | "a"
    | "button"
    | "p"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "span";
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  springFactor?: number;
  href?: string;
  target?: string;
  onClick?: () => void;
}

export default function CardItem({
  children,
  className,
  as = "div",
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  springFactor = 0.15,
  ...props
}: CardItemProps) {
  const elementRef = useRef<HTMLElement>(null);
  const mouseState = useContext(MouseStateContext);
  const currentRef = useRef({ x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 });
  const targetRef = useRef({ x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 });
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

  // Update target when mouse state changes
  useEffect(() => {
    if (mouseState?.isMouseEntered) {
      targetRef.current = {
        x: Number(translateX),
        y: Number(translateY),
        z: Number(translateZ),
        rx: Number(rotateX),
        ry: Number(rotateY),
        rz: Number(rotateZ),
      };
    } else {
      targetRef.current = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 };
    }

    // Start animation loop if not already running
    if (!isTouchRef.current && !isAnimatingRef.current) {
      isAnimatingRef.current = true;
      const animate = () => {
        if (!elementRef.current) {
          isAnimatingRef.current = false;
          return;
        }

        const cur = currentRef.current;
        const tgt = targetRef.current;
        const sf = springFactor;

        cur.x += (tgt.x - cur.x) * sf;
        cur.y += (tgt.y - cur.y) * sf;
        cur.z += (tgt.z - cur.z) * sf;
        cur.rx += (tgt.rx - cur.rx) * sf;
        cur.ry += (tgt.ry - cur.ry) * sf;
        cur.rz += (tgt.rz - cur.rz) * sf;

        elementRef.current.style.transform =
          `translateX(${cur.x}px) translateY(${cur.y}px) translateZ(${cur.z}px) rotateX(${cur.rx}deg) rotateY(${cur.ry}deg) rotateZ(${cur.rz}deg)`;

        // Stop animating when close enough to target
        const delta = Math.abs(tgt.x - cur.x) + Math.abs(tgt.y - cur.y) + Math.abs(tgt.z - cur.z)
          + Math.abs(tgt.rx - cur.rx) + Math.abs(tgt.ry - cur.ry) + Math.abs(tgt.rz - cur.rz);
        if (delta < 0.01) {
          isAnimatingRef.current = false;
          return;
        }

        rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [
    mouseState?.isMouseEntered,
    translateX, translateY, translateZ,
    rotateX, rotateY, rotateZ,
    springFactor,
  ]);

  const Component = as;

  return React.createElement(
    Component,
    {
      ref: elementRef,
      className: cn("w-fit", className),
      ...props,
    },
    children
  );
}
