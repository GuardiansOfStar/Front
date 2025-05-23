import { useNavigate } from 'react-router-dom';
// import smiling_grandchildren from 'assets/images/smiling_grandchildren.png'
// import get_certificate from 'assets/images/get_certificate.png'

const smiling_grandchildren = '/assets/images/grandchildren_happy.png'
const get_certificate = '/assets/images/certificate_register_button.png'

const Certificate = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 bg-[#FFF9C4]/70 z-20" />
      <img
        src="/assets/images/encouragement_message_background.png"
        className="relative w-full h-full z-10"
      />
      <img
        src={smiling_grandchildren}
        alt="웃는 손주들"
        className="absolute top-[20%] left-1/2 transform -translate-x-1/2
        w-[40%] h-auto
        z-50"
        />
      <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 
      w-[70%] h-[40%] bg-white border-8 border-green-600 rounded-lg 
      flex flex-col items-center justify-center text-black font-extrabold z-30">
        <h2 className="text-3xl mb-2 z-40">무사히 돌아와줘서 고마워요</h2>
        <h3 className="text-3xl">안전운전하는 할머니/할아버지가 자랑스러워요</h3>
      </div>
      <img
        src={get_certificate}
        alt="수료증 받기 버튼"
        onClick={() => navigate('/info')}
        className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2
        w-[25%] 
        cursor-pointer z-30 
        hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
};

export default Certificate;
