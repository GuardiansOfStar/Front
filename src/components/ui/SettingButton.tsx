import { useNavigate } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';

const setting = '/assets/images/setting.png'

const Setting = () => {
    const navigate = useNavigate();
    const scale = useScale();

    return (
        <img
            src={setting}
            alt="설정"
            className="absolute cursor-pointer"
            style={{
                top: `calc(5% * ${scale})`,
                right: `calc(4.5% * ${scale})`,
                width: `calc(9% * ${scale})`
            }}
            onClick={() => navigate('/settings')}
        />
    );
};

export default Setting;