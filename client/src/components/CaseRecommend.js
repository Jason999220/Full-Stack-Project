import React, { useContext, useEffect, useState } from "react";
import "./caseRecommend.css";
import { GlobelDate } from "../App";
import { Link, useNavigate } from "react-router-dom";
import Case from "../axios/Case";
import Chat from "../axios/Chat";

function CaseRecommend(porps) {
  // 取得全域變數
  const { currentCaseId, setCurrentCaseId } = useContext(GlobelDate);

  // 從 props 結構賦值
  const { userEqual } = porps;

  // 跳轉介面
  const navigate = useNavigate();
  // 儲存推薦人員
  const [bridder, setBridder] = useState([]);
  // 儲存推薦人員
  const [recommendCases, setRecommendCases] = useState([]);

  // 取得推薦案件、推薦人員
  useEffect(() => {
    // 推薦案件
    Case.getSimilarCase(currentCaseId)
      .then((result) => {
        setRecommendCases(result["data"]);
        console.log(result["data"]);
      })
      .catch((err) => {
        console.error(err);
      });

    // 報價人員
    Case.getBidder(currentCaseId)
      .then((result) => {
        setBridder(result["data"]);
        console.log(result["data"]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [currentCaseId]);

  const handleChat = (item) => {
    console.log(item);
    // 取得與該對象聊天訊息
    Chat.getMessage(JSON.parse(localStorage.getItem("userID")), item.userID)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.error(err);
      });
    // 取得所有聊過天的使用者資訊
    Chat.getChatOtherUser(JSON.parse(localStorage.getItem("userID")))
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.error(err);
      });
    navigate("/", {});
  };

  const handleDrictCaseView = (caseID) => {
    setCurrentCaseId(caseID);
    navigate("/caseview");
  };
  return (
    <div className="recommend">
      <div className="recommend-tile">
        <h1>{userEqual ? "報價人員" : "為您推薦案子"}</h1>
      </div>
      <div className="recommend-content">
        {/* 三元表達式 假如【userEqual】為【True】就執行【:】前面，反之【userEqual】為【False】就執行【:】後面 */}
        {userEqual ? (
          // 以案主身分查看自己的提案 => 報價人員
          <>
            {bridder.length === 0 ? (
              <h1>尚未有人報價</h1>
            ) : (
              bridder.map((item, index) => (
                <div className="recommend-content-box" key={index}>
                  <div>
                    <p>{item.userName}</p>
                    <p>報價金額 : {item.quotation}</p>
                    <p>自我推薦 : </p>
                    <p className="selfRecommended">{item.selfRecommended}</p>
                  </div>
                  {/* 三個btn Link */}
                  <div>
                    <button className="recommend-content-box-btn">
                      {/* <Link to={`/chatRoom/${item.userID}`} >聊聊</Link> */}
                      <div onClick={() => handleChat(item)}>聊聊</div>
                    </button>
                    <button className="recommend-content-box-btn">
                      <Link
                        to="/checkInfo"
                        onClick={(e) => {
                          console.log(e.target); // 要將使用者ID傳過去才可以得到資訊
                        }}
                      >
                        查看資訊
                      </Link>
                    </button>
                    <button className="recommend-content-box-btn">
                      <Link to={`/scheme/${item.userID}`}>合作</Link>
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        ) : (
          // 以接案者身分查看案件 => 推薦案件
          <>
            {recommendCases ? (
              recommendCases.map((item) => (
                <div
                  className="recommend-content-box"
                  key={item["caseID"]}
                  onClick={() => handleDrictCaseView(item["caseID"])}
                >
                  <p>{item.caseName}</p>
                  <p>{item.budget}</p>
                  <p>{item.deadline}</p>
                  <p>
                    {item.city}
                    {item.district}
                  </p>
                </div>
              ))
            ) : (
              <h1>無相關案件</h1>
            )}
          </>
        )}
        {/* 渲染 recommendCases 內的案件，要使用<Link> */}
      </div>
    </div>
  );
}

export default CaseRecommend;
