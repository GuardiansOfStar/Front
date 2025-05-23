// Front/src/components/ui/GameTitle.tsx
interface GameTitleProps {
  text: string;
  fontSize?: string;
  color?: string;
  strokeWidth?: string;
  className?: string;
}

const GameTitle = ({ 
  text, 
  fontSize = 'text-6xl', 
  color = 'text-green-600',
  strokeWidth = '12px',
  className = ''
}: GameTitleProps) => {
  return (
    <h2 className={`${fontSize} font-extrabold whitespace-nowrap ${className}`}>
      {text.split('').map((ch, i) => (
        ch === ' ' ? ' ' :
        <span 
          key={i} 
          className={`inline-block ${color} px-1 rounded`}
          style={{
            WebkitTextStroke: `${strokeWidth} white`,
            paintOrder: 'stroke'
          } as React.CSSProperties}
        >
          {ch}
        </span>
      ))}
    </h2>
  );
};

export default GameTitle;