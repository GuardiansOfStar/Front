// Front/src/game/scenes/RoadScene.ts
import Phaser from 'phaser';

// 이벤트 상수 정의
export const POTHOLE_COLLISION = 'potholeCollision';

export default class RoadScene extends Phaser.Scene {
  // 멤버 변수 선언
  private roadContainer!: Phaser.GameObjects.Container;
  private road!: Phaser.GameObjects.Image;
  private hands!: Phaser.GameObjects.Sprite;
  private pothole!: Phaser.GameObjects.Sprite;
  private debugGraphics!: Phaser.GameObjects.Graphics;
  
  // 게임 상태 관련 변수
  private isGameActive: boolean = true;
  private gameWidth!: number;
  private gameHeight!: number;
  private roadHeight: number = 0;
  private roadTargetY: number = 0;
  
  // 스케일 관련 변수
  private uiScale: number = 1;
  private baseWidth: number = 1024;
  private baseHeight: number = 768;
  
  // 포트홀 관련 변수 - 스케일 적용
  private roadSpeed: number = 2;
  private positionY: number = 0;
  private potholeDetectionEnabled: boolean = false;
  private simulationTime: number = 0;
  private simulationDuration: number = 8000;
  private potholeDetectionTime: number = 2000;
  private collisionProcessed: boolean = false;
  private redZoneRatioStart: number = 0.1;
  private redZoneRatioEnd: number = 0.4;
  
  // 포트홀 위치 관련 변수
  private potholeStartY: number = 100;
  private potholeTriggerY: number = 0;

  constructor() {
    super({ key: 'RoadScene' });
  }

  preload() {
    // 필요한 이미지 로드
    this.load.image('road', '/assets/images/driving_road.png');
    this.load.image('pothole', '/assets/images/small_pothole.png');
    this.load.image('motorcycle_hands', '/assets/images/motorcycle.png');
    
    // 이미지 로드 이벤트 핸들러
    this.load.on('loaderror', (fileObj: any) => {
      console.error('이미지 로드 실패:', fileObj);
    });
    
    this.load.on('filecomplete', (key: string) => {
      console.log('이미지 로드 완료:', key);
    });
    
    this.load.on('complete', () => {
      console.log('모든 이미지 로드 완료');
    });
  }

  create() {
    console.log('RoadScene create 시작');
    
    // 게임 크기 저장 및 스케일 계산
    this.gameWidth = this.scale.width;
    this.gameHeight = this.scale.height;
    this.calculateScale();
    
    // 디버깅용 그래픽 초기화
    this.debugGraphics = this.add.graphics();
    this.debugGraphics.setDepth(100);

    // 도로 컨테이너 생성
    this.roadContainer = this.add.container(0, 0);
    
    // 도로 이미지 생성 - 스케일 적용
    this.road = this.add.image(
      this.gameWidth / 2,
      this.gameHeight,
      'road'
    );
    
    // 도로 이미지 설정 - 스케일 적용
    this.road.setOrigin(0.5, 1.0);
    const roadAspectRatio = this.road.height / this.road.width;
    this.road.displayWidth = this.gameWidth;
    this.road.displayHeight = this.gameWidth * roadAspectRatio;
    
    this.roadHeight = this.road.displayHeight;
    this.roadTargetY = -(this.roadHeight - this.gameHeight);
    
    // 도로를 컨테이너에 추가
    this.roadContainer.add(this.road);
    
    // 포트홀 생성
    this.createPothole();
    
    // 핸들바와 손 추가 - 스케일 적용
    this.hands = this.add.sprite(
      this.gameWidth / 2,
      this.gameHeight,
      'motorcycle_hands'
    );
    this.hands.setOrigin(0.5, 1);
    
    // 손 이미지 크기 조정 - 스케일 적용
    const handsScaleRatio = (this.gameWidth * 0.8 * this.uiScale) / this.hands.width;
    this.hands.setScale(handsScaleRatio);
    this.hands.setDepth(10);
    
    // 도로 속도 스케일 적용
    this.roadSpeed = 2 * this.uiScale;
    this.simulationDuration = 8000 / Math.max(0.8, this.uiScale);
    this.potholeDetectionTime = 2000 / Math.max(0.8, this.uiScale);
    
    // 초기화
    this.simulationTime = 0;
    this.positionY = 0;
    
    console.log('RoadScene create 완료, 스케일:', this.uiScale);
  }

