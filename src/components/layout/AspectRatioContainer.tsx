import { ReactNode } from 'react';

interface AspectRatioContainerProps {
  children: ReactNode;
  ratio?: '5/4' | '4/3' | '16/9';
}

const AspectRatioContainer = ({ children, ratio = '5/4' }: AspectRatioContainerProps) => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div 
        className="relative w-full h-full bg-white shadow-lg"
        style={{ 
          aspectRatio: ratio,
          maxWidth: '90vw',
          maxHeight: '90vh',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AspectRatioContainer;