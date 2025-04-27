import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import gameConfig from '../../game/config';

const GameComponent = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  
  useEffect(() => {
    if (gameRef.current) {
      return;
    }
    
    // 게임 인스턴스 생성
    gameRef.current = new Phaser.Game({
      ...gameConfig,
    });
    
    // 컴포넌트 언마운트 시 게임 인스턴스 제거
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);
  
  return <div id="game-container" className="w-full h-full"></div>;
};

export default GameComponent;