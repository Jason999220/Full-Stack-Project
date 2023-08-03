import axios from "axios"; // 引入 axios 工具

// 後端給的網址
const API_URL =
  // "https://4f5a-2001-b011-9807-59a3-714d-fb29-35af-f071.ngrok-free.app/public/index.php/api/cases";
  "http://localhost/Full-Stack-Project/server/public/index.php/api/cases";

class Case {
  // 新增案件
  addCase(
    caseID,
    userID,
    name,
    category,
    subCategory,
    budget,
    deadline,
    city,
    subCity,
    description,
    contactName,
    contactAble,
    contactPhone,
    contactTime,
    status,
    allFiles
  ) {
    console.log(allFiles);
    return axios.post(
      API_URL + "/addCase",
      {
        caseID,
        userID,
        name,
        category,
        subCategory,
        budget,
        deadline,
        city,
        subCity,
        description,
        contactName,
        contactAble,
        contactPhone,
        contactTime,
        status,
        allFiles,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  // 取得所有刊登資料
  getCases(bigClassID, classID, cityID, districtID, page) {
    return axios.post(API_URL, {
      bigClassID,
      classID,
      cityID,
      districtID,
      page,
    });
  }

  // 取得母地區
  getCitys() {
    return axios.get(API_URL + "/getCitys");
  }

  // 取得子地區
  getSubCitys() {
    return axios.get(API_URL + "/getSubCitys");
  }

  // 取得母類別
  getCategorys() {
    return axios.get(API_URL + "/getCategorys");
  }

  // 取得子類別
  getSubCategorys() {
    return axios.get(API_URL + "/getSubCategorys");
  }

  // 取得當前被點擊的案件資訊
  getCaseInfo(caseID, userID) {
    return axios.get(API_URL + `/getCaseInfo`, { params: { caseID, userID } });
  }

  // 取得當前被點擊的類似案件
  getSimilarCase(currentCaseId) {
    return axios.get(API_URL + `/getSimilarCase`, {
      params: { currentCaseId },
    });
  }

  // 取得當前被點擊的報價人員
  getBidder(caseID) {
    return axios.get(API_URL + `/getBidder`, { params: { caseID } });
  }

  // 新增報價人員
  newBidder(caseID, userID, quotation, win, selfRecommended) {
    return axios.post(API_URL + `/newBidder`, {
      caseID,
      userID,
      quotation,
      win,
      selfRecommended,
    });
  }

  // 收藏案件
  addCollection(caseID, userID) {
    return axios.post(API_URL + `/addCollection`, {
      caseID,
      userID,
    });
  }
}

// new 一個 Auth 的實例 ，export default 默認導出 供其他程式直接引用
export default new Case();
