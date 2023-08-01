// 接案者點進案子後的介面
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./caseView.css";
import CaseContent from "../components/CaseContent";
import UserInfo from "../components/UserInfo";
import CaseRecommend from "../components/CaseRecommend";
import Case from "../axios/Case";

function CaseView() {
  // 從網址取得參數
  const { caseID } = useParams();

  // 案件資訊
  const [classID, setClassID] = useState("");
  const [caseName, setCaseName] = useState("");
  const [budget, setBudget] = useState(0);
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [caseState, setCaseState] = useState("");
  const [contactName, setContactName] = useState("");
  const [files, setFiles] = useState([]);
  const [bulidCaseUserID, setBulidCaseUserID] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState("");

  // 目前使用者id === 建案子的使用者id
  const userEqual =
    JSON.parse(localStorage.getItem("userID")) === bulidCaseUserID;

  // 取得當前使用者ID與被點擊的案件ID並渲染出案件
  // 先 caseID，userID
  useEffect(() => {
    Case.getCaseInfo(caseID, JSON.parse(localStorage.getItem("userID")))
      .then((result) => {
        console.log(result["data"][0]);
        setClassID(result["data"][0]["classID"]);
        localStorage.setItem(
          "classID",
          JSON.stringify(result["data"][0]["classID"])
        );
        setCaseName(result["data"][0]["caseName"]);
        setBudget(result["data"][0]["budget"]);
        setDeadline(result["data"][0]["deadline"]);
        setDescription(result["data"][0]["description"]);
        setCity(result["data"][0]["city"]);
        setDistrict(result["data"][0]["district"]);
        setCaseState(result["data"][0]["result"]);
        setContactName(result["data"][0]["contactName"]);
        setFiles(result["data"][0]["image"]);
        setBulidCaseUserID(result["data"][0]["userID"]);
        setProfilePhoto(result["data"][0]["profilePhoto"]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <main>
      <div className="container">
        <div className="d-flex caseView">
          {/* 案件內容區域 */}
          <CaseContent
            budget={budget}
            caseName={caseName}
            deadline={deadline}
            description={description}
            city={city}
            district={district}
            files={files}
          />
          {/* 案主資訊 && 報價區域 */}
          <UserInfo
            profilePhoto={profilePhoto}
            budget={budget}
            contactName={contactName}
            caseState={caseState}
            userEqual={userEqual}
          />
        </div>
        {/* 為您推薦 */}
        <CaseRecommend userEqual={userEqual} />
      </div>
    </main>
  );
}

export default CaseView;
