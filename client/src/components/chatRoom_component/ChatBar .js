import React from "react";

const ChatBar = (props) => {
  const { connectedUsers, selectUser, allUser } = props; // 從 ChatRoom 得到的資訊
  // const userList = props.connectedUsers; // 上線 ，直接用 connectedUsers 為甚麼還要用 userList？

  // console.log("In sidebar userlist:", userList);

  let selectedUser = "";

  // 取得被點擊人的info
  const userName_from_click = (e) => {
    selectedUser = e.target.innerText;
    let selectedUserDetails = connectedUsers.find(
      (user) => user.username === selectedUser
    );
    console.log("In sidebar the user details:", selectedUserDetails);
    props.selectUser(selectedUserDetails); // 被點擊【聊聊】的使用者 info
  };

  // 秀出其他連線的使用者
  let showUsers = connectedUsers.map((user) => {
    if (!user.self) {
      return (
        <>
          {allUser &&
            allUser.map((item) => (
              <div key={item.userID}>
                <div
                  key={user.key}
                  className="chat__users"
                  onClick={(e) => userName_from_click(e)}
                >
                  {item.userName}
                </div>
                <div>{user.connected ? "online" : "offline"}</div>
                {user.hasNewMessages ? "!" : ""}
              </div>
            ))}
        </>
      );
    }
  });

  return (
    <div className="chat__sidebar">
      <h2>Open Chat</h2>
      <div>
        <h4 className="chat__header">ACTIVE USERS</h4>
        <div>{showUsers}</div>
        {/* 顯示所有使用者 DB get */}
      </div>
    </div>
  );
};

export default ChatBar;
