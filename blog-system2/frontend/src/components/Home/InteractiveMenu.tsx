// components/SmoothRightMenu.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const menuItems = [
  { text: "Computer Vision Enthusiast", href: "#" },
  { text: "Deep Learning Developer", href: "#" },
  { text: "Academic Collaborator", href: "#" },
  { text: "Paper Reproducer", href: "#" },
  { text: "Frontier Explorer", href: "#" },
  { text: "AI Researcher", href: "#" },
];

export default function SmoothRightMenu() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none) and (pointer: coarse)").matches);
  }, []);

  const handleClick = (index: number) => {
    if (isTouch) return;
    setSelectedItem((prev) => (prev === index ? null : index));
  };

  return (
    <div className="flex w-full items-center md:justify-end md:pt-2 md:pr-4" style={{ marginRight: "var(--scrollbar-width, 0px)" }}>
      <nav className="text-right">
        <ul>
          {menuItems.map((item, index) => (
            <li
              key={index}
              onMouseEnter={isTouch ? undefined : () => setHoveredItem(index)}
              onMouseLeave={isTouch ? undefined : () => setHoveredItem(null)}
              onClick={isTouch ? undefined : () => handleClick(index)}
              className="transform transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)] select-none"
              style={{ cursor: isTouch ? "default" : "pointer" }}
            >
              <Link href={item.href} className="block" onClick={(e) => e.preventDefault()}>
                <span
                  className={`
                    font-light inline-block mt-3
                    ${
                      !isTouch && selectedItem === index
                        ? "text-2xl font-semibold opacity-100 text-[#45B7D1] dark:text-[#56CFE1]"
                        : hoveredItem === index
                        ? "text-2xl font-medium opacity-100"
                        : hoveredItem !== null
                        ? "text-xl opacity-30 blur-[0.8px]"
                        : "text-xl opacity-100"
                    }
                    transform transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                  `}
                >
                  {item.text}
                  {!isTouch && selectedItem === index && (
                    <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-[#45B7D1] dark:bg-[#56CFE1] align-middle" />
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
