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
        src="/assets/images/drive_end_button.png"
        alt="주행 종료 버튼"
        onClick={() => navigate('/')} 
        className="absolute top-[3%] right-[3%] w-[110px] h-auto z-40 cursor-pointer hover:scale-90 transition-transform duration-300"
      />

      <img
        src={smiling_grandchildren}
        alt="웃는 손주들"
        className="absolute top-[11%] left-1/2 transform -translate-x-1/2
        w-[42%] h-auto
        z-50"
        />
      <div className="absolute top-[35%] left-1/2 transform -translate-x-1/2 
      w-[730px] h-[270px] bg-[#FFFAFA]/75 border-[10px] border-[#0E8E12]/80 
      rounded-[45px] flex flex-col items-center justify-center 
      text-black font-extrabold z-30">
        <h2 className="text-[40px] pt-3 mb-2 z-40">무사히 돌아와줘서 고마워요</h2>
        <h3 className="text-[40px]">안전운전하는 할아버지가 자랑스러워요!</h3>
      </div>
      <img
        src={get_certificate}
        alt="수료증 받기 버튼"
        onClick={() => navigate('/info')}
        className="absolute bottom-[9%] left-1/2 transform -translate-x-1/2
        w-[27%] 
        cursor-pointer z-30 
        hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
};

export default Certificate;
