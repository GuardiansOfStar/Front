import Phaser from 'phaser';
// Scene 클래스는 여기서 참조하지 않고 직접 사용하는 곳에서 임포트하기

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  // 전체 화면을 사용하도록 설정
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'game-container',
    width: 1024,
    height: 768,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  // scene 필드는 RoadGameComponent에서 직접 설정하므로 여기서는 빈 배열로 둠
  scene: [],
  backgroundColor: '#87CEEB',
};

export default gameConfig;