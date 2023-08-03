import "./user.css";

export default function User({ user, online }) {

  return (
    <div className="user">
      <img
        className="userImg"
        src={user.profilePhoto? `data:image/jpeg;base64, ${user.profilePhoto}` : "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"}
        alt=""
      />
      <div className={online ? "userStatus online" : "userStatus"}></div>
      <span className="userName">{user.userName}</span>
    </div>
  );
}
