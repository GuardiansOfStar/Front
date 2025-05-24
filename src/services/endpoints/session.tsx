import api from "../api";

export function createSession(userId: string) {
  return api.post("/sessions", {
    user_id: userId,
    scenario_id: "Home_Farm" // prototype : 단일 시나리오로 일단 진행 
  });
}