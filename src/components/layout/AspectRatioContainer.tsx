import { ReactNode } from 'react';

interface AspectRatioContainerProps {
  children: ReactNode;
  ratio?: '16/10' | '4/3' | '16/9';
}

const AspectRatioContainer = ({ children, ratio = '16/10' }: AspectRatioContainerProps) => {
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