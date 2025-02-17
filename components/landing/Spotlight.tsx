"use client"

import React from 'react';
import {useState} from 'react'

export const Spotlight = ({ children, className = '' }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);
  
    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setOpacity(1);
    };
  
    const handleMouseLeave = () => {
      setOpacity(0);
    };
  
    return (
      <div
        className={`relative overflow-hidden ${className}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(99,102,241,.15), transparent 40%)`,
          }}
        />
        {children}
      </div>
    );
  };
  