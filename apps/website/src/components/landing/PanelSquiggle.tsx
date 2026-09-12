export function PanelSquiggle() {
  return (
    <svg
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full text-primary-800 opacity-25"
    >
      <path d="M-30 300 C 70 200 130 380 230 290 S 420 190 470 310" stroke="currentColor" strokeWidth="46" strokeLinecap="round" />
    </svg>
  );
}
