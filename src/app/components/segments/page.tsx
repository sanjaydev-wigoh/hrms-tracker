

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Navigation import

const segments = [
  { label: 'Employee Attendance', color: 'bg-purple-600', content: 'Get employee details', path: '/admin-incentive' },
  { label: 'Monthly Incentives', color: 'bg-orange-600', content: 'Credit monthly incentive money to employee.', path: '/components/monthlyclaim' },
  { label: 'Live Attendance', color: 'bg-purple-500', content: 'Live attendance from organisation IN and OUT', path: '/components/settings' },
  { label: 'Contact Users', color: 'bg-orange-500', content: 'Get quick contact information about employee.', path: '/components/contact-mail' },
  { label: 'Wallet', color: 'bg-purple-400', content: 'Manage incentives.', path: '/wallet' },
  { label: 'Settings', color: 'bg-orange-400', content: 'Admin preferences.', path: '/settings' },
];

function getRandomIndex(exclude: number, max: number): number {
  let next = Math.floor(Math.random() * max);
  while (next === exclude) {
    next = Math.floor(Math.random() * max);
  }
  return next;
}

const letterAnimation = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
    },
  }),
};

export default function BigSegmentDonutWithRipple() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter(); // ✅ Router instance

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => getRandomIndex(prev, segments.length));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const radius = 220;
  const segmentSize = 180;
  const segmentAngle = (2 * Math.PI) / segments.length;
  const halfSegment = segmentSize / 2;

  return (
    <div className="w-full h-screen relative overflow-hidden bg-white">
      {/* Ripple background */}
      <div className="absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-[65%] w-[600px] h-[600px] pointer-events-none">
        <div className="absolute inset-0 flex justify-center items-center">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`absolute animate-ripple rounded-full bg-blue-400 shadow-xl border border-solid -translate-x-1/2 -translate-y-1/2 left-2/4 top-2/4 scale-100`}
              style={{
                width: 180 + i * 70,
                height: 180 + i * 70,
                opacity: 0.2 - i * 0.03,
                zIndex: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Donut segments */}
      <div className="absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-[65%] scale-100 w-[600px] h-[600px] pointer-events-none">
        {segments.map((seg, index) => {
          const angle = index * segmentAngle - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          const isActive = activeIndex === index;

          return (
            <motion.div
              key={index}
              className={`absolute rounded-full flex items-center justify-center text-white font-semibold select-none cursor-pointer pointer-events-auto ${seg.color}`}
              style={{
                width: segmentSize,
                height: segmentSize,
                top: `calc(50% + ${y}px - ${halfSegment}px)`,
                left: `calc(50% + ${x}px - ${halfSegment}px)`,
                boxShadow: isActive
                  ? '0 0 20px 6px rgba(255,255,255,0.9)'
                  : '0 8px 20px rgba(0,0,0,0.2)',
                zIndex: hoveredIndex === index ? 30 : isActive ? 20 : 10,
              }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              onClick={() => router.push(seg.path)} // ✅ Navigate on click
              animate={{
                scale: hoveredIndex === index ? 1.13 : isActive ? 1.07 : 1,
                filter: isActive ? 'brightness(1.4)' : 'brightness(1)',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <span className="text-xl text-center block">{seg.label}</span>
            </motion.div>
          );
        })}

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredIndex !== null && (() => {
            const angle = hoveredIndex * segmentAngle - Math.PI / 2;
            const centerX = 300;
            const centerY = 300;
            const edgeX = centerX + (radius + halfSegment) * Math.cos(angle);
            const edgeY = centerY + (radius + halfSegment) * Math.sin(angle);

            let direction: 'left' | 'right' | 'top' | 'bottom';
            if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
              direction = Math.cos(angle) < 0 ? 'left' : 'right';
            } else {
              direction = Math.sin(angle) < 0 ? 'top' : 'bottom';
            }

            const offset = 30;
            const tooltipStyle: React.CSSProperties = {
              position: 'absolute',
              whiteSpace: 'nowrap',
              top:
                direction === 'top'
                  ? edgeY - offset - 30
                  : direction === 'bottom'
                  ? edgeY + offset + 10
                  : edgeY - 30,
              left:
                direction === 'left'
                  ? edgeX - offset - 190
                  : direction === 'right'
                  ? edgeX + offset + 10
                  : edgeX - 95,
              borderRadius: '12px',
              padding: '14px 22px',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#333',
              pointerEvents: 'none',
              userSelect: 'none',
              width: '180px',
              textAlign: 'center',
              zIndex: 100,
            };

            const text = segments[hoveredIndex].content;

            return (
              <motion.div
                key="tooltip"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                style={tooltipStyle}
              >
                {text.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={letterAnimation}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
}
