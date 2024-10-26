import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Messanger from 'Components/OtherComponents/Messanger';
import EmojiPicker from 'emoji-picker-react';
import { doc, setDoc, getDocs, collection, serverTimestamp, query, orderBy } from "firebase/firestore";
import { fireStore } from 'Config/firebase';
import userImg from "../../Assets/user.png";
import ChatLoader from 'Components/OtherComponents/ChatLoader';

export default function Clan() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [currentUser, setCurrentUser] = useState();
    const [showPicker, setShowPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Create a ref to the chat container
    const chatEndRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            let array = [];
            setIsLoading(true);

            const chatsQuery = query(collection(fireStore, "Chats"), orderBy("createdAt", "asc"));

            try {
                const querySnapshot = await getDocs(chatsQuery);
                querySnapshot.forEach((doc) => {
                    let data = doc.data();
                    array.push(data);
                });
                setChat(array);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
        setCurrentUser(JSON.parse(localStorage.getItem("user")));
    }, []);

    useEffect(() => {
        // Scroll to the bottom whenever chat changes
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chat]);

    const handleMessage = async () => {
        if(!message){
            return 
        }
        let msgId = Math.floor(10000000 + Math.random() * 90000000).toString();
        let newMessage = {
            message,
            sender: currentUser.userId,
            senderImage: currentUser.imageUrl || "",
            senderName: currentUser.username,
            msgId,
            createdAt: serverTimestamp()
        };
        setChat([
            ...chat,
            newMessage
        ]);
        setMessage("");
        try {
            await setDoc(doc(fireStore, "Chats", msgId), newMessage);
        } catch (error) {
            console.log("error", error);
        }
    };

    const onEmojiClick = (emojiData) => {
        setMessage((prevText) => prevText + emojiData.emoji);
        setShowPicker(false);
    };

    return (
        <main id='clan'>
            <Link to="/">
                <svg
                    viewBox="0 0 512 512"
                    fill="currentColor"
                    height="30px"
                    width="30px"
                    style={{ color: "#00b4d8", margin: "38px 0px 0px 28px" }}
                >
                    <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={48}
                        d="M244 400L100 256l144-144M120 256h292"
                    />
                </svg>
            </Link>
            <h1 className="text-center mb-2 mt-3 fw-bolder">Postify Clan</h1>

            {isLoading ? (
                <div className='loader-container'>
                    <ChatLoader margin="me-3 ms" />
                    <ChatLoader margin="ms-3 me" />
                </div>
            ) : (
                <div className="container" style={{"paddingBottom":"80px"}} >
                    <div className="row">
                        <div className="col">
                            {chat.map((message, i) => {
                                const margin = message.sender === currentUser.userId ? "ms-auto" : "me-auto";
                                const bgColor = message.sender === currentUser.userId ? "#00b4d8" : "white";
                                const color = message.sender === currentUser.userId ? "light" : "dark";
                                const user = message.sender === currentUser.userId;
                                return (
                                    <div className="message-container" key={i}>
                                        {!user && (
                                            <img
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    borderRadius: "50%",
                                                    marginRight: "10px"
                                                }}
                                                src={message.senderImage || userImg}
                                                alt=""
                                            />
                                        )}
                                        <div className={`message-box ${margin} text-${color}`} style={{ background: bgColor }}>
                                            {!user && (
                                                <b style={{ fontSize: "10px", color: "#00b4d8" }}>
                                                    {message.senderName}
                                                </b>
                                            )}
                                            <p className='m-0'>{message.message}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            {/* Reference element for auto-scrolling */}
                            <div ref={chatEndRef} />
                        </div>
                    </div>
                </div>
            )}

            <Messanger
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onEmoji={() => setShowPicker((val) => !val)}
                onClick={handleMessage}
            />
            {showPicker && (
                <div style={{ position: "fixed", bottom: "89px", left: "20px" }}>
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
            )}
        </main>
    );
}
