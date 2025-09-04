import { getInitials } from '@/utils/getInitials';
import { useEffect, useState } from 'react';
import { socket } from '../../Socket';
import type { LobbyProps, Phase, User } from '../../types';
import { useLobbySocket } from '../../utils/useLobbySocket';
import { BasicGame } from '../BaseGame/BasicGame';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { copyToClipboard } from '../../utils/copyToClipboard';
import { toast } from 'sonner';

export const GameRoom = ({ currentRoom, players, hostPlayerId }: LobbyProps) => {
    // State
    const [myAnswer, setMyAnswer] = useState<number | null>(null);
    const [users, setUsers] = useState<User[]>(players || []);
    const [hostId, setHostId] = useState(hostPlayerId || "");
    const [phase, setPhase] = useState<Phase>('lobby');
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState<any[]>([]);
    const [correctIndex, setCorrectIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [gameType, setGameType] = useState<number | null>(null);
    const [liveAnswers, setLiveAnswers] = useState<Record<string, number>>({});
    const [scores, setScores] = useState<Record<string, number>>({});
    // When updating liveAnswers, also map user ids to usernames for display in BasicGame
    const [liveAnswersWithNames, setLiveAnswersWithNames] = useState<Record<string, { answer: number, username: string }>>({});

    useLobbySocket({
        setUsers,
        setHostId,
        setPhase,
        setQuestion,
        setOptions,
        setCorrectIndex,
        setLiveAnswers,
        setMyAnswer,
        setLoading,
        setGameType,
        setScores,
    });

    // Handlers
    const startGame = () => {
        // Reset live answers when a new game/question starts
        setLiveAnswers({});
        setLiveAnswersWithNames({});
        socket.emit("start_game", { roomCode: currentRoom });
    };

    useEffect(() => {
        // Map socket.id to username for each answer
        const mapped: Record<string, { answer: number, username: string }> = {};
        Object.entries(liveAnswers).forEach(([userId, answer]) => {
            const user = users.find(u => u.id === userId);
            mapped[userId] = { answer, username: user ? user.username : userId };
        });
        setLiveAnswersWithNames(mapped);
    }, [liveAnswers, users]);

    return (
        <section className='flex flex-col justify-between w-screen h-screen p-4 font-quicksand'>
            <div>
                <section className='flex w-full justify-center items-center'>
                    <Badge
                        className="bg-[#B13BFF] text-lg px-4 py-2 hover:cursor-pointer hover:bg-[#852cc0] transition-colors"
                        variant="neutral"
                        onClick={() => {
                            copyToClipboard(currentRoom);
                            toast.success("Room code copied to clipboard!");
                        }}
                    >
                        {currentRoom}
                    </Badge>
                </section>
                <section className='flex w-full justify-start items-center gap-12 p-4 overflow-x-auto'>
                    {users.map(user => (
                        <Card key={user.id}>
                            <CardContent>
                                <div className='flex justify-between items-center gap-4'>
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" alt={user.username} />
                                        <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                                    </Avatar>
                                    <section className='flex flex-col justify-center items-start'>
                                        <p>{user.username}</p>
                                        <Badge className="ml-2">{scores[user.id] || 0} pts</Badge>
                                    </section>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            </div>
            {loading ? (
                <div className='w-full h-full flex justify-center items-center'>
                    <div className='loader'></div>
                </div>
            ) : (
                <>
                    {phase === "lobby" && hostId === socket.id && (
                        <section className='flex flex-col items-center justify-center'>
                            <Button size="lg" className='hover:cursor-pointer' onClick={startGame}>Start game</Button>
                        </section>
                    )}
                    <BasicGame
                        question={question}
                        options={options}
                        hostId={hostId}
                        phase={phase}
                        correctIndex={correctIndex}
                        setLoading={setLoading}
                        setMyAnswer={setMyAnswer}
                        myAnswer={myAnswer}
                        liveAnswers={liveAnswersWithNames}
                        currentRoom={currentRoom}
                    />
                </>
            )}
        </section>
    );
};