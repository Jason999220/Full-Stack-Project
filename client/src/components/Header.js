import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import { GlobelDate } from "../App";
import UserInfo from "./UserInfo";
import Auth from "../axios/Auth";
import headerLogo from "../imgs/header_logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import presetHeadPhoto from "../imgs/head.png";
import { FaSearch } from "react-icons/fa";
// import { FaSearch, FaTimes } from "react-icons/fa";
// import { navigate } from 'react-router-dom'; // 导入路由库中的导航函数


function Header() {
  const {
    headphoto,
    setHeadPhoto,
    userinfo,
    setUserInfo,
    setInfoData,
    unreadNotifications,
  } = useContext(GlobelDate);

  const handleLogout = () => {
    Auth.logout(userinfo)
      .then((result) => {
        //登出後把storage的userinfo改成result
        localStorage.setItem(
          "userInfo",
          JSON.stringify(result["data"]["message"][0]["result"])
        );
        //把空字串傳入setUserInfo
        setUserInfo(JSON.parse(localStorage.getItem("userInfo")));
        toast.info("用戶登出", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      setUserInfo(
        localStorage
          .getItem("userInfo")
          .substring(1, localStorage.getItem("userInfo").length - 1)
      );
      Auth.enterProfile(userinfo)
        .then((result) => {
          setHeadPhoto(
            `data:image/jpeg;base64, ${result["data"]["message"][0]["profilePhoto"]}`
          );
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);
  console.log(headphoto);
  // console.log(JSON.stringify(localStorage.getItem("userInfo")));

  // ??????????????????????????????????????????????????????????????

  const [searchVisible, setSearchVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showHistory, setShowHistory] = useState(false); // 新增的狀態
  const [searchHistory, setSearchHistory] = useState([]); // 儲存歷史紀錄

  // 點擊icon時跳出搜尋框
  const handleIconClick = () => {
    setSearchVisible(true);
    // setShowHistory(true); // 点击图标时显示历史记录
  };
  // 打叉按鈕
  const handleClearSearch = () => {
    setSearchKeyword("");
    setSearchResults([]);
    setSearchVisible(false);
  };

  // useEffect(() => {
  //   // 在组件加载时，获取历史搜索记录
  //   handleSearchInputChange();
  // }, []);

  // 处理点击搜索框的函数，显示历史记录
  // const handleInputClick = () => {
  //   setShowDropdown(!showDropdown); // 切换下拉菜单的显示状态
  // };

  // const handleSearchInputChange = async (event) => {
  //   const keyword = event.target.value; // 获取输入的关键字
  //   setSearchKeyword(keyword); // 设置搜索关键字

  //   if (keyword.trim() === "") {
  //     setShowDropdown(true); // 显示下拉菜单
  //     setSearchResults([]); // 清空搜索结果
  //   } else {
  //     setShowDropdown(false); // 隐藏下拉菜单

  //     try {
  //       const response = await axios.get('http://localhost/Full-Stack-Project/server/public/api/get-search-history');
  //       const searchHistory = response.data; // 这里的 data 应该是搜索历史数据的数组
  //       // 处理搜索历史数据，可能需要根据后端返回的数据结构进行适当的处理
  //       setSearchHistory(searchHistory); // 设置搜索历史数据
  //     } catch (error) {
  //       console.error("获取搜索历史出错：", error);
  //     }

  //     setSearchResults(await handleSearch(keyword)); // 获取并设置搜索结果
  //   }
  // };

  // 定义handleSearch函数来执行实际搜索
  // const handleSearch = async (keyword) => {
  //   try {
  //     const response = await axios.get(`api/search?q=${keyword}`);
  //     return response.data; // 返回搜索结果
  //   } catch (error) {
  //     console.error("搜索出错：", error);
  //     return []; // 在出错的情况下返回空数组
  //   }
  // };

  // // 輸入文字時
  // const handleSearchInputChange = async () => {
  //   if (searchKeyword.trim() === "") {
  //     setShowDropdown(true); // 显示下拉菜单
  //     setSearchResults([]); // 清空搜索结果
  //   } else {
  //     setShowDropdown(false); // 隐藏下拉菜单

  //     try {
  //       const response = await Auth.getSearch(searchKeyword); // 调用自定义的 getSearch 方法
  //       setSearchResults(response.data); // 设置搜索结果为后端返回的数据
  //       setShowDropdown(true); // 显示下拉菜单，因为有搜索结果了
  //     } catch (error) {
  //       console.error("搜索出错：", error);
  //     }
  //   }
  // };
  // ??????????????????????????????????????????????????????????????
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    console.log("Suggestions state updated:", suggestions);
  }, [suggestions]); // 当 suggestions 状态变化时触发 useEffect


  const handleInputChange = async (event) => {
    const newTerm = event.target.value;
    setSearchTerm(newTerm);

    if (newTerm.length > 0) {
      try {
        const response = await Auth.autocomplete(newTerm);
        console.log("API response:", response.data);
        console.log("Suggestions:", suggestions);
        setSuggestions(response.data);
        setShowDropdown(true); // 在有建议时显示下拉菜单

      } catch (error) {
        console.error("API request error:", error);
      }
    } else {
      setSuggestions([]);
      setShowDropdown(false); // 在没有输入时隐藏下拉菜单

    }
  };


  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion); // 设置输入框的值为选项内容
    setShowDropdown(false); // 关闭下拉菜单
    setSuggestions([]); // 清空建议列表，以免下次打开时显示旧的建议
  };


  // console.log(headphoto);
  return (
    <div className="header">
      <div className="h50 d-flex my-auto align-items-center navbar-expand-lg navbar-light fW">
        <div className="LOGO">
          <Link to="/" className="mx-5 logoIMG">
            <img src={headerLogo} width="200" height="100%" alt="img" />
          </Link>
        </div>
        <button
          className="navbar-toggler hbg ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse show1"
          id="navbarSupportedContent"
        >
          <ul class="navbar-nav me-auto mb-2 mb-lg-0 hbgUl d-flex my-auto align-items-center">
            <li class="nav-item">
              <Link to="/proposal" className="headerBTN1">
                提案
              </Link>
            </li>
            <li class="nav-item">
              <Link to="/allCase" className="headerBTN2">
                接案
              </Link>
            </li>

            <li class="nav-item dFlex">
              {/* <li className="nav-item d-flex align-items-center"> */}
              {userinfo ? (
                <div className="d-flex align-items-center">
                  <div className="search-icon-container">
                    <FaSearch
                      className="search-icon"
                      size={24}
                      onClick={handleIconClick}
                    />
                  </div>
                  {/* 遮罩跟搜尋框 */}
                  {searchVisible && (
                    <div className="overlay">
                      <div className="search-container">
                        <div
                          className="search-close-button"
                          onClick={handleClearSearch}
                        >
                          <span>&times;</span>
                        </div>
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={handleInputChange}
                          placeholder="搜索案件名稱"
                          onClick={() => setShowDropdown(true)}
                        />

                        {showDropdown && (
                          <ul
                            className="dropdown-menulist"
                            aria-labelledby="dropdownMenuButton"
                          >
                            {suggestions.map((result, index) => (
                              <li key={index}>
                                <button
                                  className="dropdown-item"
                                  onClick={() => handleSuggestionClick(result)}
                                  >
                                  {result}{" "}
                                  {/* 这里直接使用 result 作为选项内容 */}
                                  {/* <Link to="/caseview/10" className="dropdown-item" onClick={() => handleSuggestionClick("水管爆掉")}>
                                  </Link> */}

                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
  

                  





                  

                  <div className="dropdown ms-auto">
                    <Link
                      to="#"
                      className="d-block link-dark text-decoration-none"
                      id="dropdownUser2"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img
                        src={
                          headphoto.charAt(23) === "R" ||
                          headphoto.charAt(23) === "i" ||
                          headphoto.charAt(23) === "/" ||
                          headphoto.charAt(24) === "R" ||
                          headphoto.charAt(24) === "i" ||
                          headphoto.charAt(24) === "/"
                            ? headphoto
                            : presetHeadPhoto
                        }
                        style={{ objectFit: "cover" }}
                        alt="mdo"
                        width="40"
                        height="40"
                        className="rounded-circle rwdPhoto"
                      />
                    </Link>
                    <ul
                      className="dropdown-menu text-small shadow rwdhead"
                      aria-labelledby="dropdownUser2"
                    >
                      <li>
                        <Link
                          className="dropdown-item rwdWord"
                          to="/personalinfo"
                          onClick={() => setInfoData("1")}
                        >
                          我的帳號
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item rwdWord"
                          to="/personalinfo"
                          onClick={() => setInfoData("3")}
                        >
                          我的案件
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item rwdWord" to="/chatRoom">
                          聊天室
                          <span
                            className={
                              unreadNotifications?.length === 0
                                ? null
                                : "chatRoomNotification"
                            }
                          ></span>
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <Link
                          className="dropdown-item rwdWord"
                          to=""
                          onClick={handleLogout}
                        >
                          登出
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="dFlex">
                  {/* 第一個標籤不能運作的BUG，所要加一個DIV */}
                  <div></div>

                  <div className="loginBC">
                    <Link to="/login" className="loginBCHover">
                      登入
                    </Link>
                  </div>
                  <div className="RegisterBC">
                    <Link to="/register" className="loginBCHover">
                      註冊
                    </Link>
                  </div>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
      {/* <ToastContainer limit={1}/> */}
      <ToastContainer limit={1} />
    </div>
  );
}

export default Header;
