// 전체 수정
import { useNavigate } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';

const homeButton = '/assets/images/home_button.png'; 

function HomeButton () {
    const navigate = useNavigate();
    const scale = useScale();

    return (
        <img
            src={homeButton}
            alt="홈으로"
            className="absolute cursor-pointer"
            style={{
                top: `calc(4% * ${scale})`,
                right: `calc(4% * ${scale})`,
                width: `calc(11% * ${scale})`
            }}
            onClick={() => navigate('/')}
        />
    );
}

export default HomeButton;