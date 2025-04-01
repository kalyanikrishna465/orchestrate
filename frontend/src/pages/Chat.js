import React, { useState, useEffect, useCallback, useRef } from "react";
import io from 'socket.io-client';
import Header from "../components/Header";
import Footer from "../components/Footer";

const socket = io('http://localhost:5000');  // Replace with your backend URL

const Chat = () => {
    const [messages, setMessages] = useState([
        { _id: "1", senderId: 2, text: "Have you got the project report pdf?", timestamp: new Date(Date.now() - 86400000) },
        { _id: "2", senderId: 1, text: "NO. I did not get it", timestamp: new Date(Date.now() - 86400000) },
        { _id: "3", senderId: 2, text: "Ok, I will just sent it here. Plz be sure to fill the details by today end of the day.", timestamp: new Date() },
        { _id: "4", senderId: 2, text: "project_report.pdf", isFile: true, fileType: "pdf", timestamp: new Date() },
        { _id: "5", senderId: 1, text: "Ok. Should I send it over email as well after filling the details.", timestamp: new Date() },
        { _id: "6", senderId: 2, text: "Ya. I'll be adding more team members to it.", timestamp: new Date() },
        { _id: "7", senderId: 1, text: "OK", timestamp: new Date() },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [user] = useState({ id: 1, name: "Kalyani Krishna", role: "Senior Developer" });
    const [selectedChat, setSelectedChat] = useState({
        id: "1",
        name: "Harshita Anand",
        role: "Junior Developer",
        status: "online",
        userId: 2,
        type: "private",
    });
    const [chats, setChats] = useState([
        { id: "1", name: "Harshita Anand", role: "Junior Developer", status: "online", userId: 2, type: "private", lastMessage: "Ya. I'll be adding more team members to it.", unread: 0, time: "10:35 AM" },
        { id: "2", name: "Suraj Manivannan", role: "Designer", status: "offline", userId: 3, type: "private", lastMessage: "Hi, are you Available Tomorrow?", unread: 1, time: "10:35 AM" },
        { id: "3", name: "Sadanand Venkataraman", role: "Project Manager", status: "offline", userId: 4, type: "private", lastMessage: "Nice One! Will Do it tomorrow", unread: 2, time: "10:35 AM" },
        { id: "4", name: "MSR Varshadh", role: "Backend Developer", status: "offline", userId: 5, type: "private", lastMessage: "That's Great. I am Looking forward to having a great start.", unread: 0, time: "10:35 AM" },
        { id: "5", name: "Shriya Santhosh", role: "UI/UX Designer", status: "offline", userId: 6, type: "private", lastMessage: "Hi, will you start working on the chat app right now?", unread: 0, time: "10:35 AM" },
        { id: "6", name: "Gaurav Krishna", role: "Product Owner", status: "offline", userId: 7, type: "private", lastMessage: "See you tomorrow champ", unread: 0, time: "10:26 AM" },
        { id: "7", name: "Pramika S", role: "QA Engineer", status: "offline", userId: 8, type: "private", lastMessage: "Hi", unread: 1, time: "10:26 AM" },
    ]);
    
    const messageListRef = useRef(null);
    
    useEffect(() => {
        // Scroll to bottom of messages
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });

        socket.on('newMessage', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        socket.on('messagePrioritized', (message) => {
            setMessages(prevMessages =>
                prevMessages.map(msg => (msg._id === message._id ? message : msg))
            );
        });

        socket.on('userTagged', (message) => {
            setMessages(prevMessages =>
                prevMessages.map(msg => (msg._id === message._id ? message : msg))
            );
        });

        socket.on('meetingScheduled', (chat) => {
            console.log('Meeting scheduled:', chat);
        });

        return () => {
            socket.off('connect');
            socket.off('newMessage');
            socket.off('messagePrioritized');
            socket.off('userTagged');
            socket.off('meetingScheduled');
        };
    }, []);

    const fetchMessages = useCallback(async () => {
        if (selectedChat) {
            socket.emit('joinChat', selectedChat.id);  // Join the chat room
        }
    }, [selectedChat]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const sendMessage = () => {
        if (newMessage.trim() === "") return;

        const message = {
            _id: String(messages.length + 1),
            senderId: user.id,
            text: newMessage,
            chatId: selectedChat.id,
            timestamp: new Date(),
            priority: 'normal'
        };

        setMessages([...messages, message]);
        socket.emit('sendMessage', message);
        setNewMessage("");
    };

    const handleChatSelect = (chat) => {
        setSelectedChat(chat);
    };

    const formatDate = (date) => {
        const today = new Date();
        const messageDate = new Date(date);
        
        if (today.toDateString() === messageDate.toDateString()) {
            return "Today";
        } else if (new Date(today.setDate(today.getDate() - 1)).toDateString() === messageDate.toDateString()) {
            return "Yesterday";
        } else {
            return messageDate.toLocaleDateString();
        }
    };

    const groupMessagesByDate = () => {
        const groups = {};
        
        messages.forEach(message => {
            const dateStr = formatDate(message.timestamp);
            if (!groups[dateStr]) {
                groups[dateStr] = [];
            }
            groups[dateStr].push(message);
        });
        
        return groups;
    };

    const renderFileMessage = (message) => {
        const fileIcon = () => {
            switch (message.fileType) {
                case 'pdf':
                    return "📄";
                case 'image':
                    return "🖼️";
                case 'video':
                    return "🎥";
                default:
                    return "📎";
            }
        };
        
        return (
            <div className="file-message">
                {fileIcon()} {message.text}
            </div>
        );
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const groupedMessages = groupMessagesByDate();

    return (
        <>
            <Header />
            <div style={styles.container}>
                <div style={styles.chatWindow}>
                    {/* Left Sidebar */}
                    <div style={styles.leftSidebar}>
                        <div style={styles.currentUser}>
                            <div style={styles.userAvatar}>
                                {user.name.charAt(0)}
                            </div>
                            <div style={styles.userInfo}>
                                <div style={styles.userName}>{user.name}</div>
                                <div style={styles.userRole}>{user.role}</div>
                            </div>
                            <div style={styles.editIcon}>✏️</div>
                        </div>
                        <div style={styles.searchContainer}>
                            
                            <input
                                type="text"
                                style={styles.searchInput}
                                placeholder="Search Here..."
                            />
                        </div>
                        <div style={styles.chatList}>
                            {chats.map((chat) => (
                                <div
                                    key={chat.id}
                                    style={{
                                        ...styles.chatItem,
                                        ...(selectedChat.id === chat.id ? styles.selectedChatItem : {}),
                                    }}
                                    onClick={() => handleChatSelect(chat)}
                                >
                                    <div style={styles.chatAvatar}>
                                        {chat.name.charAt(0)}
                                    </div>
                                    <div style={styles.chatInfo}>
                                        <div style={styles.chatName}>
                                            {chat.name}
                                            <span style={styles.chatTime}>{chat.time}</span>
                                        </div>
                                        <div style={styles.chatLastMessage}>
                                            {chat.lastMessage}
                                            {chat.unread > 0 && (
                                                <span style={styles.unreadBadge}>{chat.unread}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Chat Area */}
                    <div style={styles.mainChatArea}>
                        {/* Chat Header */}
                        <div style={styles.chatHeader}>
                            <div style={styles.chatHeaderLeft}>
                                <div style={styles.selectedChatAvatar}>
                                    {selectedChat.name.charAt(0)}
                                </div>
                                <div style={styles.selectedChatInfo}>
                                    <div style={styles.selectedChatName}>
                                        {selectedChat.name}
                                        <span style={{
                                            ...styles.statusIndicator,
                                            backgroundColor: selectedChat.status === 'online' ? '#4CD964' : '#ccc'
                                        }}></span>
                                    </div>
                                </div>
                            </div>
                            <div style={styles.chatHeaderRight}>
                                <div style={styles.headerIcon}>🔍</div>
                                <div style={styles.headerIcon}>❤️</div>
                                <div style={styles.headerIcon}>🔔</div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div style={styles.messagesArea} ref={messageListRef}>
                            {Object.entries(groupedMessages).map(([date, msgs]) => (
                                <div key={date}>
                                    <div style={styles.dateHeader}>
                                        <div style={styles.dateHeaderLine}></div>
                                        <div style={styles.dateHeaderText}>{date}</div>
                                        <div style={styles.dateHeaderLine}></div>
                                    </div>
                                    {msgs.map((message) => (
                                        <div
                                            key={message._id}
                                            style={{
                                                ...styles.messageContainer,
                                                ...(message.senderId === user.id ? styles.sentMessageContainer : styles.receivedMessageContainer),
                                            }}
                                        >
                                            <div style={styles.messageAvatarContainer}>
                                                {message.senderId !== user.id && (
                                                    <div style={styles.messageAvatar}>
                                                        {selectedChat.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    ...styles.message,
                                                    ...(message.senderId === user.id ? styles.sentMessage : styles.receivedMessage),
                                                }}
                                            >
                                                {message.isFile ? renderFileMessage(message) : message.text}
                                            </div>
                                            <div style={styles.messageAvatarContainer}>
                                                {message.senderId === user.id && (
                                                    <div style={styles.messageAvatar}>
                                                        {user.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div style={styles.inputArea}>
                            <div style={styles.attachmentContainer}>
                                <div style={styles.attachmentIcon}>📎</div>
                                <div style={styles.attachmentIcon}>📷</div>
                                <div style={styles.attachmentIcon}>🎞️</div>
                                <div style={styles.attachmentIcon}>💻</div>
                                <div style={styles.attachmentIcon}>📁</div>
                                <div style={styles.attachmentIcon}>🎙️</div>
                            </div>
                            <div style={styles.inputContainer}>
                                <input
                                    type="text"
                                    style={styles.messageInput}
                                    placeholder="Type a message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                <button style={styles.sendButton} onClick={sendMessage}>
                                    🚀
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div style={styles.rightSidebar}>
                        <div style={styles.searchContainer}>
                            <input
                                type="text"
                                style={styles.searchInput}
                                placeholder="Search Here..."
                            />
                        </div>
                        
                        <div style={styles.profileSection}>
                            <div style={styles.profileAvatar}>
                                {selectedChat.name.charAt(0)}
                            </div>
                            <div style={styles.profileName}>{selectedChat.name}</div>
                            <div style={styles.profileRole}>{selectedChat.role}</div>
                            
                            <div style={styles.profileActions}>
                                <div style={styles.actionButton}>
                                    <div style={styles.actionIcon}>💬</div>
                                    <div style={styles.actionText}>Chat</div>
                                </div>
                                <div style={styles.actionButton}>
                                    <div style={styles.actionIcon}>📹</div>
                                    <div style={styles.actionText}>Video Call</div>
                                </div>
                            </div>
                            
                            <div style={styles.profileOptions}>
                                <div style={styles.profileOption}>
                                    <div style={styles.optionIcon}>👥</div>
                                    <div style={styles.optionText}>View Friends</div>
                                </div>
                                <div style={styles.profileOption}>
                                    <div style={styles.optionIcon}>❤️</div>
                                    <div style={styles.optionText}>Add to Favorites</div>
                                </div>
                            </div>
                            
                            <div style={styles.attachmentsSection}>
                                <div style={styles.sectionTitle}>Attachments</div>
                                <div style={styles.attachmentTypes}>
                                    <div style={styles.attachmentType}>
                                        <div style={styles.attachmentTypeIcon}>📄</div>
                                        <div style={styles.attachmentTypeName}>PDF</div>
                                    </div>
                                    <div style={styles.attachmentType}>
                                        <div style={styles.attachmentTypeIcon}>🎬</div>
                                        <div style={styles.attachmentTypeName}>VIDEO</div>
                                    </div>
                                    <div style={styles.attachmentType}>
                                        <div style={styles.attachmentTypeIcon}>🎵</div>
                                        <div style={styles.attachmentTypeName}>MP3</div>
                                    </div>
                                    <div style={styles.attachmentType}>
                                        <div style={styles.attachmentTypeIcon}>🖼️</div>
                                        <div style={styles.attachmentTypeName}>IMAGE</div>
                                    </div>
                                </div>
                                <button style={styles.viewAllButton}>View All</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

const styles = {
    container: {
        textAlign: "center",
        padding: "0px",
        backgroundColor: "#4E7A59",
        minHeight: "calc(100vh - 120px)", // Adjust based on your header/footer heights
        color: "#F2F6EB",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom:"10px",
        marginTop:"20px"
    },
    chatWindow: {
        display: "flex",
        width: "100%",
        height: "calc(100vh - 120px)", // Adjust based on your header/footer heights
        backgroundColor: "white",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        
    },
    leftSidebar: {
        width: "25%",
        height: "100%",
        borderRight: "1px solid #E5E5E5",
        backgroundColor: "#F4F5F7",
        display: "flex",
        flexDirection: "column",
    },
    mainChatArea: {
        width: "50%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
    },
    rightSidebar: {
        width: "25%",
        height: "100%",
        borderLeft: "1px solid #E5E5E5",
        backgroundColor: "#F4F5F7",
        display: "flex",
        flexDirection: "column",
        padding: "15px",
    },
    currentUser: {
        display: "flex",
        alignItems: "center",
        padding: "15px",
        borderBottom: "1px solid #E5E5E5",
    },
    userAvatar: {
        width: "40px",
        height: "40px",
        backgroundColor: "#3a856c",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        marginRight: "10px",
    },
    userInfo: {
        flex: 1,
        textAlign: "left",
    },
    userName: {
        fontWeight: "bold",
        color: "#333",
    },
    userRole: {
        fontSize: "12px",
        color: "#666",
    },
    editIcon: {
        cursor: "pointer",
    },
    searchContainer: {
        position: "static",
        padding: "5px 5px",
        borderBottom: "1px solid #E5E5E5",
    },
    searchIcon: {
        position: "relative",
        left: "25px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#999",
        fontSize: "14px",
    },
    searchInput: {
        width: "100%",
        padding: "10px 10px 10px 30px",
        borderRadius: "20px",
        border: "1px solid #E5E5E5",
        outline: "none",
        fontSize: "14px",
    },
    chatList: {
        flex: 1,
        overflowY: "auto",
    },
    chatItem: {
        display: "flex",
        padding: "15px",
        borderBottom: "1px solid #E5E5E5",
        cursor: "pointer",
        transition: "background-color 0.2s",
        '&:hover': {
            backgroundColor: "#F0F0F0",
        }
    },
    selectedChatItem: {
        backgroundColor: "#E6EFF9",
    },
    chatAvatar: {
        width: "40px",
        height: "40px",
        backgroundColor: "#3a856c",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        marginRight: "10px",
    },
    chatInfo: {
        flex: 1,
        textAlign: "left",
    },
    chatName: {
        display: "flex",
        justifyContent: "space-between",
        fontWeight: "500",
        color: "#333",
    },
    chatTime: {
        fontSize: "12px",
        color: "#999",
    },
    chatLastMessage: {
        fontSize: "13px",
        color: "#666",
        display: "flex",
        justifyContent: "space-between",
        marginTop: "3px",
    },
    unreadBadge: {
        backgroundColor: "#3a856c",
        color: "white",
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "12px",
    },
    chatHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px",
        borderBottom: "1px solid #E5E5E5",
        backgroundColor: "#F9F9F9",
    },
    chatHeaderLeft: {
        display: "flex",
        alignItems: "center",
    },
    chatHeaderRight: {
        display: "flex",
    },
    selectedChatAvatar: {
        width: "40px",
        height: "40px",
        backgroundColor: "#3a856c",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        marginRight: "10px",
    },
    selectedChatInfo: {
        textAlign: "left",
    },
    selectedChatName: {
        fontWeight: "500",
        color: "#333",
        display: "flex",
        alignItems: "center",
    },
    statusIndicator: {
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        marginLeft: "10px",
    },
    headerIcon: {
        margin: "0 5px",
        cursor: "pointer",
    },
    messagesArea: {
        flex: 1,
        padding: "15px",
        overflowY: "auto",
        backgroundColor: "#F5F7FB",
    },
    dateHeader: {
        display: "flex",
        alignItems: "center",
        margin: "20px 0",
    },
    dateHeaderLine: {
        flex: 1,
        height: "1px",
        backgroundColor: "#E5E5E5",
    },
    dateHeaderText: {
        margin: "0 10px",
        fontSize: "12px",
        color: "#999",
    },
    messageContainer: {
        display: "flex",
        marginBottom: "15px",
        alignItems: "flex-start",
    },
    sentMessageContainer: {
        justifyContent: "flex-end",
    },
    receivedMessageContainer: {
        justifyContent: "flex-start",
    },
    messageAvatarContainer: {
        width: "30px",
        marginTop: "5px",
    },
    messageAvatar: {
        width: "28px",
        height: "28px",
        backgroundColor: "#3a856c",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: "12px",
    },
    message: {
        maxWidth: "70%",
        padding: "10px 15px",
        borderRadius: "18px",
        fontSize: "14px",
    },
    sentMessage: {
        backgroundColor: "#3a856c",
        color: "white",
        borderBottomRightRadius: "5px",
    },
    receivedMessage: {
        backgroundColor: "#E6EFF9",
        color: "#333",
        borderBottomLeftRadius: "5px",
    },
    inputArea: {
        padding: "15px",
        borderTop: "1px solid #E5E5E5",
    },
    attachmentContainer: {
        display: "flex",
        justifyContent: "space-between",
        padding: "0 50px",
        marginBottom: "10px",
    },
    attachmentIcon: {
        cursor: "pointer",
        fontSize: "18px",
    },
    inputContainer: {
        display: "flex",
        alignItems: "center",
    },
    messageInput: {
        flex: 1,
        padding: "12px 15px",
        borderRadius: "25px",
        border: "1px solid #E5E5E5",
        outline: "none",
        fontSize: "14px",
    },
    sendButton: {
        backgroundColor: "#3a856c",
        color: "white",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "none",
        cursor: "pointer",
        marginLeft: "10px",
        fontSize: "18px",
    },
    profileSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px 0",
    },
    profileAvatar: {
        width: "80px",
        height: "80px",
        backgroundColor: "#3a856c",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: "30px",
        marginBottom: "15px",
    },
    profileName: {
        fontWeight: "bold",
        fontSize: "18px",
        color: "#333",
    },
    profileRole: {
        fontSize: "14px",
        color: "#666",
        marginBottom: "20px",
    },
    profileActions: {
        display: "flex",
        justifyContent: "center",
        width: "100%",
        marginBottom: "20px",
    },
    actionButton: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0 15px",
        cursor: "pointer",
    },
    actionIcon: {
        backgroundColor: "#E6EFF9",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "5px",
        fontSize: "20px",
    },
    actionText: {
        fontSize: "12px",
        color: "#666",
    },
    profileOptions: {
        width: "100%",
        borderTop: "1px solid #E5E5E5",
        borderBottom: "1px solid #E5E5E5",
        padding: "15px 0",
        marginBottom: "20px",
    },
    profileOption: {
        display: "flex",
        alignItems: "center",
        padding: "10px 0",
        cursor: "pointer",
    },
    optionIcon: {
        marginRight: "10px",
        fontSize: "16px",
    },
    optionText: {
        fontSize: "14px",
        color: "#333",
    },
    attachmentsSection: {
        width: "100%",
    },
    sectionTitle: {
        fontSize: "16px",
        fontWeight: "500",
        color: "#333",
        marginBottom: "15px",
        textAlign: "left",
    },
    attachmentTypes: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: "15px",
    },
    attachmentType: {
        width: "48%",
        backgroundColor: "#F0F0F0",
        borderRadius: "8px",
        padding: "10px",
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
        cursor: "pointer",
    },
    attachmentTypeIcon: {
        marginRight: "10px",
        fontSize: "20px",
    },
    attachmentTypeName: {
        fontSize: "12px",
        color: "#666",
    },
    viewAllButton: {
        width: "100%",
        padding: "10px",
        borderRadius: "20px",
        border: "1px solid #3a856c",
        backgroundColor: "transparent",
        color: "#3a856c",
        cursor: "pointer",
        fontWeight: "500",
    },
    // File message styling
    fileMessage: {
        display: "flex",
        alignItems: "center",
        fontSize: "14px",
    },
};

export default Chat;