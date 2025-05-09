<<<<<<< HEAD:src/pages/home/Setting.tsx
import { useNavigate } from 'react-router-dom';
import setting from 'assets/images/setting.png'
=======
const setting = '/assets/images/setting.png'
>>>>>>> main:src/components/ui/SettingButton.tsx

const Setting = () => {
    const navigate = useNavigate(); // 이거 추가해야 함

    return (
        <img
            src={setting}
            alt="setting"
            className="absolute top-5 right-10 
            w-[9%] h-auto
            cursor-pointer
            z-50
            active:scale-90 transition-transform duration-150"
            onClick={() => navigate('/result')}
        />
    );
};

export default Setting;