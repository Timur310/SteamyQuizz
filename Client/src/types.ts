export type User = { id: string; username: string };

export type LobbyProps = {
  currentRoom: string;
  players?: User[];
  hostPlayerId?: string;
};

export type Phase = 'lobby' | 'question' | 'results';