// src/components/ui/StartButton.tsx
import { useNavigate } from 'react-router-dom';
import { audioManager } from '../../utils/audioManager';

const start_button = '/assets/images/start_button.png'

const StartButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
      audioManager.playButtonClick(); // 효과음 재생
      navigate('/scenarios');          // 네비게이션 추가
  };

    return (
        <img
        src={start_button}
        alt="시작하기 버튼"
        onClick={handleClick}
        className="absolute cursor-pointer z-50 hover:scale-105 transition-transform duration-300"
        style={{
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '27%',
          height: 'auto'
        }}
        />
    );
};

export default StartButton;