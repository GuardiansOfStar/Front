// Front/src/pages/characterSelect/CharacterSelectPage.tsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useScale } from '../../hooks/useScale';
import Background from '../../components/ui/Background';
import BackButton from '../../components/ui/BackButton';

const grandfatherCharacter = '/assets/images/game_character_grandfather.png';
const grandmotherCharacter = '/assets/images/game_character_grandmother.png';

interface Character {
  id: 'grandfather' | 'grandmother';
  name: string;
  image: string;
}

const characters: Character[] = [
  {
    id: 'grandfather',
    name: '할아버지',
    image: grandfatherCharacter
  },
  {
    id: 'grandmother', 
    name: '할머니',
    image: grandmotherCharacter
  }
];

const CharacterSelectPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const scale = useScale();
  
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  
  const searchParams = new URLSearchParams(location.search);
  const scenarioId = searchParams.get('scenario');
  
  const handleCharacterSelect = (index: number) => {
    if (isConfirming) return;
    
    if (selectedCharacterIndex === index) {
      setIsConfirming(true);
      
      const selectedCharacter = characters[index];
      localStorage.setItem('selectedCharacter', selectedCharacter.id);
      
      setTimeout(() => {
        navigate(`/prologue?scenario=${scenarioId}`);
      }, 1200 * Math.max(0.8, scale));
    } else {
      setSelectedCharacterIndex(index);
    }
  };

  const handleBackToScenarios = () => {
    navigate('/scenarios');
  };

  return (
    <div className="relative w-full h-full">
      <Background />
      <BackButton onClick={handleBackToScenarios} />
      
      <div 
        className="flex flex-col items-center justify-between h-full px-4 py-4 space-y-0"
        style={{
          paddingLeft: `calc(16px * ${scale})`,
          paddingRight: `calc(16px * ${scale})`,
          paddingTop: `calc(0px * ${scale})`,
          paddingBottom: `calc(16px * ${scale})`
        }}
      >
        {/* 타이틀 */}
        <div 
          className="bg-green-600 border-green-700 w-full max-w-5xl mb-0"
          style={{
            borderWidth: `calc(8px * ${scale})`,
            borderRadius: `calc(36px * ${scale})`,
            paddingLeft: `calc(72px * ${scale})`,
            paddingRight: `calc(72px * ${scale})`,
            paddingTop: `calc(24px * ${scale})`,
            paddingBottom: `calc(24px * ${scale})`,
            marginBottom: `calc(16px * ${scale})`
          }}
        >
          <h1 
            className="font-black text-white text-center"
            style={{ fontSize: `${2.7 * scale}rem` }}
          >
            원하는 캐릭터를 선택하세요
          </h1>
        </div>

        {/* 메인 컨텐츠 영역 - 캐릭터 선택 */}
        <div 
          className="flex-grow flex flex-col items-center justify-center w-full mt-0 mb-0"
          style={{
            marginTop: `calc(10px * ${scale})`,
            marginBottom: `calc(10px * ${scale})`
          }}
        >
          {/* 캐릭터 표시 영역 */}
          <div 
            className="relative flex justify-center items-center w-full"
            style={{ 
              height: `calc(350px * ${scale})`,
              marginBottom: `calc(5px * ${scale})`,
              gap: `calc(120px * ${scale})`
            }}
          >
            {characters.map((character, index) => {
              const isSelected = selectedCharacterIndex === index;
              const isConfirmingThis = isConfirming && isSelected;
              
              let scaleValue = isSelected ? 1.2 : 0.9;
              let opacity = isSelected ? 1 : 0.7;
              
              if (isConfirmingThis) {
                scaleValue = 1.35;
                opacity = 1;
              }
              
              return (
                <div
                  key={character.id}
                  className="relative transition-all ease-in-out cursor-pointer"
                  style={{
                    transform: `scale(${scaleValue})`,
                    zIndex: isSelected ? 15 : 5,
                    opacity,
                    transitionDuration: `${500 * Math.max(0.8, scale)}ms`
                  }}
                  onClick={() => handleCharacterSelect(index)}
                >
                  <div 
                    className={`overflow-hidden rounded-xl transition-all duration-300 ${
                      isConfirmingThis ? 'animate-confirmSelection' : ''
                    }`}
                    style={{
                      width: `calc(280px * ${scale})`,
                      height: `calc(320px * ${scale})`,
                      border: isSelected ? `calc(12px * ${scale}) solid #0DA429` : 'none',
                      boxSizing: 'border-box',
                      boxShadow: isSelected ? 
                        (isConfirmingThis ? 
                          `0 ${8 * scale}px ${20 * scale}px ${-2 * scale}px rgba(13, 164, 41, 0.4)` :
                          `0 ${4 * scale}px ${6 * scale}px ${-1 * scale}px rgba(0, 0, 0, 0.1)`
                        ) : 'none',
                      borderRadius: `calc(12px * ${scale})`,
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: `calc(20px * ${scale})`
                    }}
                  >
                    <img
                      src={character.image}
                      alt={character.name}
                      className="max-w-full max-h-full object-contain pointer-events-none"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%'
                      }}
                      draggable={false}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* 캐릭터 이름 박스 */}
          <div 
            className={`rounded-lg text-center overflow-hidden pointer-events-none text-white font-black whitespace-nowrap transition-all duration-500 ${
              isConfirming ? 'animate-subtitleGlow' : ''
            }`}
            style={{ 
              width: `calc(280px * ${scale})`,
              backgroundColor: '#0DA429',
              marginTop: `calc(16px * ${scale})`,
              marginBottom: `calc(5px * ${scale})`,
              paddingLeft: `calc(24px * ${scale})`,
              paddingRight: `calc(24px * ${scale})`,
              paddingTop: `calc(12px * ${scale})`,
              paddingBottom: `calc(12px * ${scale})`,
              boxShadow: isConfirming ? `0 0 ${20 * scale}px rgba(13, 164, 41, 0.5)` : 'none'
            }}
          >
            <p 
              className="truncate"
              style={{ fontSize: `calc(2rem * ${scale})` }}
            >
              {characters[selectedCharacterIndex].name}
            </p>
          </div>
          
          {/* 안내 텍스트 */}
          <div 
            className="text-center mt-4"
            style={{ marginTop: `calc(32px * ${scale})` }}
          >
            <p 
              className="text-gray-600 font-bold"
              style={{ fontSize: `calc(1.5rem * ${scale})` }}
            >
              선택한 캐릭터를 다시 터치하면 확정됩니다
            </p>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes confirmSelection {
          0% {
            transform: scale(1);
            filter: brightness(1);
          }
          30% {
            transform: scale(1.05);
            filter: brightness(1.1);
          }
          60% {
            transform: scale(1.02);
            filter: brightness(1.05);
          }
          100% {
            transform: scale(1.03);
            filter: brightness(1.08);
          }
        }

        @keyframes subtitleGlow {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
          100% {
            transform: scale(1.01);
          }
        }
      `}</style>
    </div>
  );
};

export default CharacterSelectPage;