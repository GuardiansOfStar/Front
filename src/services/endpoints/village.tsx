// src/services/endpoints/village.ts
import api from "../api";

export interface Village {
  village_id: string;
  village_name: string;
  created_at?: { _seconds: number; _nanoseconds: number };
  updated_at?: { _seconds: number; _nanoseconds: number };
}

export interface RankingEntry {
  village_id: string;
  village_name: string;
  participants: number;
  avg_score: number;
  rank: number;
}
export interface RankingResponse {
  myVillage: RankingEntry | null;
  allVillages: RankingEntry[];
}

/**
 * 마을 목록 조회
 */
export function getVillages() {
  return api.get<Village[]>("/villages");
}

/**
 * 특정 village_id로 마을 상세 조회
 */
export function getVillageById(villageId: string) {
  return api.get<Village>(`/villages/${villageId}`);
}

/**
 * 마을 생성
 * - 이미 존재하는 village_name이 있으면 200번 응답으로 기존 데이터를 리턴
 * - 없으면 새로 생성(201번) 후 생성된 데이터를 리턴
 */
export function createVillage(villageName: string) {
  return api.post<Village>("/villages", {
    village_name: villageName,
  });
}

/**
 * GET /villages/ranking?my_village_id={villageId}
 */
export function getVillageRanking(myVillageId: string) {
  return api.get<RankingResponse>(
    `/villages/ranking?my_village_id=${encodeURIComponent(myVillageId)}`
  );
}