import React, { useMemo } from "react";
import "./RecordingAnimation.css";

export default function RecordingAnimation({ frequencyData = new Uint8Array(0) }) {
  // We'll render 4 bars and sample the frequencyData to create reactive heights
  const bars = useMemo(() => [0, 1, 2, 3], []);

  const getBarHeight = (index) => {
    if (!frequencyData || frequencyData.length === 0) {
      return 8 + (index % 2) * 4; // simple idle sizes
    }

    // sample evenly across the frequencyData
    const step = Math.max(1, Math.floor(frequencyData.length / bars.length));
    let sum = 0;
    let count = 0;
    for (let i = index * step; i < (index + 1) * step && i < frequencyData.length; i++) {
      sum += frequencyData[i];
      count++;
    }
    const avg = count ? sum / count : 0;

    // Map avg (0-255) to height px (4 - 20)
    const min = 4;
    const max = 20;
    const h = Math.round((avg / 255) * (max - min) + min);
    return h;
  };

  return (
    <div className="recording-animation small">
      {bars.map((b, i) => (
        <div
          key={i}
          className="bar"
          style={{ height: `${getBarHeight(i)}px` }}
        ></div>
      ))}
    </div>
  );
}
