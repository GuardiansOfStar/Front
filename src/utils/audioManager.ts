class AudioManager {
    private audioContext: AudioContext;
    private gainNode: GainNode; //볼륨 조절
    private audioDestination: AudioDestinationNode; //최종 출력지
    private sounds: Record<string, string>; //효과음 네이밍
    private loadedAudioBuffers: Map<string, AudioBuffer> = new Map(); //로드된 오디오 파일 캐시 저장소
    private currentSources: Map<string, AudioBufferSourceNode> = new Map(); //현재 재생중인 효과음 소스

    constructor() {
        this.audioContext = new AudioContext();
        this.audioDestination = this.audioContext.destination;
        this.gainNode = this.audioContext.createGain();

        //볼륨 조절 노드와 출력지 연결
        this.gainNode.connect(this.audioDestination);

        //첫 사용자 상호작용 시 AudioContext 활성화
        this.setupFirstUserInteraction();

        //효과음 정의
        this.sounds = {
            //공통 효과음
            buttonClick: '/assets/sound/common/button_click.mp3',
            message: '/assets/sound/common/message.mp3',
            etcSound: '/assets/sound/common/basic_alarm.mp3',

            //프롤로그 효과음
            missionGuide: '/assets/sound/prologue/mission_guide.mp3',
            mapGuide: '/assets/sound/prologue/map_guide.mp3',
            motorcycle: '/assets/sound/prologue/bring_motorcycle.mp3',

            //퀘스트 효과음
            beginQuest: '/assets/sound/quest/appear_quest.wav',
            selectAnswer: '/assets/sound/quest/select_answer.mp3',
            //퀘스트 정답 효과음
            rightAnswer: '/assets/sound/quest/right_answer.mp3',
            goodFeedback: '/assets/sound/quest/good_feedback.mp3',
            //퀘스트 오답 효과음
            accidentMotor: '/assets/sound/quest/q2(4)_acc_simul.mp3',
            accidentBefore: '/assets/sound/quest/q5_before_acc.mp3',
            accidentGorani: '/assets/sound/quest/q5_gorani.mp3',
            warning: '/assets/sound/quest/warning_feedback.mp3',
            //퀘스트1(카드게임) 관련 효과음
            flipCards: '/assets/sound/quest/q1_all_of_card.mp3',
            cardClick: '/assets/sound/quest/q1_card_select.mp3',
            wrongCard: '/assets/sound/quest/q1_card_fail.mp3',
            helmetOn: '/assets/sound/quest/q1_helmet_on.mp3',
            revealAnswer: '/assets/sound/quest/q1_show_answer.mp3',
            shakingBox: '/assets/sound/quest/q1_shaking_box.mp3',
            openBox: '/assets/sound/quest/q1_ta-da.mp3',
            //퀘스트3(막걸리게임) 관련 효과음
            makClick: '/assets/sound/quest/q3_mak_select.mp3',
            //퀘스트5 관련 효과음
            barClick: '/assets/sound/quest/q5_drag_click.mp3',
            //퀘스트 점수 효과음
            highScore: '/assets/sound/quest/q_score_up.mp3',
            lowScore: '/assets/sound/quest/q_score_down.mp3',

            //화면 전환 효과음
            sceneSwitch: '/assets/sound/transition/scene_switch.mp3',
            appleBox: '/assets/sound/transition/stacking_box.mp3',
            working: '/assets/sound/transition/working.mp3',

            //결과 효과음
            reportGeneral: '/assets/sound/result/report_general.mp3',
            reportPerfect: '/assets/sound/result/report_perfect.mp3'
        };
    }

    // 첫 사용자 상호작용 감지 및 AudioContext 활성화
    private setupFirstUserInteraction(): void {
        const activateAudio = async () => {
            if (this.audioContext.state === 'suspended') {
              try {
                await this.audioContext.resume();
                console.log('AudioContext가 활성화 되었습니다.');
              } catch (error) {
                console.error('AudioContext 활성화에 실패하였습니다.:', error);
              }
            }
        };

        const events = ['touchstart', 'touchend', 'click'];
        const handleFirstInteraction = () => {
            activateAudio();
            // 한 번만 실행되도록 이벤트 리스너 제거
            events.forEach(event => {
              document.removeEventListener(event, handleFirstInteraction);
            });
        };
      
        // 모든 상호작용 이벤트에 리스너 등록
        events.forEach(event => {
            document.addEventListener(event, handleFirstInteraction, { once: true });
        });
    }

    //AudioContext 상태 확인
    private async ensureAudioContextRunning(): Promise<void> {
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    /*
    오디오 파일을 로드하고 AudioBuffer로 변환
    처음 사용하는 파일 -> 네트워크 파일 로드 -> 캐시에 저장
    재사용 파일 -> 캐시에서 로드
    */
    private async loadAudioBuffer(url: string): Promise<AudioBuffer> {
        // 이미 로드된 오디오가 있다면 캐시에서 반환
        if (this.loadedAudioBuffers.has(url)) {
            return this.loadedAudioBuffers.get(url)!;
        }
    
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            // 캐시에 저장
            this.loadedAudioBuffers.set(url, audioBuffer);
            return audioBuffer;
        } catch (error) {
            console.error(`오디오 로드에 실패하였습니다.: ${url}`, error);
            throw error;
        }
    }

    //효과음 재생 (볼륨: 0-무음 ~ 1-100%)
    async playSound(soundName: string, volume: number = 1): Promise<void> {
        const audioUrl = this.sounds[soundName];
        
        if (!audioUrl) {
            console.warn(`${soundName} 오디오 파일을 찾지 못하였습니다.`);
            return;
        }
    
        try {
            await this.ensureAudioContextRunning();
            const audioBuffer = await this.loadAudioBuffer(audioUrl);
            
            // AudioBufferSourceNode 생성: 일회용 오디오 재생기, 매번 생성
            const sourceNode = this.audioContext.createBufferSource();
            //개별 볼륨 조절 노드
            const volumeNode = this.audioContext.createGain();
            
            //오디오 데이터를 재생 노드에 연결
            sourceNode.buffer = audioBuffer;
            volumeNode.gain.value = volume; //개별 볼륨 -> 전체 볼륨
            
            //현재 재생 중인 소스 저장
            this.currentSources.set(soundName, sourceNode);

            //재생 완료 시 Map에서 제거
            sourceNode.onended = () => {
                this.currentSources.delete(soundName);
            };
            
            // 오디오 파이프라인 연결
            sourceNode.connect(volumeNode); //재생기 -> 개별 볼륨
            volumeNode.connect(this.gainNode); //개별 볼륨 -> 전체 볼륨
            
            // 재생
            sourceNode.start();
        } catch (error) {
            console.error(`오디오 재생에 실패하였습니다.: ${soundName}`, error);
        }
    }

    stopSound(soundName: string): void {
        const sourceNode = this.currentSources.get(soundName);
        if (sourceNode) {
          sourceNode.stop();
          this.currentSources.delete(soundName);
        }
    }

    //전체 볼륨 조절
    setVolume(volume: number): void {
        this.gainNode.gain.value = volume;
    }

    //자주 사용하는 효과음 메서드
    playButtonClick(): void {
        this.playSound('buttonClick', 0.7);
    }

    playMessageAlarm(): void {
        this.playSound('message', 0.7);
    }

    playQuestStart(): void {
        this.playSound('beginQuest', 0.7);
    }

    playQuestSelect(): void {
        this.playSound('selectAnswer', 0.7);
    }

    playRightAnswer1(): void {
        this.playSound('rightAnswer', 0.7);
    }

    playRightAnswer2(): void {
        this.playSound('goodFeedback', 0.7);
    }

    playWrongAnswer(): void {
        this.playSound('warning', 0.7);
    }

    playsceneSwitch(): void {
        this.playSound('sceneSwitch', 0.7);
    }     
          
}

export const audioManager = new AudioManager();
