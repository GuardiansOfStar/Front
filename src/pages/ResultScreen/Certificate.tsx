import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';
import { useScore } from '../../context/ScoreContext';
import { completeSession } from '../../services/endpoints/session';

import Background from '../../components/ui/Background';

const smiling_grandchildren = '/assets/images/grandchildren.png'
const get_certificate = '/assets/images/get_certificate.png'
const drive_end_button = '/assets/images/drive_end_button.png'

const Certificate = () => {
  const navigate = useNavigate();
  const scale = useScale();

  // session end api
  const { totalScore } = useScore();

  useEffect(() => {
    const sessionId = localStorage.getItem('session_id');
    if (sessionId) {
      completeSession(sessionId)
        .then(() => {
          console.log('✅ 세션 완료 처리됨', { totalScore });
        })
        .catch(err => {
          console.error('❌ 세션 완료 실패:', err);
        });
    }
  }, [totalScore]);


  return (
    <div className="relative w-full h-full">
      <Background />
      {/* 운전 종료 버튼 (기존 HomeButton 위치) */}
      <img
        src={drive_end_button}
        alt="운전 종료"
        className="absolute cursor-pointer"
        style={{
          top: `calc(4% * ${scale})`,
          right: `calc(4% * ${scale})`,
          width: `calc(11% * ${scale})`
        }}
        onClick={() => navigate('/')}
      />
      
      {/* 손자손녀 이미지 */}
      <img
        src={smiling_grandchildren}
        alt="웃는 손주들"
        className="absolute z-50"
        style={{
          width: `calc(378px * ${scale})`,
          left: `calc(323px * ${scale})`, // 중앙 정렬: (1024 - 375) / 2
          top: `calc(100px * ${scale})`
        }}
      />
      
      {/* 메시지 박스 */}
      <div 
        className="absolute bg-white bg-opacity-75 border-green-700 z-40"
        style={{
          width: `calc(709px * ${scale})`,
          height: `calc(242px * ${scale})`,
          left: `calc(157px * ${scale})`,
          top: `calc(281px * ${scale})`,
          borderWidth: `calc(10px * ${scale})`,
          borderStyle: 'solid',
          borderColor: 'rgba(14, 142, 18, 0.8)',
          borderRadius: `calc(30px * ${scale})`,
          backgroundColor: 'rgba(255, 250, 250, 0.75)',
          boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          className="text-center font-black"
          style={{
            width: `calc(614px * ${scale})`,
            fontSize: `calc(40px * ${scale})`,
            lineHeight: `calc(60px * ${scale})`,
            color: '#000000'
          }}
        >
          무사히 돌아와줘서 고마워요<br />
          안전운전하는 할아버지가 자랑스러워요
        </div>
      </div>

      {/* 수료증 받기 버튼 */}
      <img
        src={get_certificate}
        alt="수료증 받기 버튼"
        onClick={() => navigate('/info')}
        className="absolute cursor-pointer z-50 hover:scale-105 transition-transform duration-300"
        style={{
          width: `calc(293px * ${scale})`,
          left: `calc(365px * ${scale})`, // 중앙 정렬: (1024 - 293) / 2
          bottom: `calc(0px * ${scale})`
        }}
      />
    </div>
  );
};

export default Certificate;