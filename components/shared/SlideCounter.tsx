interface SlideCounterProps {
  current: number;
  total: number;
  separator?: string;
}

export default function SlideCounter({ current, total, separator = '/' }: SlideCounterProps) {
  return (
    <p
      className="font-medium whitespace-nowrap"
      style={{
        fontSize: 32,
        lineHeight: 1.2,
        color: 'rgba(255, 255, 255, 0.64)',
        fontFamily: 'var(--font-poppins), Poppins, sans-serif',
      }}
    >
      {current}{separator}{total}
    </p>
  );
}
