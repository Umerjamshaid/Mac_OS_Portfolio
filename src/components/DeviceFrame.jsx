import React from "react";

// Reusable device frame component that layers a transparent PNG frame
// on top of a screenshot. Supports `pixel` and `galaxy` device types.
const SCREEN_RECTS = {
  pixel: { top: 28, left: 12, right: 12, bottom: 28, radius: 24 },
  galaxy: { top: 30, left: 10, right: 10, bottom: 30, radius: 26 },
};

const DeviceFrame = ({ src, type = "pixel", alt = "device screenshot", className = "" }) => {
  const t = type in SCREEN_RECTS ? type : "pixel";
  const rect = SCREEN_RECTS[t];

  // Frame asset paths (user will provide these files)
  const frameSrc = `/src/assets/devices/${t}-frame.png`;

  return (
    <div className={`relative ${className}`} style={{ width: 240, height: 500 }}>
      {/* Screenshot positioned to fit inside the frame cutout */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: rect.top,
          left: rect.left,
          right: rect.right,
          bottom: rect.bottom,
          overflow: "hidden",
          borderRadius: rect.radius,
          backgroundColor: "#ffffff",
        }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      {/* Top-level frame PNG that contains the device bezel and cutout */}
      <img
        src={frameSrc}
        alt={`${t} frame`}
        draggable={false}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      />
    </div>
  );
};

export default DeviceFrame;
