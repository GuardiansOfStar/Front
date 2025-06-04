import { useNavigate } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';
import { audioManager } from '../../utils/audioManager';

const setting = '/assets/images/setting.png'

const SettingButton = () => {
    const navigate = useNavigate();
    const scale = useScale();

    const handleClick = () => {
        audioManager.playButtonClick(); // 효과음 재생
        navigate('/settings');          // 네비게이션 추가
    };

    return (
        <img
            src={setting}
            alt="설정"
            className="absolute cursor-pointer"
            style={{
                top: `calc(5% * ${scale})`,
                right: `calc(3.6% * ${scale})`,
                width: `calc(9% * ${scale})`
            }}
            onClick={handleClick}
        />
    );
};

export default SettingButton;