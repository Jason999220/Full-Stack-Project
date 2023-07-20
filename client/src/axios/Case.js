import axios from "axios"; // 引入 axios 工具

// 後端給的網址
const API_URL =
  "http://localhost/Full-Stack-Project/server/public/index.php/api/case";

class Case {
  // 提案介面(proposal) => location = city,district
  addCase(
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
    contactPhone,
    contactTime,
    status,
    imageA,
    imageB,
    imageC,
    imageD,
    imageE
  ) {
    return axios.post(API_URL + "/addCase", {
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
      contactPhone,
      contactTime,
      status,
      imageA,
      imageB,
      imageC,
      imageD,
      imageE,
    });
  }

  // 處理登出
  logout(token) {
    return axios.post(API_URL + "/logout", {
      token,
    });
  }
}

// new 一個 Auth 的實例 ，export default 默認導出 供其他程式直接引用
export default new Case();