  // 스케일 계산 함수
  private calculateScale() {
    const scaleX = this.gameWidth / this.baseWidth;
    const scaleY = this.gameHeight / this.baseHeight;
    this.uiScale = Math.min(scaleX, scaleY);
    
    // CSS 변수와 동기화
    const rootElement = document.documentElement;
    const computedStyle = getComputedStyle(rootElement);
    const cssScale = computedStyle.getPropertyValue('--scale').trim();
    if (cssScale && !isNaN(parseFloat(cssScale))) {
      this.uiScale = parseFloat(cssScale);
    }
    
    console.log('Phaser 스케일 계산:', {
      gameSize: { width: this.gameWidth, height: this.gameHeight },
      baseSize: { width: this.baseWidth, height: this.baseHeight },
      calculatedScale: this.uiScale,
      cssScale: cssScale
    });
  }

  update(time: number, delta: number) {
    if (!this.isGameActive) return;
    
    // 시뮬레이션 시간 업데이트 - 스케일 적용
    this.simulationTime += delta * this.uiScale;
    
    // 도로 스크롤 업데이트 - 스케일 적용
    this.positionY += this.roadSpeed;
    
    // 도로가 화면을 벗어나지 않도록 제한
    const newY = Math.max(this.roadTargetY, this.positionY);
    this.roadContainer.y = newY;
    
    // 포트홀 디버깅 및 충돌 감지
    if (this.pothole) {
      // 포트홀의 실제 화면상 위치 계산
      const potholeScreenY = this.pothole.y + this.roadContainer.y;
      
      // 디버그 그래픽 그리기 - 스케일 적용
      this.debugGraphics.clear();
      const debugLineWidth = 2 * this.uiScale;
      this.debugGraphics.lineStyle(debugLineWidth, 0xff0000, 1);
      this.debugGraphics.strokeRect(
        this.pothole.x - (this.pothole.displayWidth / 2),
        potholeScreenY - (this.pothole.displayHeight / 2),
        this.pothole.displayWidth,
        this.pothole.displayHeight
      );
      
      // 로깅 간격 조정 - 스케일 적용
      const logInterval = 1000 / Math.max(0.8, this.uiScale);
      if (this.simulationTime % logInterval < 20) {
        console.log('포트홀 현재 위치:', {
          screenY: potholeScreenY,
          roadContainerY: this.roadContainer.y,
          potholeY: this.pothole.y,
          visible: this.pothole.visible,
          detection: this.potholeDetectionEnabled,
          roadPosition: this.positionY,
          scale: this.uiScale
        });
      }
      
      // 포트홀 충돌 감지 영역 - 스케일 적용
      const detectionStartY = this.gameHeight * (0.35 * this.uiScale);
      const detectionEndY = this.gameHeight * (0.6 * this.uiScale);
      
      if (!this.potholeDetectionEnabled && !this.collisionProcessed && 
          potholeScreenY >= detectionStartY && potholeScreenY <= detectionEndY) {
        this.potholeDetectionEnabled = true;
        console.log('포트홀 감지 활성화됨:', potholeScreenY);
        
        // 충돌 처리 지연 - 스케일 적용
        const collisionDelay = 700 / Math.max(0.8, this.uiScale);
        this.time.delayedCall(collisionDelay, () => {
          if (this.isGameActive && !this.collisionProcessed) {
            console.log('포트홀 충돌 처리 시작');
            this.handleCollision();
          }
        });
      }
    }
    
    // 시뮬레이션 종료 체크
    if (this.simulationTime >= this.simulationDuration && !this.collisionProcessed) {
      console.log('시뮬레이션 시간 종료, 충돌 강제 처리');
      this.handleCollision();
    }
  }
  
