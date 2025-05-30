// src/context/ScoreContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { updateSessionScore } from '../services/endpoints/session';

interface ScoreContextType {
  totalScore: number;
  questScores: Record<string, number>;
  updateQuestScore: (questId: string, score: number) => void;
  getTotalScore: () => number;
  resetScores: () => void;
}

const ScoreContext = createContext<ScoreContextType | null>(null);

export const ScoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [questScores, setQuestScores] = useState<Record<string, number>>({});
  const [totalScore, setTotalScore] = useState(0);

  const updateQuestScore = (questId: string, score: number) => {
    setQuestScores(prev => {
      const updated = { ...prev, [questId]: score };
      const newTotal = Object.values(updated).reduce((sum, s) => sum + s, 0);
      setTotalScore(newTotal);
      
      // session update api call
      const sessionId = localStorage.getItem('session_id');
      if (sessionId) {
        updateSessionScore(sessionId, newTotal)
          .then(() => console.log('✅ 세션 점수 업데이트:', newTotal))
          .catch(err => console.error('❌ 세션 점수 업데이트 실패:', err));
      }
      
      return updated;
    });
  };

  const resetScores = () => {
    setQuestScores({});
    setTotalScore(0);
  };

  return (
    <ScoreContext.Provider value={{ 
      totalScore, 
      questScores, 
      updateQuestScore, 
      getTotalScore: () => totalScore,
      resetScores 
    }}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => {
  const context = useContext(ScoreContext);
  if (!context) throw new Error('useScore must be used within ScoreProvider');
  return context;
};