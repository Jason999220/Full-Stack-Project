import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Home from "./pages/Home";
import Proposal from "./pages/Proposal";
import AllCase from "./pages/AllCase";
import CaseView from "./pages/CaseView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PersonalInfo from "./pages/PersonalInfo";
import React, { useEffect, useState } from "react";
import ChatRoom from "./pages/ChatRoom";
import Scheme from "./pages/Scheme";
import CheckInfo from "./pages/CheckInfo";
import socket from "./socket";
import Auth from "./axios/Auth";
import Ecpay from "./pages/Ecpay";

localStorage.setItem("text", "hello");

// create useContext => 使跨組件的資料可以傳遞
export const GlobelDate = React.createContext({});

function App() {
  const navigate = useNavigate();
  // chat --- start
//   const [usersList, addUsers] = useState([]);
//   // When the user is login fetched_userName from Login.js with submit
//   const getUsername = (fetched_userName) => {
//     setUserName(fetched_userName);
//     socket.auth = { fetched_userName };
//     socket.connect(); // 丟回 server line 30
//   };

//   const initReactiveProperties = (user) => {
//     user.connected = true;
//     user.hasNewMessages = false;
//   };

//   socket.on("other user connect", (user) => {
//     initReactiveProperties(user);
//     addUsers([...usersList, user]);
//   });

//   // 更新 user.self 狀態
//   socket.on("users", (users) => {
//     users.forEach((user) => {
//       // 透過該網頁的 socket.id 與 userID 判斷是否為本人
//       user.self = user.userID === socket.id;
//       initReactiveProperties(user);
//     });
//     addUsers(users);
//   });

//   socket.on("user disconnected", (user) => {
//     for (let i = 0; i < usersList.length; i++) {
//       const userInList = usersList[i];
//       if (userInList.username === user.username) {
//         usersList[i].connected = false;
//         break;
//       }
//     }
//   });
  // chat --- end

  // 給註冊登入使用
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userHashPassword, setUserHashPassword] = useState("");

  //個人資料
  const [changeheadphoto, setChangeHeadPhoto] = useState({});

  const [infoData, setInfoData] = useState("1");

  const [proposal, setProposal] = useState("1");

  const [takethecase, setTakethecase] = useState("1");

  const [headphoto, setHeadPhoto] = useState("");
  const [name, setName] = useState("");
  const [usernumber, setUserNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("");
  const [portfolio, setPortfolio] = useState([]);
  const [tools, setTools] = useState("");
  const [autobiography, setAutobiography] = useState("");

  //登入後的userID
  const [userID, setUserID] = useState("");

  // 當前被點擊的案件ID => 【allCase】取得，【caseView】需要
  const [currentCaseId, setCurrentCaseId] = useState("");

  //裡面要存Storage的Key=userInfo
  const [userinfo, setUserInfo] = useState("");

  // 存取綠界返回的原始碼 => 【UserInfo】 取得 ，【Ecpay】渲染
  const [ecpayHtml, setEcpayHtml] = useState("");

  useEffect(() => {
    //進入前，先比對token
    Auth.checkToken(
      localStorage.getItem("userInfo"),
      localStorage.getItem("userID")
    )
      .then((result) => {
        console.log(result);
        if (result["data"] === "請重新登入") {
          //登出後把storage的userinfo改成result
          localStorage.setItem("userInfo", JSON.stringify(""));
          //把空字串傳入setUserInfo
          setUserInfo(JSON.parse(localStorage.getItem("")));
          alert("請重新登入");
          navigate("/");
        } else if (result["data"] === "未登入") {
          localStorage.setItem("userInfo", JSON.stringify(""));
          //把空字串傳入setUserInfo
          setUserInfo(JSON.parse(localStorage.getItem("")));
          alert("請重新登入");
          navigate("/");
        }
      })
      .catch((err) => {
        console.error(err);
      });
    if (localStorage.getItem("userInfo")) {
      Auth.enterProfile(
        localStorage
          .getItem("userInfo")
          .substring(1, localStorage.getItem("userInfo").length - 1)
      )
        .then((result) => {
          setName(result["data"]["message"][0]["userName"]);
          setUserNumber(result["data"]["message"][0]["email"]);
          setPhone(result["data"]["message"][0]["phone"]);
          setExperience(result["data"]["message"][0]["education"]);
          setPortfolio(result["data"]["message"][0]["portfolio"]);
          setTools(result["data"]["message"][0]["softwore"]);
          setAutobiography(result["data"]["message"][0]["selfIntroduction"]);
          setHeadPhoto(
            `data:image/jpeg;base64, ${result["data"]["message"][0]["profilePhoto"]}`
          );
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  return (
    <>
      {/* 提供 GlobelDate 內的所有資料給被包含的所有組件 */}
      <GlobelDate.Provider
        value={{
          usernumber,
          setUserNumber,
          phone,
          setPhone,
          experience,
          setExperience,
          portfolio,
          setPortfolio,
          tools,
          setTools,
          autobiography,
          setAutobiography,
          headphoto,
          setHeadPhoto,
          name,
          setName,
          infoData, //我的帳戶目前位置
          setInfoData,
          proposal, //提案紀錄目前位置
          setProposal,
          takethecase, //接案紀錄目前位置
          setTakethecase,
          setUserName,
          setUserEmail,
          setUserPassword,
          setUserHashPassword,
          userName,
          userEmail,
          userPassword,
          userHashPassword,
          changeheadphoto,
          setChangeHeadPhoto,
          userinfo,
          setUserInfo,
          userID,
          setUserID,
          currentCaseId,
          setCurrentCaseId,
          ecpayHtml,
          setEcpayHtml,
        }}
      >
        <Header />
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/PersonalInfo"} element={<PersonalInfo />} />
          <Route path={"/register"} element={<Register />} />
          <Route path={"/proposal"} element={<Proposal />} />
          <Route path={"/allCase"} element={<AllCase />} />
          <Route path={"/CaseView/:caseID"} element={<CaseView />} />
          <Route path={"/chatRoom"} element={<ChatRoom />} />
          <Route path={"/Scheme/:bidderID"} element={<Scheme />} />
          <Route path={"/checkInfo"} element={<CheckInfo />} />
          <Route path={"/Ecpay"} element={<Ecpay />} />
          <Route
            path={"/ChatRoom/:chatid"}
            element={<ChatRoom />}
          />
        </Routes>
        <Footer />
      </GlobelDate.Provider>
    </>
  );
}

export default App;
