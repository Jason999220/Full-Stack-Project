const app = require("express")();
const http = require("http").Server(app);
const PORT = 4000;

// CORS
const io = require("socket.io")(http, {
    cors: {
        origin: "http://localhost:3000",
    },
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find(user => user.userId === userId);
}

io.on("connection", (socket) => {
    // when connect
    console.log(`a ${socket.id} connected.`);

    // get userID & socketID from user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    })

    // when send message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        if(user) {
            // 
            io.to(user.socketId).emit("getMessage", {
                senderId,
                text,
            });
            // 
            io.to(user.socketId).emit("getNotification", {
                senderId: senderId,
                isRead: false,
            });
        }
    });

    // when disconnect
    socket.on("disconnect", (userId) => {
        console.log(`a ${socket.id} disconnected!`);
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
