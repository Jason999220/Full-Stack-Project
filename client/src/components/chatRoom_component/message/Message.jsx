import { useContext } from "react";
import { GlobelDate } from "../../../App";
import "./message.css";
import {format} from "timeago.js"

export default function Message({ message, own, chatUser }) {
  const { headphoto } = useContext(GlobelDate);
  return (
    <div className={own ? "messageMain own" : "messageMain"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={
            own
              ? headphoto
              : chatUser.profilePhoto
              ? `data:image/jpeg;base64, ${chatUser.profilePhoto}`
              : "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg"
          }
          alt=""
        />
        <p className="messageText">{message.message}</p>
      </div>
      <div className="messageBottom">{format(message.messageTime, "zhTW")}</div>
    </div>
  );
}
