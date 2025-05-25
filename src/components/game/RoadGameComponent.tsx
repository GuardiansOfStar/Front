// Front/src/components/game/RoadGameComponent.tsx
import { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import RoadScene, { POTHOLE_COLLISION } from '../../game/scenes/RoadScene';
import { useScale } from '../../hooks/useScale';

interface RoadGameComponentProps {
  onPotholeCollision: () => void;
}

const RoadGameComponent = ({ onPotholeCollision }: RoadGameComponentProps) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<RoadScene | null>(null);
  const collisionHandledRef = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // loading state
  const [isLoading, setIsLoading] = useState(true);
  const scale = useScale();
  
  // 기준 해상도
  const BASE_WIDTH = 1024;
  const BASE_HEIGHT = 768;
  
  useEffect(() => {
    console.log('RoadGameComponent 마운트됨, 스케일:', scale);
    
    // 게임이 이미 생성되었으면 새로 생성하지 않음
    if (gameRef.current) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    // 게임 컨테이너 요소 가져오기
    const container = document.getElementById('game-container');
    if (!container) {
      console.error('게임 컨테이너를 찾을 수 없습니다.');
      return;
    }
    
    containerRef.current = container as HTMLDivElement;
    
    // 컨테이너 크기 계산 - 스케일 적용
    const calculateGameSize = () => {
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;
      
      // 스케일을 고려한 게임 크기 계산
      const gameWidth = Math.max(BASE_WIDTH * scale, containerWidth);
      const gameHeight = Math.max(BASE_HEIGHT * scale, containerHeight);
      
      console.log('게임 크기 계산:', {
        container: { width: containerWidth, height: containerHeight },
        calculated: { width: gameWidth, height: gameHeight },
        scale: scale
      });
      
      return { gameWidth, gameHeight };
    };
    
    const { gameWidth, gameHeight } = calculateGameSize();
    
    // 게임 설정 - 스케일 적용
    const gameConfig: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: gameWidth,
      height: gameHeight,
      parent: 'game-container',
      scale: {
        mode: Phaser.Scale.NONE, // 자동 스케일링 비활성화
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scene: [RoadScene],
      transparent: true,
      // 고해상도 지원
      render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false
      }
    };
    
    // 게임 인스턴스 생성
    gameRef.current = new Phaser.Game(gameConfig);
    
    // 씬 이벤트 설정
    const setupSceneEvents = () => {
      if (!gameRef.current) return;
      
      // 씬 인스턴스 가져오기
      const scene = gameRef.current.scene.getScene('RoadScene') as RoadScene;
      if (scene) {
        // 씬 참조 저장
        sceneRef.current = scene;
        
        // 포트홀 충돌 이벤트 리스너 추가
        scene.events.on(POTHOLE_COLLISION, () => {
          // 중복 호출 방지
          if (collisionHandledRef.current) return;
          collisionHandledRef.current = true;
          
          console.log('RoadGameComponent: 포트홀 충돌 이벤트 수신됨');
          // React 컴포넌트에 충돌 이벤트 전달
          onPotholeCollision();
        });
        
        console.log('씬 이벤트 리스너 등록됨');
      } else {
        console.error('RoadScene을 찾을 수 없습니다.');
      }
    };
    
    // 씬이 생성된 후 이벤트 설정
    const eventSetupDelay = 300 * Math.max(0.8, scale);
    const timer = setTimeout(setupSceneEvents, eventSetupDelay);
    
    // ResizeObserver를 사용한 반응형 크기 조정
    const setupResizeObserver = () => {
      if (!container || !gameRef.current) return;
      
      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          
          if (gameRef.current && width > 0 && height > 0) {
            // 새로운 게임 크기 계산 - 스케일 적용
            const newGameWidth = Math.max(BASE_WIDTH * scale, width);
            const newGameHeight = Math.max(BASE_HEIGHT * scale, height);
            
            console.log('리사이즈 감지:', {
              container: { width, height },
              newGame: { width: newGameWidth, height: newGameHeight },
              scale: scale
            });
            
            // 게임 크기 조정
            gameRef.current.scale.resize(newGameWidth, newGameHeight);
            
            // RoadScene의 resize 메서드 호출
            if (sceneRef.current && typeof sceneRef.current.resize === 'function') {
              sceneRef.current.resize(newGameWidth, newGameHeight);
            }
          }
        }
      });
      
      resizeObserverRef.current.observe(container);
    };
    
    // ResizeObserver 설정
    setupResizeObserver();
    
    // 게임 로딩 완료 처리
    const handleGameReady = () => {
      console.log('게임 리소스 로딩 완료');
      setIsLoading(false);
    };

    gameRef.current.events.once('ready', handleGameReady);
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      clearTimeout(timer);
      
      // ResizeObserver 정리
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      
      if (gameRef.current) {
        // 이벤트 리스너 제거
        if (sceneRef.current) {
          sceneRef.current.events.off(POTHOLE_COLLISION);
        }
        
        gameRef.current.events.off('ready', handleGameReady);
        gameRef.current.destroy(true);
        gameRef.current = null;
        sceneRef.current = null;
        collisionHandledRef.current = false;
      }
      
      console.log('RoadGameComponent 언마운트됨');
    };
  }, [onPotholeCollision, scale]);
  
  // 스케일 변경 시 게임 크기 재조정
  useEffect(() => {
    if (gameRef.current && containerRef.current) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      
      // 새로운 게임 크기 계산
      const newGameWidth = Math.max(BASE_WIDTH * scale, containerRect.width);
      const newGameHeight = Math.max(BASE_HEIGHT * scale, containerRect.height);
      
      console.log('스케일 변경으로 인한 게임 크기 조정:', {
        newScale: scale,
        newSize: { width: newGameWidth, height: newGameHeight }
      });
      
      // 게임 크기 조정
      gameRef.current.scale.resize(newGameWidth, newGameHeight);
      
      // RoadScene의 resize 메서드 호출
      if (sceneRef.current && typeof sceneRef.current.resize === 'function') {
        sceneRef.current.resize(newGameWidth, newGameHeight);
      }
    }
  }, [scale]);
  
  return (
    <div id="game-container" className="w-full h-full relative">
      {isLoading && (
        <div 
          className="absolute inset-0 bg-green-50 z-10 transition-opacity flex items-center justify-center"
          style={{ 
            transitionDuration: `${500 * Math.max(0.8, scale)}ms` 
          }}
        >
          <div 
            className="text-green-600 font-bold"
            style={{ fontSize: `calc(1.5rem * ${scale})` }}
          >
            게임 로딩 중...
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadGameComponent;