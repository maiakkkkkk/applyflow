interface BrandMarkProps {
  className?: string
}

export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      role="img"
      aria-label="ApplyFlow"
    >
      <defs>
        <linearGradient id="applyflow-mark-flow" x1="4" y1="22" x2="29" y2="11" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0A8BFF" />
          <stop offset="1" stopColor="#0565D8" />
        </linearGradient>
      </defs>
      <path fill="#132033" d="M3.5 25.5 12.2 5h4.4l7.2 17h-4.5l-1.7-4.2H9.9l-3.1 7.7H3.5Zm8-11.7h4.6l-2.2-5.5-2.4 5.5Z" />
      <path fill="#132033" d="M18.5 5H29v3.8h-6.3v4.1h5.5v3.7h-5.5v8.9h-4.2V5Z" />
      <path d="M4.5 22.5c5.6-4.9 11.1-6.2 22.9-7.2" fill="none" stroke="url(#applyflow-mark-flow)" strokeWidth="2.8" strokeLinecap="round" />
      <path d="m25 12.8 3.5 2.3-3 3" fill="none" stroke="#0565D8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
