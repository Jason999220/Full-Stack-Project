import React, { useEffect, useState, useContext } from "react";
import "./AllCase.css";
import { Link } from "react-router-dom";
import Case from "../axios/Case";
import { GlobelDate } from "../App";

function AllCase() {
  // 取得全域變數
  const { setCurrentCaseId } = useContext(GlobelDate);

  // 處理頁數
  const [page, setPage] = useState(1);

  // 處理母子類別
  const [bigClassID, setBigClassID] = useState(""); // 目前點選的資料
  const [bigClassStr, setBigClassStr] = useState("null"); // 儲存所有被點選的資料
  const [subClassID, setSubClassID] = useState(""); // 目前點選的資料
  const [subClassStr, setSubClassStr] = useState("null"); // 儲存所有被點選的資料
  // 處理母子地區
  const [bigCityID, setBigCityID] = useState(""); // 目前點選的資料
  const [bigCityStr, setBigCityStr] = useState("null"); // 儲存所有被點選的資料
  const [subCityID, setSubCityID] = useState(""); // 目前點選的資料
  const [subCityStr, setSubCityStr] = useState("null"); // 儲存所有被點選的資料

  const [cases, setCases] = useState([]); // 利用useEffect 獲得資料

  // 進到【home】就取得並放入localstorage 給【AllCase】 使用
  // 母類別
  const bigClassNames = JSON.parse(localStorage.getItem("bigClassNames"));
  // 子類別
  const subBigClassNames = JSON.parse(localStorage.getItem("subBigClassNames"));
  // 母地區
  const bigCityNames = JSON.parse(localStorage.getItem("bigCityNames"));
  // 子地區
  const subCityNames = JSON.parse(localStorage.getItem("subCityNames"));

  useEffect(() => {
    // 畫面一掛載從資料庫取得所有案件
    Case.getCases(bigClassStr, subClassStr, bigCityStr, subCityStr, page)
      .then((result) => {
        console.log(result["data"]);
        setCases(result["data"]);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [bigClassID, subClassID, bigCityID, subCityID, page]);

  // 處理母類別的字串
  const handleBigClass = (id) => {
    setBigClassID(id);
    if (bigClassStr.indexOf(id) === -1) {
      // 進到頁面是否為第一次做篩選，為了避免,號
      if (bigClassStr === "null" || bigClassStr === "") {
        setBigClassStr(bigClassStr.replace("null", `${id}`)); // 將初始的null替換掉
      } else {
        setBigClassStr((preState) => preState + "," + id);
      }
    }
    // 假如重複點選判斷狀態
    if (bigClassStr.match(id)) {
      if (bigClassStr.indexOf(`${id},`) !== -1) {
        setBigClassStr(bigClassStr.replace(`${id},`, "")); // 處理【A01,】這種狀態
      } else if (bigClassStr.indexOf(`,${id}`) !== -1) {
        setBigClassStr(bigClassStr.replace(`,${id}`, "")); // 處理【,A01】這種狀態
      } else {
        setBigClassStr("null"); // 處理【A01】這種狀態=> 這會報錯
      }
    }
  };

  // 處理子類別的字串
  const handleSubClass = (e) => {
    const { id } = e.target; // 取得代號
    setSubClassID(id);
    if (subClassStr.indexOf(id) === -1) {
      // 進到頁面是否為第一次做篩選，為了避免,號
      if (subClassStr === "null" || subClassStr === "") {
        setSubClassStr(subClassStr.replace("null", `${id}`)); // 將初始的null替換掉
      } else {
        setSubClassStr((preState) => preState + "," + id);
      }
    }
    // 假如重複點選判斷狀態
    if (subClassStr.match(id)) {
      if (subClassStr.indexOf(`${id},`) !== -1) {
        setSubClassStr(subClassStr.replace(`${id},`, "")); // 處理【A01,】這種狀態
      } else if (subClassStr.indexOf(`,${id}`) !== -1) {
        setSubClassStr(subClassStr.replace(`,${id}`, "")); // 處理【,A01】這種狀態
      } else {
        setSubClassStr("null"); // 處理【A01】這種狀態=> 這會報錯
      }
    }
  };

  // 處理母地區的字串
  const handlebigCity = (id) => {
    setBigCityID(id);
    if (bigCityStr.indexOf(id) === -1) {
      // 進到頁面是否為第一次做篩選，為了避免,號
      if (bigCityStr === "null" || bigCityStr === "") {
        setBigCityStr(bigCityStr.replace("null", `${id}`)); // 將初始的null替換掉
      } else {
        setBigCityStr((preState) => preState + "," + id);
      }
    }
    // 假如重複點選判斷狀態
    if (bigCityStr.match(id)) {
      if (bigCityStr.indexOf(`${id},`) !== -1) {
        setBigCityStr(bigCityStr.replace(`${id},`, "")); // 處理【A01,】這種狀態
      } else if (bigCityStr.indexOf(`,${id}`) !== -1) {
        setBigCityStr(bigCityStr.replace(`,${id}`, "")); // 處理【,A01】這種狀態
      } else {
        setBigCityStr("null"); // 處理【A01】這種狀態=> 這會報錯
      }
    }
  };

  // 處理子地區的字串
  const handleSubCity = (e) => {
    const { id } = e.target; // 取得代號
    setSubCityID(id);
    if (subCityStr.indexOf(id) === -1) {
      // 進到頁面是否為第一次做篩選，為了避免,號
      if (subCityStr === "null" || subCityStr === "") {
        setSubCityStr(subCityStr.replace("null", `${id}`)); // 將初始的null替換掉
      } else {
        setSubCityStr((preState) => preState + "," + id);
      }
    }
    // 假如重複點選判斷狀態
    if (subCityStr.match(id)) {
      if (subCityStr.indexOf(`${id},`) !== -1) {
        setSubCityStr(subCityStr.replace(`${id},`, "")); // 處理【A01,】這種狀態
      } else if (subCityStr.indexOf(`,${id}`) !== -1) {
        setSubCityStr(subCityStr.replace(`,${id}`, "")); // 處理【,A01】這種狀態
      } else {
        setSubCityStr("null"); // 處理【A01】這種狀態=> 這會報錯
      }
    }
  };

  return (
    <main className="container my-4">
      <div className="takeTheCaseBox d-flex">
        {bigClassNames === null ? (
          <h1>伺服器在睡覺中 勿擾</h1>
        ) : (
          <>
            {/* 左側篩選欄 */}
            <div className="condition mx-3">
              {/* 類別 */}
              {bigClassNames.map((items, index) => (
                <div className="mb-3" key={index}>
                  <button
                    className="btn btn-secondary w-100"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${items.bigClassName}`}
                    data-bs-id={`${items.bigClassID}`} // 賦予代號
                    aria-expanded="false"
                    aria-controls={`${items.bigClassName}`}
                    onClick={(e) => {
                      handleBigClass(e.target.dataset["bsId"]);
                    }}
                  >
                    {items.bigClassName}
                  </button>
                  <div
                    className="collapse multi-collapse"
                    id={`${items.bigClassName}`}
                  >
                    <div className="card card-body">
                      <ul className="list-group">
                        {subBigClassNames.map((item, index) => (
                          <>
                            {item["bigClassID"] === items.bigClassID && (
                              <li className="list-group-item p-0" key={index}>
                                <input
                                  type="checkbox"
                                  id={`${item.classID}`}
                                  name={`${item.bigClassID}`}
                                  onClick={(e) => {
                                    handleSubClass(e);
                                  }}
                                />
                                <label htmlFor={`${item.classID}`}>
                                  {item.className}
                                </label>
                              </li>
                            )}
                          </>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
              {/* 地區 */}
              <button
                className="btn btn-secondary w-100"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#location`}
                aria-expanded="false"
                aria-controls={`location`}
              >
                地區
              </button>
              {bigCityNames.map((items, index) => (
                <div className="mb-3 mt-2" key={index}>
                  <div
                    id={`location`}
                    className="collapse btn btn-primary multi-collapse w-75"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${items.cityID}`}
                    data-bs-id={`${items.cityID}`} // 賦予代號
                    aria-expanded="false"
                    aria-controls={`${items.cityID}`}
                    onClick={(e) => {
                      handlebigCity(e.target.dataset["bsId"]); // 取得代號
                    }}
                  >
                    {items.city}
                  </div>
                  <div
                    className="collapse multi-collapse"
                    id={`${items.cityID}`}
                  >
                    <div className="card card-body">
                      <ul className="list-group">
                        {subCityNames.map((item, index) => (
                          <>
                            {item["cityID"] === items.cityID && (
                              <li className="list-group-item p-0" key={index}>
                                <input
                                  type="checkbox"
                                  id={`${item.districtID}`}
                                  name={`${item.cityID}`}
                                  onClick={(e) => {
                                    handleSubCity(e);
                                  }}
                                />
                                <label htmlFor={`${item.districtID}`}>
                                  {item.district}
                                </label>
                              </li>
                            )}
                          </>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* 右側接案區 */}
            <div className="allCaseBox">
              {/* 顯示案子 */}
              <section className="d-flex flex-wrap">
                {cases.map((item) => (
                  <div
                    className="case border border-2 border-warning p-2"
                    key={item.caseID}
                  >
                    <img
                      src={`data:image/jpeg;base64, ${item.image}`} // 加上標頭
                      alt="img"
                      width={150}
                      height={150}
                      className="mb-3"
                    />
                    <p>案件標題 : {item.caseName}</p>
                    <p>
                      地點: {item.city}
                      {item.district}
                    </p>
                    <p>預算: {item.budget}</p>
                    <p>預計完成日期: {item.deadline}</p>
                    <Link
                      className="moreView"
                      to={`/caseview/${item.caseID}`}
                      data-caseid={item.caseID}
                      onClick={(e) => {
                        // console.log(e.target["dataset"]["caseid"]);
                        // 取得當前點擊的case ID，並導向至caseview
                        setCurrentCaseId(e.target["dataset"]["caseid"]);
                      }}
                    >
                      more view
                    </Link>
                  </div>
                ))}
              </section>
              {/* 顯示page */}
              <ul className="pagination">
                <li className="page-item">
                  <p className="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                  </p>
                </li>
                <li className="page-item">
                  <p className="page-link" href="#">
                    1
                  </p>
                </li>
                <li className="page-item">
                  <p className="page-link" href="#">
                    2
                  </p>
                </li>
                <li className="page-item">
                  <p className="page-link" href="#">
                    3
                  </p>
                </li>
                <li className="page-item">
                  <p className="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </p>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default AllCase;
