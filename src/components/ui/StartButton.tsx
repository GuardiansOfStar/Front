// src/components/StartButton.tsx
import { useNavigate } from 'react-router-dom';
const start_button = '/assets/images/start_button.png'

const StartButton = () => {
    const navigate = useNavigate();

    return (
        <img
        src={start_button}
        alt="시작하기 버튼"
        onClick={() => navigate('/scenarios')}
        className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2
        w-[27%] h-auto 
        cursor-pointer z-50 
        hover:scale-105 transition-transform duration-300"
        />
    );
};

export default StartButton;
