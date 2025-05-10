import { useNavigate } from 'react-router-dom';
const setting = '/assets/images/setting.png'

const Setting = () => {
    const navigate = useNavigate();

    return (
        <img
            src={setting}
            alt="setting"
            className="absolute top-5 right-10 
            w-[9%] h-auto
            cursor-pointer
            z-50
            active:scale-90 transition-transform duration-150"
            onClick={() => navigate('/success')} // '/result' 대신 '/success'로 변경
        />
    );
};

export default Setting;