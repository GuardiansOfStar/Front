import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import RoadScene, { POTHOLE_COLLISION } from '../../game/scenes/RoadScene';

interface RoadGameComponentProps {
  onPotholeCollision: () => void;
}

const RoadGameComponent = ({ onPotholeCollision }: RoadGameComponentProps) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<RoadScene | null>(null);
  
  useEffect(() => {
    // 게임이 이미 생성되었으면 새로 생성하지 않음
    if (gameRef.current) {
      return;
    }
    
    // 게임 인스턴스 생성
    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game-container',
        width: '100%',
        height: '100%',
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scene: [RoadScene],
      transparent: false,
      backgroundColor: '#000000', // 검은색 배경
    });
    
    // 게임 인스턴스가 생성된 후 씬에 접근
    const setupSceneEvents = () => {
      if (!gameRef.current) return;
      
      // 씬 인스턴스 가져오기
      const scene = gameRef.current.scene.getScene('RoadScene') as RoadScene;
      if (scene) {
        // 씬 참조 저장
        sceneRef.current = scene;
        
        // 포트홀 충돌 이벤트 리스너 추가
        scene.events.on(POTHOLE_COLLISION, () => {
          // React 컴포넌트에 충돌 이벤트 전달
          onPotholeCollision();
        });
      }
    };
    
    // 씬이 생성된 후 이벤트 설정을 위해 약간의 딜레이를 줌
    const timer = setTimeout(setupSceneEvents, 500);
    
    // 화면 크기 변경 시 게임 크기 조정
    const handleResize = () => {
      if (gameRef.current && sceneRef.current) {
        gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
        
        // RoadScene의 resize 메서드 호출
        if (typeof sceneRef.current.resize === 'function') {
          sceneRef.current.resize(window.innerWidth, window.innerHeight);
        }
      }
    };
    
    // 초기 리사이즈 및 이벤트 리스너 등록
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // 컴포넌트 언마운트 시 게임 인스턴스 제거
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      
      if (gameRef.current) {
        // 이벤트 리스너 제거
        if (sceneRef.current) {
          sceneRef.current.events.off(POTHOLE_COLLISION);
        }
        
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [onPotholeCollision]);
  
  return (
    <div id="game-container" className="w-full h-full">
      {/* 게임 컨테이너 스타일 - 전체 화면 */}
    </div>
  );
};

export default RoadGameComponent;