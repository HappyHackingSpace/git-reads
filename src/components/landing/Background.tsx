export function DotsBackground() {
  const dotColors = [
    "rgba(255,255,255,0.17)",
    "rgba(255,255,255,0.1)",
    "rgba(255,255,255,0.13)",
  ];
  const dotSpacing = 24;
  const gridSize = 11;
  const dotRadius = 1.25; 

  const circles = [];
  for (let y = 0; y < gridSize; ++y) {
    for (let x = 0; x < gridSize; ++x) {
      const colorIdx = (x + y) % dotColors.length;
      circles.push(
        <circle
          key={`${x}-${y}`}
          cx={6 + x * dotSpacing}
          cy={6 + y * dotSpacing}
          r={dotRadius}
          fill={dotColors[colorIdx]}
        />
      );
    }
  }


  return (
    <svg
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        width: "100vw",
        height: "100vh",
        maxWidth: "100vw",
        maxHeight: "100vh",
        minWidth: "100vw",
        minHeight: "100vh",
        opacity: 1,
        userSelect: "none",
        left: 0,
        top: 0,
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      <defs>
        <pattern
          id="hero-dots"
          x="0"
          y="0"
          width={dotSpacing * gridSize}
          height={dotSpacing * gridSize}
          patternUnits="userSpaceOnUse"
        >
          {circles}
        </pattern>
        <radialGradient id="dots-fade"
          cx="50%" cy="50%" r="65%"
          fx="50%" fy="50%"
        >
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="55%" stopColor="white" stopOpacity="0.16" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </radialGradient>
        <mask id="fade-mask">
          <rect width="100%" height="100%" fill="url(#dots-fade)" />
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="url(#hero-dots)"
        mask="url(#fade-mask)"
      />
    </svg>
  );
}
