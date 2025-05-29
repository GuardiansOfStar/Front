// src/hooks/useHowlerBgm.ts
import { useEffect, useRef } from "react";
import { Howl } from "howler";
import { loadAudioUrl } from "../utils/loadAudioUrl";

export function useHowlerBgm(fileName: string) {
  const howlRef = useRef<Howl | null>(null);

  useEffect(() => {
    let mounted = true;

    // Firebase Storage에서 오디오 URL 받아오기
    loadAudioUrl(fileName)
      .then((url) => {
        if (!mounted) return;
        // Howler 인스턴스 생성
        howlRef.current = new Howl({
          src: [url],
          loop: true,    // 무한 반복
          volume: 0.5,   // 볼륨 조절
        });
        howlRef.current.play();
      })
      .catch((err) => {
        console.error("BGM 로드 실패:", err);
      });

    // 언마운트 시 재생 중지
    return () => {
      mounted = false;
      howlRef.current?.stop();
    };
  }, [fileName]);

  return howlRef.current;
}
