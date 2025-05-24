// src/game/scenes/RoadScene.ts
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
  private roadSpeed: number = 2;
  private positionY: number = 0;
  private roadHeight: number = 0;
  private roadTargetY: number = 0;
  
  // 포트홀 관련 변수
  private potholeDetectionEnabled: boolean = false;
  private simulationTime: number = 0;
  private simulationDuration: number = 8000; // 총 시뮬레이션 시간
  private potholeDetectionTime: number = 2000; // 포트홀 충돌 감지 시간
  private collisionProcessed: boolean = false;
  private redZoneRatioStart: number = 0.1;
  private redZoneRatioEnd:   number = 0.4;
  
  // 포트홀 위치 관련 변수 (새로 추가)
  private potholeStartY: number = 100; // 도로 상단 위치에서 조금 아래
  private potholeTriggerY: number = 0; // 포트홀이 이 Y위치에 도달하면 감지

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
    
    // 게임 크기 저장
    this.gameWidth = this.scale.width;
    this.gameHeight = this.scale.height;
    
    // 디버깅용 그래픽 초기화
    this.debugGraphics = this.add.graphics();
    this.debugGraphics.setDepth(100);

    // 도로 컨테이너 생성
    this.roadContainer = this.add.container(0, 0);
    
    // 도로 이미지 생성
    this.road = this.add.image(
      this.gameWidth / 2,
      this.gameHeight,
      'road'
    );
    
    // 도로 이미지 설정
    this.road.setOrigin(0.5, 1.0);
    const roadAspectRatio = this.road.height / this.road.width;
    this.road.displayWidth = this.gameWidth;
    this.road.displayHeight = this.gameWidth * roadAspectRatio;
    
    this.roadHeight = this.road.displayHeight;
    this.roadTargetY = -(this.roadHeight - this.gameHeight);
    
    // 도로를 컨테이너에 추가
    this.roadContainer.add(this.road);
    
    // *** 중요 변경: 즉시 포트홀 생성 (처음부터 도로에 포함되도록) ***
    this.createPothole();
    
    // 핸들바와 손 추가
    this.hands = this.add.sprite(
      this.gameWidth / 2,
      this.gameHeight,
      'motorcycle_hands'
    );
    this.hands.setOrigin(0.5, 1);
    
    const scaleRatio = this.gameWidth * 0.8 / this.hands.width;
    this.hands.setScale(scaleRatio);
    this.hands.setDepth(10);
    
    // 초기화
    this.simulationTime = 0;
    this.positionY = 0;
    
    console.log('RoadScene create 완료');
  }

  update(time: number, delta: number) {
    if (!this.isGameActive) return;
    
    // 시뮬레이션 시간 업데이트
    this.simulationTime += delta;
    
    // 도로 스크롤 업데이트
    this.positionY += this.roadSpeed;
    
    // 도로가 화면을 벗어나지 않도록 제한
    const newY = Math.max(this.roadTargetY, this.positionY);
    this.roadContainer.y = newY;
    
    // 포트홀 디버깅 및 충돌 감지
    if (this.pothole) {
      // 포트홀의 실제 화면상 위치 계산
      const potholeScreenY = this.pothole.y + this.roadContainer.y;
      
      // 디버그 그래픽 그리기
      this.debugGraphics.clear();
      // this.debugGraphics.lineStyle(2, 0xff0000, 1);
      this.debugGraphics.strokeRect(
        this.pothole.x - (this.pothole.displayWidth / 2),
        potholeScreenY - (this.pothole.displayHeight / 2),
        this.pothole.displayWidth,
        this.pothole.displayHeight
      );
      
      // 로깅 (1초마다)
      if (this.simulationTime % 1000 < 20) {
        console.log('포트홀 현재 위치:', {
          screenY: potholeScreenY,
          roadContainerY: this.roadContainer.y,
          potholeY: this.pothole.y,
          visible: this.pothole.visible,
          detection: this.potholeDetectionEnabled,
          roadPosition: this.positionY
        });
      }
      
      // 포트홀이 화면의 특정 영역(빨간 영역)에 도달했을 때 충돌 감지 활성화
      if (!this.potholeDetectionEnabled && !this.collisionProcessed && 
          potholeScreenY >= this.gameHeight * 0.35 && potholeScreenY <= this.gameHeight * 0.6) {
        this.potholeDetectionEnabled = true;
        console.log('포트홀 감지 활성화됨:', potholeScreenY);
        
        // 충돌 처리 전 약간의 지연 제공 (사용자가 볼 수 있도록)
        this.time.delayedCall(700, () => {
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
  
  // 포트홀 생성 함수 - 완전히 개선됨
  private createPothole() {
    console.log('포트홀 생성 시작');

    // 1) X 좌표
    const centerX   = this.gameWidth / 2;
    const maxOffset = this.gameWidth * 0.05;
    const x = centerX + Phaser.Math.FloatBetween(-maxOffset, maxOffset);

    // 2) 로컬 Y 범위(빨간 존) 계산 & 클램핑
    const roadTopY = this.gameHeight - this.roadHeight;
    let redStartY = Phaser.Math.Clamp(
      roadTopY + this.roadHeight * this.redZoneRatioStart,
      0, this.gameHeight
    );
    let redEndY   = Phaser.Math.Clamp(
      roadTopY + this.roadHeight * this.redZoneRatioEnd,
      0, this.gameHeight
    );

    const initialY = Phaser.Math.FloatBetween(redStartY, redEndY);

    // 3) 스프라이트 한 번만 생성
    const sprite = this.add.sprite(x, initialY, 'pothole');

    // 4) 텍스처 유효성 확인 (실제 상황에선 보통 통과하므로 간단히)
    if (!sprite.texture || !sprite.texture.key) {
      console.error('포트홀 이미지 로드 실패 — 대체 그래픽으로 표시');
      const g = this.add.graphics();
      g.fillStyle(0xff0000, 1);
      g.fillCircle(x, initialY, 30);
      this.roadContainer.add(g);
      return;
    }

    // 5) this.pothole에 할당하고 컨테이너에 추가
    this.pothole = sprite;
    this.pothole.setScale(1);
    this.pothole.setAlpha(1);
    this.pothole.setDepth(5);
    this.roadContainer.add(this.pothole);

    console.log('포트홀 생성 완료 (화면 내 Y):', initialY);
  }


  // 충돌 처리 함수
  private handleCollision() {
    if (this.collisionProcessed) return;
    
    this.collisionProcessed = true;
    this.isGameActive = false;
    
    console.log('포트홀 충돌 이벤트 발생!');
    this.events.emit(POTHOLE_COLLISION);
  }

  // 게임 정지 함수
  public pauseGame() {
    this.isGameActive = false;
  }
  
  // 화면 크기 변경 시 호출될 메서드
  resize(width: number, height: number) {
    this.gameWidth = width;
    this.gameHeight = height;
    
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
    }
  }
}