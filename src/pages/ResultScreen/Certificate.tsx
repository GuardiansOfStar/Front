import { useNavigate } from 'react-router-dom';
import Background from '../../components/Background';
import get_certificate from 'assets/images/get_certificate.png'
const Certificate = () => {
  const navigate = useNavigate(); // ✅ 추가

return (
    <div
        className=""
        >
        <Background />

        <div className="w-[50%] h-[16%] bg-green-700 bg-opacity-90 rounded-lg p-8 text-white text-center shadow-lg z-50">
            <h2 className="text-4xl font-bold">잘 다녀 오셨어요?</h2>
        </div>
        <img
        src={get_certificate}
        alt="수료증 받기 버튼"
        onClick={() => navigate('/')}
        className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2
        w-[27%] h-auto 
        cursor-pointer z-50 
        hover:scale-105 transition-transform duration-300"
        />
        
    </div>
);
};

export default Certificate;
