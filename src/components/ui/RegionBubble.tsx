import { useState, useEffect } from 'react';

interface RegionBubbleProps {
  show: boolean;
}

const RegionBubble = ({ show }: RegionBubbleProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      // 애니메이션 효과를 위해 지연 후 표시
      const timer = setTimeout(() => {
        setVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div 
      className="absolute top-[160px] right-7 transform origin-top-right 
                 z-40"
    >
      {/* 말풍선 꼬리 - 더 길고 뚜렷하게 */}
      <div 
        className={`absolute -top-4 right-12 w-8 h-8 bg-green-600 
                   transform rotate-45 z-0 shadow-md
                   transition-all duration-300 ease-out
                   ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
      ></div>
      
      {/* 말풍선 내용 */}
      <div 
        className={`relative bg-green-600 text-white rounded-2xl py-3 px-6 shadow-lg z-10
                   transition-all duration-500 ease-out
                   ${visible ? 'opacity-100 transform-none' : 'opacity-0 transform -translate-y-4'}`}
      >
        <p className="text-xl font-bold whitespace-nowrap">
          잠깐, 지역 선택은 하셨나요?
        </p>
      </div>
    </div>
  );
};

export default RegionBubble;