// 전체 수정
import { useNavigate } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';
import { audioManager } from '../../utils/audioManager';

const homeButton = '/assets/images/home_button.png'; 

function HomeButton () {
    const navigate = useNavigate();
    const scale = useScale();

    const handleClick = () => {
        audioManager.playButtonClick(); // 효과음 재생
        navigate('/');                   // 네비게이션 추가
    };

    return (
        <img
            src={homeButton}
            alt="홈으로"
            className="absolute cursor-pointer z-50"
            style={{
                top: `calc(4% * ${scale})`,
                right: `calc(4% * ${scale})`,
                width: `calc(11% * ${scale})`
            }}
            onClick={handleClick}
        />
    );
}

export default HomeButton;