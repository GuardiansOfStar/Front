// src/components/StartButton.tsx
import { useNavigate } from 'react-router-dom';
import next_button from 'assets/images/next_button.png';

const NextButton = () => {
    const navigate = useNavigate();

    return (
        <img
        src={next_button}
        alt="다음 버튼"
        onClick={() => navigate('/star')}
        className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2
        w-[27%] h-auto 
        cursor-pointer z-50 
        hover:scale-105 transition-transform duration-300"
        />
    );
};

export default NextButton;
