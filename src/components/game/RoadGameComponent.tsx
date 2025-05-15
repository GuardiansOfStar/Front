// src/components/game/RoadGameComponent.tsx 수정

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import RoadScene, { POTHOLE_COLLISION } from '../../game/scenes/RoadScene';

interface RoadGameComponentProps {
  onPotholeCollision: () => void;
}

const RoadGameComponent = ({ onPotholeCollision }: RoadGameComponentProps) => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<RoadScene | null>(null);
  const collisionHandledRef = useRef<boolean>(false);
  
  useEffect(() => {
    console.log('RoadGameComponent 마운트됨');
    
    // 게임이 이미 생성되었으면 새로 생성하지 않음
    if (gameRef.current) {
      return;
    }
    
    // 게임 컨테이너 요소 가져오기
    const container = document.getElementById('game-container');
    if (!container) {
      console.error('게임 컨테이너를 찾을 수 없습니다.');
      return;
    }
    
    // 컨테이너 크기 계산
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    console.log('게임 컨테이너 크기:', containerWidth, containerHeight);
    
    // 게임 인스턴스 생성
    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width: containerWidth,
      height: containerHeight,
      parent: 'game-container',
      scale: {
        mode: Phaser.Scale.NONE,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false
        }
      },
      scene: [RoadScene],
      transparent: true, // 배경색 대신 투명하게 설정
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
    
    // 씬이 생성된 후 이벤트 설정을 위해 약간의 딜레이를 줌
    const timer = setTimeout(setupSceneEvents, 300); // 500ms에서 300ms로 변경
    
    // 화면 크기 변경 시 게임 크기 조정
    const handleResize = () => {
      if (!gameRef.current || !container) return;
      
      // 새 컨테이너 크기 계산
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      
      // 게임 크기 재설정
      gameRef.current.scale.resize(newWidth, newHeight);
      
      // RoadScene의 resize 메서드 호출
      if (sceneRef.current && typeof sceneRef.current.resize === 'function') {
        sceneRef.current.resize(newWidth, newHeight);
      }
    };
    
    // 리사이즈 이벤트 리스너 등록
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
        collisionHandledRef.current = false;
      }
      
      console.log('RoadGameComponent 언마운트됨');
    };
  }, [onPotholeCollision]);
  
  return (
    <div id="game-container" className="w-full h-full" />
  );
};

export default RoadGameComponent;