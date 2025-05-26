// Front/src/components/ui/GameTitle.tsx
interface GameTitleProps {
  text: string;
  fontSize?: string;
  color?: string;
  strokeWidth?: string;
  className?: string;
}

const GameContext = ({ 
  text, 
  fontSize = 'text-5xl', 
  color = 'text-black',
  strokeWidth = '7px',
  className = ''
}: GameTitleProps) => {
  return (
    <h2 className={`${fontSize} font-black whitespace-nowrap ${className}`}>
      {text.split('').map((ch, i) => (
        ch === ' ' ? ' ' :
        <span 
          key={i} 
          className={`inline-block ${color} rounded`}
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

export default GameContext;