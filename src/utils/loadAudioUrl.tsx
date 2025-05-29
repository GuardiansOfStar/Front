import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";  // 초기화된 storage 인스턴스

/**
 * Firebase Storage에서 오디오 파일의 다운로드 URL 가져오기.
 * @param fileName - 예: "sample_base.ogg"
 */
export async function loadAudioUrl(fileName: string): Promise<string> {
  const audioRef = ref(storage, `sound/${fileName}`);
  return await getDownloadURL(audioRef);
}
