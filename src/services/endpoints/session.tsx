import api from "../api";

export function createSession(userId: string) {
  return api.post("/sessions", {
    user_id: userId,
    scenario_id: "Home_Farm" // prototype : 단일 시나리오로 일단 진행 
  });
}

// session total score management api
export function updateSessionScore(sessionId: string, totalScore: number) {
  return api.put(`/sessions/${sessionId}`, {
    total_score: totalScore
  });
}

export function completeSession(sessionId: string) {
  return api.put(`/sessions/${sessionId}/complete`, {
    end_time: new Date().toISOString()
  });
}