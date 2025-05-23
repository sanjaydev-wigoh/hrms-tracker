
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const segments = [
  {
    label: 'Day 1',
    description: 'Classrooms are teacher centric – rote memorization encouraged.',
    details:
      'Poor literacy rates lead to rote memorization, forced engagement with irrelevant content leads to dip in intrinsic motivation to learn.',
    color: '#81592E',
    lineEnd: { top: 202, left: 441.205 }, // Day 1
  },
  {
    label: 'Day 2',
    description: 'Segment 2 Description',
    details: 'Detailed text about segment 2.',
    color: '#B7894E',
  
  },
  {
    label: 'Day 3',
    description: 'Segment 3 Description',
    details: 'Detailed text about segment 3.',
    color: '#E3BB64',
  },
  {
    label: 'Day 4',
    description: 'Segment 4 Description',
    details: 'Detailed text about segment 4.',
    color: '#F2D38C',
  },
  {
    label: 'Day 5',
    description: 'Segment 5 Description',
    details: 'Detailed text about segment 5.',
    color: '#F8E5C4',
    lineEnd: { top: 22, left: 250 }, 
  },
  {
    label: 'Day 6',
    description: 'Segment 6 Description',
    details: 'Detailed text about segment 6.',
    color: '#A57A3C',
  },
];

const radius = 200;
const center = 250;
const angleStep = (2 * Math.PI) / segments.length;

function polarToCartesian(angle: number, r: number) {
  return {
    x: center + r * Math.cos(angle),
    y: center + r * Math.sin(angle),
  };
}

function createPath(index: number) {
  const startAngle = index * angleStep;
  const endAngle = startAngle + angleStep;

  const start = polarToCartesian(startAngle, radius);
  const end = polarToCartesian(endAngle, radius);
  const innerStart = polarToCartesian(endAngle, radius - 160);
  const innerEnd = polarToCartesian(startAngle, radius - 160);

  return `M ${start.x},${start.y}
          A ${radius},${radius} 0 0,1 ${end.x},${end.y}
          L ${innerStart.x},${innerStart.y}
          A ${radius - 160},${radius - 160} 0 0,0 ${innerEnd.x},${innerEnd.y}
          Z`;
}

function midAngle(index: number) {
  const startAngle = index * angleStep;
  const endAngle = startAngle + angleStep;
  return (startAngle + endAngle) / 2;
}

export default function DonutChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const lineLength = 80;

  return (
    <div className="relative w-[900px] h-[600px] flex items-center">
      <svg width={500} height={500}>
        <circle cx={center} cy={center} r={radius - 30} fill="#fef9ec" />
        {segments.map((seg, i) => {
          const isActive = hoveredIndex === i;
          const midAng = midAngle(i);
          const labelPos = polarToCartesian(midAng, radius - 80);

          return (
            <g key={i}>
              <motion.path
                d={createPath(i)}
                fill={seg.color}
                stroke="#fef9ec"
                strokeWidth={5}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                animate={{
                  scale: isActive ? 1.05 : 1,
                }}
                style={{
                  cursor: 'pointer',
                  transformOrigin: `${center}px ${center}px`,
                }}
                transition={{ duration: 0.3 }}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                fill="#5A3921"
                fontWeight="bold"
                fontSize="14px"
                dominantBaseline="middle"
                textAnchor="middle"
                pointerEvents="none"
                style={{ userSelect: 'none' }}
              >
                {seg.label}
              </text>
            </g>
          );
        })}
        <text
          x={center}
          y={center}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16px"
          fill="#5A3921"
          fontWeight="bold"
        >
          The vicious cycle of poverty
        </text>
      </svg>

      {/* Show single line and description on hover */}
      <AnimatePresence>
        {hoveredIndex !== null && (() => {
          const midAng = midAngle(hoveredIndex);
          const start = polarToCartesian(midAng, radius);
          const isVertical = hoveredIndex === 1 || hoveredIndex === 4;

          if (isVertical) {
            const goingUp = start.y > center;
            const lineTop = goingUp ? start.y - lineLength : start.y;
            const contentTop = goingUp ? lineTop - 40 : lineTop + lineLength + 10;
            const contentLeft = start.x + 10;

            return (
              <>
                <motion.div
                  key={`v-line-${hoveredIndex}`}
                  className="bg-[#5A3921]"
                  initial={{ height: 0 }}
                  animate={{ height: lineLength }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: 2,
                    top: lineTop,
                    left: start.x,
                    position: 'absolute',
                    zIndex: 10,
                  }}
                />
                <motion.div
                  key={`v-content-${hoveredIndex}`}
                  className="absolute w-[320px] text-[#5A3921]"
                  style={{
                    top: contentTop,
                    left: contentLeft,
                    textAlign: 'left',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-semibold text-md mb-2">{segments[hoveredIndex].description}</h3>
                  <p className="text-sm leading-relaxed">{segments[hoveredIndex].details}</p>
                </motion.div>
              </>
            );
          } else {
            const isLeft = start.x < center;
            const contentLeft = isLeft
              ? start.x - lineLength - 320 - 10
              : start.x + lineLength + 10;
            const contentTop = start.y - 40;

            return (
              <>
                <motion.div
                  key={`h-line-${hoveredIndex}`}
                  className="bg-[#5A3921]"
                  initial={{ width: 0 }}
                  animate={{ width: lineLength }}
                  exit={{ width: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    height: 2,
                    top: start.y,
                    left: isLeft ? start.x - lineLength : start.x,
                    position: 'absolute',
                    zIndex: 10,
                  }}
                />
                <motion.div
                  key={`h-content-${hoveredIndex}`}
                  className="absolute w-[320px] text-[#5A3921]"
                  style={{
                    top: contentTop,
                    left: contentLeft,
                    textAlign: isLeft ? 'right' : 'left',
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-semibold text-md mb-2">{segments[hoveredIndex].description}</h3>
                  <p className="text-sm leading-relaxed">{segments[hoveredIndex].details}</p>
                </motion.div>
              </>
            );
          }
        })()}
      </AnimatePresence>
    </div>
  );
}
