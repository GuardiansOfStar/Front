interface GameTitleProps {
  text: string;
  fontSize?: string;
  color?: string;
  strokeWidth?: string;
  strokeColor?: string;
  className?: string;
}

const GameTitle = ({ 
  text, 
  fontSize = 'text-responsive-6xl',
  color = 'text-[#0DA429]',
  strokeWidth = 'calc(12px * var(--scale, 1))',
  strokeColor = 'white',
  className = ''
}: GameTitleProps) => {
  // fontSize가 rem, px 등의 CSS 값인지 확인
  const isCSSValue = fontSize.includes('rem') || fontSize.includes('px') || fontSize.includes('em');
  
  return (
    <h2 
      className={`${isCSSValue ? '' : fontSize} font-black whitespace-nowrap ${className}`}
      style={{
        WebkitTextStroke: `${strokeWidth} ${strokeColor}`,
        paintOrder: 'stroke',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...(isCSSValue && { fontSize: fontSize })  // CSS 값일 때만 style로 적용
      } as React.CSSProperties}
    >
      {text.split('').map((ch, i) => (
        ch === ' ' ? 
        <span key={i} style={{ width: '0.5em' }}></span> :
        <span 
          key={i} 
          className={`inline-block ${color} px-responsive-xs rounded`}
          style={{
            marginRight: i === text.length - 1 ? '0' : '-10px'  // 마지막 글자는 마진 없음
          }}
        >
          {ch}
        </span>
      ))}
    </h2>
  );
};

export default GameTitle;