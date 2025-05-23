
// 'use client';

// import { motion } from 'framer-motion';
// import React from 'react';

// interface SliceProps {
//   index: number;
//   color: string;
//   isActive: boolean;
//   onHover: () => void;
//   onLeave: () => void;
// }

// export const Slice: React.FC<SliceProps> = ({ index, color, isActive, onHover, onLeave }) => {
//   const radius = 100;
//   const center = 150;
//   const total = 6;
//   const angle = (2 * Math.PI) / total;

//   const startAngle = index * angle;
//   const endAngle = startAngle + angle;

//   const x1 = center + radius * Math.cos(startAngle);
//   const y1 = center + radius * Math.sin(startAngle);
//   const x2 = center + radius * Math.cos(endAngle);
//   const y2 = center + radius * Math.sin(endAngle);

//   const largeArcFlag = angle > Math.PI ? 1 : 0;

//   const pathData = `
//     M ${center} ${center}
//     L ${x1} ${y1}
//     A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
//     Z
//   `;

//   return (
//     <motion.path
//       d={pathData}
//       fill={color}
//       whileHover={{ scale: 1.05 }}
//       onMouseEnter={onHover}
//       onMouseLeave={onLeave}
//       style={{ originX: '150px', originY: '150px' }}
//       transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//     />
//   );
// };
