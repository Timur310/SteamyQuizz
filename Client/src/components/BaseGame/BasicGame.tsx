import { getInitials } from '@/utils/getInitials';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { socket } from '../../Socket';
import { maskGameNames } from '../../utils/maskGameNames';
import { steamFormatToHtml } from "../../utils/steamFormatToHtml";
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';
import ImageCard from '../ui/image-card';
import { ScrollArea } from '../ui/scroll-area';
import { useEffect, useState } from 'react';

type BasicGameProps = {
    question: string;
    options: { id: number; name: string; thumbnail: string }[];
    hostId: string;
    phase: string;
    correctIndex: number | null;
    setLoading: (loading: boolean) => void;
    setMyAnswer: (answer: number | null) => void;
    myAnswer: number | null;
    currentRoom: string;
    liveAnswers?: Record<string, { answer: number, username: string }>; // Now expects answer and username
}

export const BasicGame = ({ question, options, hostId, phase, correctIndex, setLoading, setMyAnswer, myAnswer, currentRoom, liveAnswers }: BasicGameProps) => {
    const [shuffledOptions, setShuffledOptions] = useState(options);

    // Shuffle only when options or question changes
    useEffect(() => {
        function shuffleOptions<T>(arr: T[]): T[] {
            const copy = [...arr];
            for (let i = copy.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [copy[i], copy[j]] = [copy[j], copy[i]];
            }
            return copy;
        }
        setShuffledOptions(shuffleOptions(options));
    }, [options, question]);

    // useEffect(() => {
    //     socket.on("game_results", ({ phase, correctIndex, scores })) => {})
    // },[])

    const onAnswerSubmit = (id: number) => {
        if (myAnswer !== null) return; // prevent multiple answers
        setMyAnswer(id);
        socket.emit("submit_answer", { roomCode: currentRoom, answerIndex: id });
    };

    return (
        <>
            {question && shuffledOptions &&
                <>
                    <section className='flex flex-row justify-evenly items-center flex-wrap gap-4 grow text-center'>
                        <div className="overflow-y-auto max-w-[65%] h-fit max-h-[420px] rounded-base text-main-foreground border-2 border-border bg-main p-4 shadow-shadow" dangerouslySetInnerHTML={{ __html: steamFormatToHtml(maskGameNames(question, options)) }} />
                    </section>
                    <section className='flex flex-row justify-evenly items-center flex-wrap grow w-full p-4'>
                        {shuffledOptions.map((option: any) => {
                            const isCorrect = correctIndex === option.id;
                            // Find all users who voted for this option
                            const voters = Object.values(liveAnswers ?? {})
                                .filter(({ answer }) => answer === option.id)
                                .map(({ username }) => username);
                            return (
                                <section className='delay-50 transition ease-in-out hover:scale-110'>
                                    <ImageCard
                                        key={option.id}
                                        caption={option.name}
                                        imageUrl={option.thumbnail}
                                        onClick={() => onAnswerSubmit(option.id)}
                                        // on hover scale up the card
                                        className={`hover:cursor-pointer ${isCorrect ? "border-green-500" : ""}`}
                                    />
                                    <div className='flex flex-row justify-center items-center gap-2 pt-4'>
                                        {voters.map((voter, index) => {
                                            return (
                                                <Avatar key={index}>
                                                    <AvatarImage src="https://github.com/shadcn.png" alt={voter} />
                                                    <AvatarFallback>{getInitials(voter)}</AvatarFallback>
                                                </Avatar>
                                            )
                                        })}
                                    </div>
                                </section>
                            )
                        })}
                    </section>
                    {phase === "results" && hostId === socket.id &&
                        <section className='flex flex-col items-center justify-center'>
                            <Button
                                onClick={() => {
                                    setLoading(true);
                                    socket.emit("request_next_question", { roomCode: currentRoom });
                                }}
                                className='w-fit hover:cursor-pointer'
                            >
                                Next Question
                            </Button>
                        </section>

                    }
                </>
            }
        </>
    )
}