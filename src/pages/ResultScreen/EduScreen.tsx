import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';
import Background from '../../components/ui/Background';
import GameTitle from '../../components/ui/GameTitle';
import { getSession,  SessionDetail, QuestResult } from "../../services/endpoints/session";
import { questMessages } from "../../constants/questMessages";
import { audioManager } from '../../utils/audioManager';


const ALLOWED_QUEST_IDS = ["pothole", "helmet", "Makgeolli", "Return", "Harvest"];
// 이후 시나리오 추가시 각 퀘스트 키워드 추출해서 구성하도록 해야...함! 

const next_button = '/assets/images/next_button.png';

const EduScreen = () => {
  const navigate = useNavigate();
  const scale = useScale();
  // const [totalScore] = useState(80);
  
  const [sessionData, setSessionData] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    //결과 효과음
    audioManager.playSound('reportGeneral', 0.8);

    const sessionId = localStorage.getItem('session_id');
    console.log("session! : ", sessionId);
    if (!sessionId) {
      setError('세션 ID가 없습니다.');
      setLoading(false);
      return;
    }

    getSession(sessionId)
      .then((res) => {
        console.log(res);
        
        localStorage.setItem('total_score', String(res.data.total_score));
        console.log("[EduScreen] → Saved total_score into localStorage:", res.data.total_score);

        // 2) 원본 퀘스트 배열
      const allQuests = res.data.quests;

      // 3) 허용된 ID만 필터
      const filteredQuests = allQuests.filter((q) =>
        ALLOWED_QUEST_IDS.includes(q.quest_id)
      );
        setSessionData({
        ...res.data,
        quests: filteredQuests,
      });
      })
      .catch((err) => {
        console.error(err);
        setError("점수 로드에 실패했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // GameTitle에 표시할 텍스트 결정
  const scoreText = loading
    ? '로딩 중...'
    : error
    ? error
    : `안전 점수 ${sessionData?.total_score ?? 0}점`;

  // 퀘스트 배열에서 성공한 것 / 실패한 것 분리
  const quests: QuestResult[] = sessionData?.quests ?? [];
  const successQuests = quests.filter((q) => q.success);
  const failedQuests = quests.filter((q) => !q.success);
  console.log("quests" , quests);
  console.log("sq : ", successQuests);
  console.log("fq : ", failedQuests);


  const praiseText =
    successQuests.length > 0
      ? questMessages[successQuests[0].quest_id].success
      : "칭찬할 퀘스트가 없어요";
  const rememberText =
    failedQuests.length > 0
      ? questMessages[failedQuests[0].quest_id].failure
      : "항상 안전운전 해요!";

  // \n 문구를 <br/>로 렌더링
  const renderWithBreaks = (text: string) =>
    text.split("\n").map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));

  return (
    <div className="relative w-full h-full">
      {/* 배경 - z-index를 낮게 설정 */}
      <div className="absolute inset-0 z-0">
        <Background />
      </div>
      
      {/* 점수 표시 섹션 */}
      <div 
        className="absolute z-20"
        style={{
          width: `calc(619px * ${scale})`,
          height: `calc(50px * ${scale})`,
          left: `calc(196px * ${scale})`,
          top: `calc(108px * ${scale})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <GameTitle 
          text={scoreText}
          fontSize={`calc(80px * ${scale})`}
          color="text-white"
          strokeWidth={`calc(18px * ${scale})`}
          strokeColor="#0DA429"
          className="leading-none tracking-wider"
        />
      </div>

            {/* 칭찬해요 카드 */}
      <div 
        className="absolute z-30"
        style={{
          width: `calc(410px * ${scale})`,
          height: `calc(395px * ${scale})`,
          left: `calc(81px * ${scale})`,
          top: `calc(242px * ${scale})`,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: `calc(10px * ${scale}) solid #0E8E12`,
          borderRadius: `calc(20px * ${scale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: `calc(24px * ${scale})`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* 칭찬해요 타이틀과 아이콘 */}
        <div 
          className="flex items-center justify-center"
          style={{ 
            marginBottom: `calc(16px * ${scale})`,
            gap: `calc(12px * ${scale})`,
            width: '100%'
          }}
        >
          <img
            src="/assets/images/clap.png"
            alt="박수"
            style={{
              width: `calc(50px * ${scale})`,
              height: `calc(50px * ${scale})`
            }}
          />
          <h3 
            className="font-black"
            style={{ 
              fontSize: `calc(50px * ${scale})`,
              margin: 0,
              color: '#059669'
            }}
          >
            칭찬해요
          </h3>
        </div>
        
        <p 
          className="font-black"
          style={{ 
            fontSize: `calc(45px * ${scale})`,
            color: '#000000',
            lineHeight: '1.5',
            margin: 3
          }}
        >
          {renderWithBreaks(praiseText)}
        </p>
      </div>

      {/* 기억해요 카드 */}
      <div 
        className="absolute z-30"
        style={{
          width: `calc(410px * ${scale})`,
          height: `calc(395px * ${scale})`,
          left: `calc(538px * ${scale})`,
          top: `calc(242px * ${scale})`,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: `calc(10px * ${scale}) solid #0E8E12`,
          borderRadius: `calc(20px * ${scale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: `calc(24px * ${scale})`,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* 기억해요 타이틀과 아이콘 */}
        <div 
          className="flex items-center justify-center"
          style={{ 
            marginBottom: `calc(16px * ${scale})`,
            gap: `calc(12px * ${scale})`,
            width: '100%'
          }}
        >
          <img
            src="/assets/images/check.png"
            alt="체크"
            style={{
              width: `calc(50px * ${scale})`,
              height: `calc(50px * ${scale})`
            }}
          />
          <h3 
            className="font-black"
            style={{ 
              fontSize: `calc(50px * ${scale})`,
              margin: 0,
              color: '#DC2626'
            }}
          >
            기억해요
          </h3>
        </div>
        
        <p 
          className="font-black"
          style={{ 
            fontSize: `calc(45px * ${scale})`,
            color: '#000000',
            lineHeight: '1.5',
            margin: 3,
            
          }}
        >
          {renderWithBreaks(rememberText)}
        </p>
      </div>
      
      {/* 다음 버튼 */}
      <img
        src={next_button}
        alt="다음 버튼"
        onClick={() => navigate('/certificate')}
        className="absolute cursor-pointer z-40 hover:scale-105 transition-transform duration-300"
        style={{
          bottom: `calc(20px * ${scale})`,
          left: '50%',
          transform: 'translateX(-50%)',
          width: `calc(180px * ${scale})`
        }}
      />
    </div>
  );
};

export default EduScreen;