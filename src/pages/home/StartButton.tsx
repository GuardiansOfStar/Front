// src/components/StartButton.tsx
import { useNavigate } from 'react-router-dom';
import start_button from 'assets/images/start_button.png'

const StartButton = () => {
    const navigate = useNavigate();

    return (
        <img
        src={start_button}
        alt="시작하기 버튼"
        onClick={() => navigate('/scenarios')}
        className="absolute bottom-[15%] left-1/2 transform -translate-x-1/2
        w-[400px] h-auto 
        cursor-pointer z-10 
        hover:scale-105 transition-transform duration-300"
        />
    );
};

export default StartButton;
