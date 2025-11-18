export function DotsBackground() {
  const dotColors = [
    "rgba(255,255,255,0.11)",
    "rgba(220,220,220,0.06)",
    "rgba(255,255,255,0.13)",
  ];
  const dotSpacing = 32;
  const gridSize = 6;

  const circles = [];
  for (let y = 0; y < gridSize; ++y) {
    for (let x = 0; x < gridSize; ++x) {
      const colorIdx = (x + y) % dotColors.length;
      circles.push(
        <circle
          key={`${x}-${y}`}
          cx={8 + x * dotSpacing}
          cy={8 + y * dotSpacing}
          r="1.6"
          fill={dotColors[colorIdx]}
        />
      );
    }
  }
  return (
    <svg
      aria-hidden="true"
      className="fixed inset-0 w-screen h-screen pointer-events-none z-0"
      style={{
        width: "100vw",
        height: "100vh",
        minWidth: "100vw",
        minHeight: "100vh",
        opacity: 0.4,
        userSelect: "none",
        left: 0,
        top: 0,
      }}
    >
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
      <rect width="100vw" height="100vh" fill="url(#hero-dots)" />
    </svg>
  );
}
