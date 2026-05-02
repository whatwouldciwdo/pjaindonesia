'use client';

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { Children, cloneElement, useEffect, useRef, useState, ReactNode } from 'react';

import './Dock.css';

interface DockItemProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  mousePos: any;
  spring: any;
  distance: number;
  magnification: number;
  baseItemSize: number;
}

function DockItem({ children, className = '', onClick, mousePos, spring, distance, magnification, baseItemSize }: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mousePos, (pos: any) => {
    if (!pos || pos.x === Infinity) return distance;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return distance;
    
    const isHorizontal = window.innerWidth < 768;
    if (isHorizontal) {
      const itemCenterX = rect.left + rect.width / 2;
      return pos.x - itemCenterX;
    } else {
      const itemCenterY = rect.top + rect.height / 2;
      return pos.y - itemCenterY;
    }
  });

  const maxScale = magnification / baseItemSize;
  const targetScale = useTransform(mouseDistance, [-distance, 0, distance], [1, maxScale, 1]);
  
  const scale = useSpring(targetScale, spring);

  return (
    <motion.div
      ref={ref}
      style={{
        width: baseItemSize,
        height: baseItemSize,
        scale: scale,
        transformOrigin: 'center center'
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`dock-item ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, child => cloneElement(child as React.ReactElement<any>, { isHovered }))}
    </motion.div>
  );
}

function DockLabel({ children, className = '', ...rest }: { children: ReactNode, className?: string, [key: string]: any }) {
  const { isHovered } = rest;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', (latest: number) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className={`dock-label ${className}`}
          role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = '' }: { children: ReactNode, className?: string }) {
  return <div className={`dock-icon w-full h-full ${className}`}>{children}</div>;
}

export interface DockItemData {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

export interface DockProps {
  items: DockItemData[];
  className?: string;
  spring?: any;
  magnification?: number;
  distance?: number;
  panelWidth?: number;
  dockWidth?: number;
  baseItemSize?: number;
  topContent?: ReactNode;
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelWidth = 68,
  baseItemSize = 50,
  topContent
}: DockProps) {
  const mousePos = useMotionValue({ x: Infinity, y: Infinity });
  const isHovered = useMotionValue(0);

  return (
    <div className="dock-outer pointer-events-none">
      <motion.div
        onMouseMove={(e: any) => {
          isHovered.set(1);
          mousePos.set({ x: e.pageX, y: e.pageY });
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mousePos.set({ x: Infinity, y: Infinity });
        }}
        className={`dock-panel pointer-events-auto ${className}`}
        role="toolbar"
        aria-label="Application dock"
      >
        {topContent && (
          <div className="dock-top-content">
            {topContent}
            <div className="dock-divider"></div>
          </div>
        )}
        {items.map((item, index) => (
          <DockItem
            key={index}
            onClick={item.onClick}
            className={item?.className || ''}
            mousePos={mousePos}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </div>
  );
}
