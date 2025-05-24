// src/components/ui/GameTitle.tsx
interface GameTitleProps {
  text: string;
  fontSize?: string;
  color?: string;
  strokeWidth?: string;
  className?: string;
}

const GameTitle = ({ 
  text, 
  fontSize = 'text-responsive-6xl',
  color = 'text-green-600',
  strokeWidth = 'calc(12px * var(--scale, 1))',
  className = ''
}: GameTitleProps) => {
  return (
    <h2 
      className={`${fontSize} font-extrabold whitespace-nowrap ${className}`}
      style={{
        WebkitTextStroke: `${strokeWidth} white`,
        // textStroke 제거 (표준이 아님)
        paintOrder: 'stroke',
        letterSpacing: '-16px',
      } as React.CSSProperties}
    >
      {text.split('').map((ch, i) => (
        ch === '' ? ' ' :
        <span 
          key={i} 
          className={`inline-block ${color} px-responsive-xs rounded`}
        >
          {ch}
        </span>
      ))}
    </h2>
  );
};

export default GameTitle;