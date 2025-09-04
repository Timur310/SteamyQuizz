import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { socket } from "../../Socket";
import { ButtonGroup } from "../ButtonGroup/ButtonGroup";

export const LandingPage = () => {
    const [username, setUsername] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const [selectedAction, setSelectedAction] = useState<0 | 1>(0);

    useEffect(() => {
        socket.on("error_joining", ({ message }) => {
            toast.info(message)
        });
    }, [])

    const createRoom = () => {
        if (!username) {
            toast.info("Enter your name")
            return;
        }
        socket.emit("create_room", username);
    };

    const joinRoom = () => {
        if (!username || !roomCode) {
            toast.info("Enter name and room code")
            return;
        }
        socket.emit("join_room", { username, roomCode });
    };

    const handleClick = () => {
        selectedAction === 0 ? joinRoom() : createRoom()
    }

    return (
        <main className="relative w-screen flex flex-col items-center justify-center h-screen font-quicksand">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Game lobby</CardTitle>
                    <CardDescription>
                        Create or join to start playing with friends
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Input type="text" placeholder="Username" className="placeholder:text-black text-black" onChange={(e) => setUsername(e.target.value)} required />
                            <ButtonGroup>
                                <Button onClick={() => setSelectedAction(1)} className={`w-full cursor-pointer ${selectedAction === 1 ? "" : ""}`} variant="reverse">Create room</Button>
                                <Button onClick={() => setSelectedAction(0)} className="w-full cursor-pointer" variant="reverse">Join room</Button>
                            </ButtonGroup>
                        </div>
                        {selectedAction === 0 && (
                            <div className="grid gap-2">
                                <Input
                                    id="room-code"
                                    type="text"
                                    placeholder="Enter room code"
                                    value={roomCode}
                                    onChange={(e) => setRoomCode(e.target.value)}
                                    required
                                    className="placeholder:text-black text-black"
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button onClick={handleClick} className="w-full cursor-pointer">{selectedAction === 0 ? "Join Room" : "Create Room"}</Button>
                </CardFooter>
            </Card>
            <footer className="text-sm px-4 py-6 mt-10">
                <div className="max-w-screen mx-auto text-center space-y-2">
                    <p>
                        This game is not affiliated with Valve Corporation or Steam. All game titles, images, descriptions, and reviews are property of their respective owners and are used for educational or entertainment purposes under fair use.
                    </p>
                    <p>
                        Steam and the Steam logo are trademarks and/or registered trademarks of Valve Corporation in the U.S. and/or other countries.
                    </p>
                </div>
            </footer>
        </main>
    )
}