import { useEffect, useState } from "react";
import { socket } from './Socket';
import { GameRoom } from "./components/Lobby/Lobby";
import { LandingPage } from "./components/LandingPage/LandingPage";
import type { User } from "./types";

export const App = () => {
  const [currentRoom, setCurrentRoom] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [hostId, setHostId] = useState("");

  useEffect(() => {
    socket.on("room_created", ({ roomCode, users, hostId }) => {
      setUsers(users);
      setHostId(hostId);
      setCurrentRoom(roomCode);
    });

    socket.on("joined_room", ({ roomCode }) => {
      setCurrentRoom(roomCode);
    });

    socket.on("room_users", ({ users, hostId }) => {
      setUsers(users);
      setHostId(hostId);
    });
  }, []);

  if (!currentRoom) return <LandingPage />;
  return <GameRoom players={users} hostPlayerId={hostId} currentRoom={currentRoom} />;
};