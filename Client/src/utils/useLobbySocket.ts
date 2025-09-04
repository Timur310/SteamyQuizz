import { useEffect } from 'react';
import { socket } from '../Socket';
import type { User, Phase } from '../types';

interface UseLobbySocketProps {
  setUsers: (users: User[]) => void;
  setHostId: (hostId: string) => void;
  setPhase: (phase: Phase) => void;
  setQuestion: (question: string) => void;
  setOptions: (options: any[]) => void;
  setCorrectIndex: (index: number | null) => void;
  setMyAnswer: (answer: number | null) => void;
  setLoading: (loading: boolean) => void;
  setGameType: (type: number | null) => void;
  setLiveAnswers: (answers: Record<string, number>) => void;
  setScores: (scores: Record<string, number>) => void;
}

export function useLobbySocket({
  setUsers,
  setHostId,
  setPhase,
  setQuestion,
  setOptions,
  setCorrectIndex,
  setMyAnswer,
  setLiveAnswers,
  setLoading,
  setGameType,
  setScores,
}: UseLobbySocketProps) {
  useEffect(() => {
    socket.on('room_users', ({ users, hostId }) => {
      setUsers(users);
      setHostId(hostId);
    });
    socket.on('game_started', ({ gameType, phase, question, options }) => {
      setPhase(phase);
      setQuestion(question);
      setOptions(options);
      setCorrectIndex(null);
      setMyAnswer(null);
      setGameType(gameType);
      setLiveAnswers({});
    });
    socket.on("player_answered", ({ answers }: { answers: Record<string, number> }) => {
      setLiveAnswers(answers);
    });

    socket.on('game_results', ({ phase, correctIndex, scores }) => {
      setPhase(phase);
      setCorrectIndex(correctIndex);
      setScores(scores);
    });
    socket.on('loading', (loading) => {
      setLoading(loading);
    });
    // Clean up listeners on unmount
    return () => {
      socket.off('room_users');
      socket.off('game_started');
      socket.off('game_results');
      socket.off('loading');
      socket.off('player_answered');
    };
  }, [setUsers, setHostId, setPhase, setQuestion, setOptions, setCorrectIndex, setMyAnswer, setLoading, setGameType, setScores]);
}
