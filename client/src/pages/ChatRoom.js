import "./chatRoom.css"
import React, { useState, useRef, useEffect } from "react"
import User from "../components/chatRoom_component/user/User"
import Message from "../components/chatRoom_component/message/Message"
import Chat from "../axios/Chat"
import { io } from "socket.io-client"

function ChatRoom() {
    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState(null);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [messageSend, setMessageSend] = useState([]);
    const [notification, setNotification] = useState([]);
    const [socket, setSocket] = useState(null);
    const scrollRef = useRef();
    const MessageRef = useRef(null);
    const currentUserID = JSON.parse(localStorage.getItem("userID"));

    console.log("notification", notification);

    // #region Socket.io
    // * Socket.io 連線
    useEffect(() => {
        const newSocket = io("http://localhost:4000");
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    }, [currentUserID]);

    // * 取得上線用戶
    useEffect(() => {
        if (socket === null) return;
        socket.emit("addUser", currentUserID);
        socket.on("getUsers", (users) => {
            setOnlineUsers(users);
        })
    }, [socket]);


    // * 取得對方傳來的訊息(透過socket.io)
    useEffect(() => {
        if (socket === null) return;
        socket.on("getMessage", data => {
            setArrivalMessage({
                fromID: data.senderId,
                message: data.text,
            })
        })

        socket.on("getNotification", data => {
            const isChatOpen = currentChat.userID === data.senderId;

            if (isChatOpen) {
                setNotification(prev => [{...data, isRead:true}, ...prev]);
            } else {
                setNotification(prev => [data, ...prev]);
            }
        })


        return () => {
            socket.off("getMessage");
            socket.off("getNotification");
        };
    }, [socket, currentChat]);
    // #endregion

    // 將從對方取得的訊息存到 messages 陣列中
    useEffect(() => {
        if (arrivalMessage && currentChat.userID === arrivalMessage.fromID) {
            setMessages((prev) => [...prev, arrivalMessage])
        }
    }, [arrivalMessage, currentChat]);

    // 畫面一掛載時，將當前使用者ID傳入，並取得其他已聊過的人員資訊
    useEffect(() => {
        Chat.getChatOtherUser(currentUserID)
            .then((res) => {
                setConversations(res['data']);
                console.log("getChatOtherUser", res['data']);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [currentUserID, messageSend]);

    // 得到兩人之間的歷史訊息
    useEffect(() => {
        if (currentChat !== null) {
            Chat.getMessage(currentUserID, currentChat.userID)
                .then((res) => {
                    setMessages(res['data']);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [currentChat]);

    // 按下 Send 傳送訊息
    const handleSubmit = (e) => {
        e.preventDefault();
        MessageRef.current.value = '';
        // 傳送訊息給對方(透過 socket.io server 端 -> )
        if (socket === null) return;
        socket.emit("sendMessage", {
            senderId: currentUserID,
            receiverId: currentChat.userID,
            text: newMessage,
        })

        Chat.sendMessage(currentUserID, currentChat.userID, newMessage, null)
            .then((res) => {
                console.log("sendMessage", res['data']);
                setMessages([...messages, res['data'][0]]);
                setMessageSend([...messageSend, res['data']])
            })
            .catch((err) => {
                console.error(err);
            });
    }

    // 訊息滾動至最新一筆
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    return (
        <div className="messenger">
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    {/* <input placeholder="Search for friends" className="chatMenuInput" /> */}
                    {conversations.map((c) => (
                        <div className="chatMenuUser" onClick={() => setCurrentChat(c)}>
                            <User user={c} online={onlineUsers.some((o) => c.userID === o.userId)} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="chatBox">
                <div className="chatBoxWrapper">
                    {currentChat ? (
                        <>
                            <div className="chatBoxTop">
                                {messages.map((m) => (
                                    <div ref={scrollRef}>
                                        <Message message={m} own={m.fromID === currentUserID} chatUser={currentChat} />
                                    </div>
                                ))}
                            </div>
                            <div className="chatBoxBottom">
                                <input
                                    ref={MessageRef}
                                    className="chatMessageInput"
                                    placeholder="write something..."
                                    onChange={(e) => setNewMessage(e.target.value)}
                                ></input>
                                <button className="chatSubmitButton" onClick={handleSubmit}>
                                    Send
                                </button>
                            </div>
                        </>
                    ) : (
                        <span className="noConversationText">
                            Open a conversation to start a chat.
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChatRoom;
