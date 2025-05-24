// src/components/NextButton.tsx
import { useNavigate } from 'react-router-dom';

type NextButtonProps = {
  to: string; // 이동할 경로만 외부에서 받음
};

const NextButton = ({ to }: NextButtonProps) => {
    const navigate = useNavigate();

    return (
        <img
        src="/assets/images/next_button.png"
        alt="다음 버튼"
        onClick={() => navigate(to)}
        className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2
                    w-40 h-auto 
                    cursor-pointer z-50 
                    hover:scale-90 transition-transform duration-300"
        />
    );
};

export default NextButton;
