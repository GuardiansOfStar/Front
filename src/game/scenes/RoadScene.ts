import Phaser from 'phaser';

// 이벤트 상수 정의
export const POTHOLE_COLLISION = 'potholeCollision';

export default class RoadScene extends Phaser.Scene {
  // 멤버 변수 선언
  private roadContainer!: Phaser.GameObjects.Container;
  private road!: Phaser.GameObjects.Image;
  private hands!: Phaser.GameObjects.Sprite;
  private pothole!: Phaser.GameObjects.Sprite;
  private isGameActive: boolean = true;
  private gameWidth!: number;
  private gameHeight!: number;
  private roadSpeed: number = 1.2; // 스크롤 속도 (매우 느리게)
  private positionY: number = 0;
  private roadHeight: number = 0;
  private roadTargetY: number = 0;
  private potholeAppeared: boolean = false;
  private potholeDetectionEnabled: boolean = false;
  private simulationTime: number = 0;
  private simulationDuration: number = 9000; // 전체 시뮬레이션 시간 (9초)
  private potholeAppearTime: number = 3000; // 포트홀 등장 시간 (3초 후)
  private potholeDetectionTime: number = 6000; // 포트홀 충돌 감지 시간 (6초 후)

  constructor() {
    super({ key: 'RoadScene' });
  }

  preload() {
    // 필요한 이미지 로드
    this.load.image('road', '/assets/images/driving_road.png');
    this.load.image('pothole', '/assets/images/small_pothole.png');
    this.load.image('motorcycle_hands', '/assets/images/motorcycle.png');
  }

  create() {
    // 게임 크기 저장
    this.gameWidth = this.scale.width;
    this.gameHeight = this.scale.height;

    // 도로 컨테이너 생성 (도로와 포트홀을 함께 담을 컨테이너)
    this.roadContainer = this.add.container(0, 0);
    
    // 도로 이미지 생성 - 단일 이미지 사용
    this.road = this.add.image(
      this.gameWidth / 2,  // x 위치 (중앙)
      this.gameHeight,     // y 위치 (하단에서 시작) - 변경됨
      'road'
    );
    
    // 도로 이미지 크기 조정 - 가로는 화면 너비에 맞추고, 비율 유지
    this.road.setOrigin(0.5, 1.0); // 원점을 하단 중앙으로 설정 - 변경됨
    const roadAspectRatio = this.road.height / this.road.width;
    this.road.displayWidth = this.gameWidth;
    this.road.displayHeight = this.gameWidth * roadAspectRatio;
    
    // 도로 높이 저장
    this.roadHeight = this.road.displayHeight;
    
    // 도로 최종 위치 계산 (도로의 상단이 화면 상단에 도달할 때) - 변경됨
    this.roadTargetY = -(this.roadHeight - this.gameHeight);
    
    // 도로를 컨테이너에 추가
    this.roadContainer.add(this.road);
    
    // 핸들바와 손 추가 (1인칭 시점) - 화면 하단에 맞춤
    this.hands = this.add.sprite(
      this.gameWidth / 2,         // x 위치 (중앙)
      this.gameHeight,            // y 위치 (완전 하단)
      'motorcycle_hands'
    );
    this.hands.setOrigin(0.5, 1); // 원점을 하단 중앙으로 설정하여 화면 하단에 맞춤
    this.hands.setScale(0.7);     // 크기 조정
    this.hands.setDepth(10);      // 가장 앞에 보이도록 설정
    
    // 시뮬레이션 타이머 초기화
    this.simulationTime = 0;
    
    // 초기 위치 설정 - 추가됨
    this.positionY = 0;
  }

  update(time: number, delta: number) {
    if (!this.isGameActive) return;
    
    // 시뮬레이션 시간 업데이트
    this.simulationTime += delta;
    
    // 도로 스크롤 업데이트 - 부드러운 스크롤 효과 - 변경됨
    this.positionY += this.roadSpeed; // 음수 방향으로 변경하여 위로 스크롤
    
    // 도로가 화면을 벗어나지 않도록 제한 - 변경됨
    const newY = Math.max(this.roadTargetY, this.positionY);
    this.roadContainer.y = newY;
    
    // 포트홀 생성 시점인지 확인
    if (this.simulationTime >= this.potholeAppearTime && !this.potholeAppeared) {
      this.createPothole();
      this.potholeAppeared = true;
    }
    
    // 포트홀 충돌 감지 시점인지 확인
    if (this.simulationTime >= this.potholeDetectionTime && !this.potholeDetectionEnabled) {
      this.potholeDetectionEnabled = true;
      this.handleCollision();
    }
    
    // 시뮬레이션 종료 시점인지 확인
    if (this.simulationTime >= this.simulationDuration) {
      this.isGameActive = false;
    }
  }

  // 포트홀 생성 함수 - 수정됨
  private createPothole() {
    // 랜덤 x 위치 계산 (도로 중앙 좌, 중앙, 중앙 우)
    const positions = [
      this.gameWidth / 2 - 100,  // 중앙 좌
      this.gameWidth / 2,        // 중앙
      this.gameWidth / 2 + 100   // 중앙 우
    ];
    const x = Phaser.Math.RND.pick(positions);
    
    // 포트홀 y 위치 계산 (도로 상단 근처에 위치) - 변경됨
    const y = this.roadHeight * 0.3; // 도로 전체 높이의 30% 지점에 위치
    
    // 포트홀 생성
    this.pothole = this.add.sprite(
      x,                // 랜덤 x 위치
      y,                // y 위치
      'pothole'
    );
    
    // 포트홀 크기 키우기 (고령자가 인식하기 쉽게)
    this.pothole.setScale(0.7); // 더 크게 설정
    
    // 포트홀을 컨테이너에 추가
    this.roadContainer.add(this.pothole);
  }

  // 충돌 처리 함수
  private handleCollision() {
    this.isGameActive = false;  // 게임 정지
    
    // 게임 외부(React 컴포넌트)에 충돌 이벤트 전달
    this.events.emit(POTHOLE_COLLISION);
  }

  // 게임 정지 함수 (외부에서 사용)
  public pauseGame() {
    this.isGameActive = false;
  }
  
  // 화면 크기 변경 시 호출될 메서드
  resize(width: number, height: number) {
    this.gameWidth = width;
    this.gameHeight = height;
    
    // 도로 이미지 크기 재조정
    if (this.road) {
      const roadAspectRatio = this.road.height / this.road.width;
      this.road.displayWidth = this.gameWidth;
      this.road.displayHeight = this.gameWidth * roadAspectRatio;
      
      // 도로 높이 업데이트
      this.roadHeight = this.road.displayHeight;
      
      // 도로 최종 위치 재계산 - 변경됨
      this.roadTargetY = -(this.roadHeight - this.gameHeight);
      
      // 도로 위치 재설정
      this.road.x = this.gameWidth / 2;
      this.road.y = this.gameHeight; // 변경됨 - 하단에 위치
    }
    
    // 핸들바 위치 재조정
    if (this.hands) {
      this.hands.x = this.gameWidth / 2;
      this.hands.y = this.gameHeight;
    }
  }
}