  // 포트홀 생성 함수 - 스케일 적용
  private createPothole() {
    console.log('포트홀 생성 시작, 스케일:', this.uiScale);

    // X 좌표 - 스케일 적용
    const centerX = this.gameWidth / 2;
    const maxOffset = this.gameWidth * 0.05 * this.uiScale;
    const x = centerX + Phaser.Math.FloatBetween(-maxOffset, maxOffset);

    // Y 범위 계산 - 스케일 적용
    const roadTopY = this.gameHeight - this.roadHeight;
    let redStartY = Phaser.Math.Clamp(
      roadTopY + this.roadHeight * this.redZoneRatioStart * this.uiScale,
      0, this.gameHeight
    );
    let redEndY = Phaser.Math.Clamp(
      roadTopY + this.roadHeight * this.redZoneRatioEnd * this.uiScale,
      0, this.gameHeight
    );

    const initialY = Phaser.Math.FloatBetween(redStartY, redEndY);

    // 포트홀 스프라이트 생성
    const sprite = this.add.sprite(x, initialY, 'pothole');

    // 텍스처 유효성 확인
    if (!sprite.texture || !sprite.texture.key) {
      console.error('포트홀 이미지 로드 실패 — 대체 그래픽으로 표시');
      const g = this.add.graphics();
      g.fillStyle(0xff0000, 1);
      const fallbackRadius = 30 * this.uiScale;
      g.fillCircle(x, initialY, fallbackRadius);
      this.roadContainer.add(g);
      return;
    }

    // 포트홀 크기 조정 - 스케일 적용
    const potholeScale = 1 * this.uiScale;
    sprite.setScale(potholeScale);
    sprite.setAlpha(1);
    sprite.setDepth(5);

    this.pothole = sprite;
    this.roadContainer.add(this.pothole);

    console.log('포트홀 생성 완료 (스케일 적용된 Y):', initialY, '스케일:', this.uiScale);
  }

  // 충돌 처리 함수
  private handleCollision() {
    if (this.collisionProcessed) return;
    
    this.collisionProcessed = true;
    this.isGameActive = false;
    
    console.log('포트홀 충돌 이벤트 발생! 스케일:', this.uiScale);
    this.events.emit(POTHOLE_COLLISION);
  }

  // 게임 정지 함수
  public pauseGame() {
    this.isGameActive = false;
  }
  
  // 화면 크기 변경 시 호출될 메서드 - 스케일 재계산
  resize(width: number, height: number) {
    this.gameWidth = width;
    this.gameHeight = height;
    this.calculateScale();
    
    if (this.road) {
      const roadAspectRatio = this.road.height / this.road.width;
      this.road.displayWidth = this.gameWidth;
      this.road.displayHeight = this.gameWidth * roadAspectRatio;
      
      this.roadHeight = this.road.displayHeight;
      this.roadTargetY = -(this.roadHeight - this.gameHeight);
      
      this.road.x = this.gameWidth / 2;
      this.road.y = this.gameHeight;
    }
    
    if (this.hands) {
      this.hands.x = this.gameWidth / 2;
      this.hands.y = this.gameHeight;
      
      // 손 이미지 크기 재조정 - 스케일 적용
      const handsScaleRatio = (this.gameWidth * 0.8 * this.uiScale) / this.hands.width;
      this.hands.setScale(handsScaleRatio);
    }
    
    // 도로 속도 재조정
    this.roadSpeed = 2 * this.uiScale;
    
    console.log('RoadScene 리사이즈 완료, 새 스케일:', this.uiScale);
  }
}