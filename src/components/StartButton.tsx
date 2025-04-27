// src/components/StartButton.tsx
/*
import { useNavigate } from 'react-router-dom';

const StartButton = () => {
    const navigate = useNavigate();

    return (
        <button
    onClick={() => navigate('/scenarios')}
    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
    bg-green-500 text-white px-6 py-3 rounded-lg text-xl hover:bg-green-600 z-10"
    >
    시작하기
    </button>
    );
};

export default StartButton;
*/

import { useNavigate } from 'react-router-dom';


const StartButton = () => {
    const navigate = useNavigate();

    return (
        <img
        src="/start_button.png"
        alt="시작하기 버튼"
        onClick={() => navigate('/scenarios')}
        className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2
        w-[350px] h-auto 
        cursor-pointer z-10 
        hover:scale-105 transition-transform duration-300"
        />
    );
};

export default StartButton;
