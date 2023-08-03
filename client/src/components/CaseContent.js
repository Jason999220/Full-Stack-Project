import React, { useEffect } from "react";
import "./caseContent.css";
import Case from "../axios/Case";

function CaseContent(props) {
  const {
    caseID,
    caseName,
    budget,
    deadline,
    description,
    city,
    district,
    files,
    userEqual,
    collection,
    setCollection,
  } = props;

  const fileType = (file) => {
    if (file.charAt(0) === "/") {
      return "image/jpeg";
    } else if (file.charAt(0) === "i") {
      return "image/png";
    } else if (file.charAt(0) === "J") {
      return "application/pdf";
    } else if (file.charAt(0) === "U") {
      return "application/pdf";
    }
  };

  // 收藏案件
  const handleStar = () => {
    Case.addCollection(caseID, JSON.parse(localStorage.getItem("userID")))
      .then((result) => {
        console.log(result);
        if (result["data"][0]["result"] === "收藏成功") {
          setCollection(1);
        } else {
          setCollection(0);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // 從資料庫
  useEffect(() => {}, []);
  return (
    <div className="case-view">
      <h2>案件標題 : {caseName}</h2>
      {userEqual ? (
        <></>
      ) : (
        <>
          {/* 愛心 Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-star-fill caseStar"
            viewBox="0 0 16 16"
            onClick={handleStar}
            style={{
              color: collection === 1 ? "#ffc400" : "#c0c0c0",
            }}
          >
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
          </svg>
        </>
      )}

      <h2>
        地點 : {city}
        {district}
      </h2>
      <h2>預計完成金額 : {budget} 元</h2>
      <h2>預計完成日期 : {deadline}</h2>
      <h2>詳細說明 : </h2>
      <h4>{description}</h4>
      {files.map((item, index) => (
        <div key={index}>
          <img
            src={`data:image/${fileType(item)}, ${item}`}
            width={"100"}
            alt="img"
          />
        </div>
      ))}
    </div>
  );
}

export default CaseContent;
