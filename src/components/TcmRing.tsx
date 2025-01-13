import React from 'react';

interface TcmRingProps {
  radius: number;
}

const TCM_ORGANS = [
  { time: 23, organ: '胆', name: 'Gallbladder' },
  { time: 1, organ: '肝', name: 'Liver' },
  { time: 3, organ: '肺', name: 'Lung' },
  { time: 5, organ: '大腸', name: 'Large Intestine' },
  { time: 7, organ: '胃', name: 'Stomach' },
  { time: 9, organ: '脾', name: 'Spleen' },
  { time: 11, organ: '心', name: 'Heart' },
  { time: 13, organ: '小腸', name: 'Small Intestine' },
  { time: 15, organ: '膀胱', name: 'Bladder' },
  { time: 17, organ: '腎', name: 'Kidney' },
  { time: 19, organ: '心包', name: 'Pericardium' },
  { time: 21, organ: '三焦', name: 'Triple Burner' }
];

const TcmRing: React.FC<TcmRingProps> = ({ radius }) => {
  const calculatePosition = (time: number) => {
    // Convert time to angle (24 hours = 360 degrees)
    const angle = ((time * 360) / 24) - 90; // -90 to start at top
    const radian = (angle * Math.PI) / 180;
    return {
      x: 200 + radius * Math.cos(radian),
      y: 200 + radius * Math.sin(radian),
      angle
    };
  };

  return (
    <g className="tcm-ring">
      <circle
        cx="200"
        cy="200"
        r={radius}
        fill="url(#engravedPattern)"
        stroke="url(#goldMetallic)"
        strokeWidth="35"
        opacity="0.8"
      />
      {TCM_ORGANS.map((organ) => {
        const { x, y, angle } = calculatePosition(organ.time);
        return (
          <g key={organ.name} transform={`translate(${x},${y}) rotate(${angle})`}>
            <text
              className="organ-symbol cursor-pointer hover:opacity-80 transition-opacity"
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="#F6F2C0"
              fontSize="16"
              filter="url(#glow)"
              style={{ transform: `rotate(${-angle}deg)` }}
            >
              <title>{organ.name} ({organ.time}:00-{(organ.time + 2) % 24}:00)</title>
              {organ.organ}
            </text>
          </g>
        );
      })}
    </g>
  );
};

export default TcmRing;
