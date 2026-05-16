"use client";

import React, { useState, useEffect, useCallback } from "react";

interface TextTypeProps {
  text: string[];
  className?: string;
  typingSpeed?: number;
  pauseDuration?: number;
  showCursor?: boolean;
  cursorCharacter?: string;
}

export default function TextType({
  text,
  className = "",
  typingSpeed = 75,
  pauseDuration = 1500,
  showCursor = true,
  cursorCharacter = "|",
}: TextTypeProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const typeText = useCallback(() => {
    const currentText = text[currentIndex];

    if (isPaused) {
      return;
    }

    if (!isDeleting) {
      // Typing
      if (displayText.length < currentText.length) {
        setDisplayText(currentText.slice(0, displayText.length + 1));
      } else {
        // Finished typing, pause before deleting
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // Deleting
      if (displayText.length > 0) {
        setDisplayText(displayText.slice(0, -1));
      } else {
        // Finished deleting, move to next text
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % text.length);
      }
    }
  }, [displayText, currentIndex, isDeleting, isPaused, text, pauseDuration]);

  useEffect(() => {
    const timer = setTimeout(typeText, isDeleting ? typingSpeed / 2 : typingSpeed);
    return () => clearTimeout(timer);
  }, [typeText, isDeleting, typingSpeed]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <span className="animate-pulse">{cursorCharacter}</span>
      )}
    </span>
  );
}
