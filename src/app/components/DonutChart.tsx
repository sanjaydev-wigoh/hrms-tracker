// 'use client';

// import { motion } from 'framer-motion';
// import React, { useState } from 'react';
// import { Slice } from '../components/Slice';

// const COLORS = ['#8B5E3C', '#A67C52', '#C49A6C', '#E0B87C', '#F1D19B', '#F9E8C8'];
// const CONTENT = [
//   "Classrooms are teacher centric...",
//   "Second slice content...",
//   "Third slice content...",
//   "Fourth slice content...",
//   "Fifth slice content...",
//   "Sixth slice content...",
// ];

// export const DonutChart: React.FC = () => {
//   const [activeIndex, setActiveIndex] = useState<number | null>(null);

//   return (
//     <div className="flex items-center justify-center h-[100vh] bg-[#fefbee]">
//       <svg width={300} height={300}>
//         {COLORS.map((color, index) => (
//           <Slice
//             key={index}
//             index={index}
//             color={color}
//             isActive={activeIndex === index}
//             onHover={() => setActiveIndex(index)}
//             onLeave={() => setActiveIndex(null)}
//           />
//         ))}
//         <circle cx={150} cy={150} r={60} fill="#fff9ec" />
//         <text x="150" y="150" textAnchor="middle" fill="#663300" fontSize="12" fontWeight="bold" dy=".3em">
//           The vicious cycle of poverty
//         </text>
//       </svg>

//       <div className="ml-10 w-[300px] h-[150px] relative">
//         {activeIndex !== null && (
//           <motion.div
//             initial={{ width: 0, opacity: 0 }}
//             animate={{ width: '100%', opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             className="h-[2px] bg-[#663300] mb-2"
//           />
//         )}
//         <motion.p
//           key={activeIndex}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.7, delay: 0.3 }}
//           className="text-[#663300] text-sm"
//         >
//           {activeIndex !== null && CONTENT[activeIndex]}
//         </motion.p>
//       </div>
//     </div>
//   );
// };
// 'use client';

// import { motion } from 'framer-motion';
// import React, { useState } from 'react';
// import { Slice } from '../components/Slice';

// const COLORS = ['#8B5E3C', '#A67C52', '#C49A6C', '#E0B87C', '#F1D19B', '#F9E8C8'];
// const CONTENT = [
//   "Classrooms are teacher centric...",
//   "Second slice content...",
//   "Third slice content...",
//   "Fourth slice content...",
//   "Fifth slice content...",
//   "Sixth slice content...",
// ];

// export const DonutChart: React.FC = () => {
//   const [activeIndex, setActiveIndex] = useState<number | null>(null);

//   return (
//     <div className="flex items-center justify-center h-screen bg-[#fefbee]">
//       <svg width={500} height={500} viewBox="0 0 300 300">
//         {COLORS.map((color, index) => (
//           <Slice
//             key={index}
//             index={index}
//             color={color}
//             isActive={activeIndex === index}
//             onHover={() => setActiveIndex(index)}
//             onLeave={() => setActiveIndex(null)}
//           />
//         ))}
//         <circle cx={150} cy={150} r={60} fill="#fff9ec" />
//         <text
//           x="150"
//           y="150"
//           textAnchor="middle"
//           fill="#663300"
//           fontSize="14"
//           fontWeight="bold"
//           dy=".3em"
//         >
//           The vicious cycle of poverty
//         </text>
//       </svg>

//       <div className="ml-16 w-[400px] h-[200px] relative">
//         {activeIndex !== null && (
//           <>
//             <motion.div
//               initial={{ width: 0, opacity: 0 }}
//               animate={{ width: '100%', opacity: 1 }}
//               transition={{ duration: 0.4 }}
//               className="h-[2px] bg-[#663300] mb-3"
//             />
//             <motion.p
//               key={activeIndex}
//               initial={{ opacity: 0, x: -10 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               className="text-[#663300] text-base leading-relaxed"
//             >
//               {CONTENT[activeIndex]}
//             </motion.p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };
