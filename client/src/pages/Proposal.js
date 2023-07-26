import React, { useState, useContext, useEffect } from "react";
import "./proposal.css";
import { GlobelDate } from "../App";
import Case from "../axios/Case";
import { useLocation, useNavigate } from "react-router-dom";


function Proposal() {
  const navigate = useNavigate()
  const location = useLocation(); // get case data from ProposalRecord

  // 選擇全域變數
  const { } = useContext(GlobelDate);
  // 儲存選擇的母、子類別
  const [category, setCategory] = useState();
  const [subCategory, setSubCategory] = useState();
  // 儲存選擇地區的母、子類別
  const [city, setCity] = useState();
  const [subCity, setSubCity] = useState();

  // 母類別
  const bigClassNames = JSON.parse(localStorage.getItem("bigClassNames"))
  // 子類別
  const subBigClassNames = JSON.parse(localStorage.getItem("subBigClassNames"))
  // 母地區
  const bigCityNames = JSON.parse(localStorage.getItem("bigCityNames"))
  // 子地區
  const subCityNames = JSON.parse(localStorage.getItem("subCityNames"))

  // const [status, setStatus] = useState("發布案件");
  const [name, setName] = useState(location.state ? location.state['caseInfo'][0]['caseName'] : ''); // 案件名稱
  const [budget, setBudget] = useState(location.state ? location.state['caseInfo'][0]['budget'] : ''); // 案件預計金額
  const [deadline, setDeadline] = useState(location.state ? location.state['caseInfo'][0]['deadline'] : null); // 案件預計完成時間
  const [description, setDescription] = useState(location.state ? location.state['caseInfo'][0]['description'] : ''); // 案件描述
  const [contactName, setContactName] = useState(location.state ? location.state['caseInfo'][0]['contactName'] : ''); // 聯絡人姓名
  const [isContactPhone, setIsContactPhone] = useState(location.state ? location.state['caseInfo'][0]['contactAble'] : null); // 是否可以聯絡
  const [contactPhone, setContactPhone] = useState(location.state ? location.state['caseInfo'][0]['contactPhone'] : ''); // 聯絡的電話
  // 儲存可連絡時間
  const [contactTime, setContactTime] = useState("0000");
  const [contactTimeItem0, setContactTimeItem0] = useState(location.state ? location.state['caseInfo'][0]['contactTime'][0] : "0");
  const [contactTimeItem1, setContactTimeItem1] = useState(location.state ? location.state['caseInfo'][0]['contactTime'][1] : "0");
  const [contactTimeItem2, setContactTimeItem2] = useState(location.state ? location.state['caseInfo'][0]['contactTime'][2] : "0");
  const [contactTimeItem3, setContactTimeItem3] = useState(location.state ? location.state['caseInfo'][0]['contactTime'][3] : "0");
  // 儲存5張圖片
  const [imageA, setImageA] = useState(location.state ? location.state['caseInfo'][0]['imageA'] : 'null');
  const [imageB, setImageB] = useState(location.state ? location.state['caseInfo'][0]['imageB'] : 'null');
  const [imageC, setImageC] = useState(location.state ? location.state['caseInfo'][0]['imageC'] : 'null');
  const [imageD, setImageD] = useState(location.state ? location.state['caseInfo'][0]['imageD'] : 'null');
  const [imageE, setImageE] = useState(location.state ? location.state['caseInfo'][0]['imageE'] : 'null');

  // handle function
  const handlename = (event) => {
    setName(event.target.value);
  };
  const handlebudget = (event) => {
    setBudget(event.target.value);
  };
  const handledeadline = (event) => {
    setDeadline(event.target.value);
  };
  const handledescription = (event) => {
    setDescription(event.target.value);
  };
  const handleContactName = (event) => {
    setContactName(event.target.value);
  };
  const handleContactPhone = (event) => {
    setContactPhone(event.target.value);
  };
  const handleIsContactPhone = (event) => {
    setIsContactPhone(event.target.value);
  };
  // 處理【聯絡時間】的boolean
  const handlecontactTime = (event) => {
    // setContactTime(event.target.checked)
    const isChecked = (bool) => {
      if (bool) {
        return "1";
      } else {
        return "0";
      }
    };
    if (event.target.id === "time0") {
      // 取得當前是否 checked，並儲存至相對應的 Item 供其他狀態判斷
      setContactTimeItem0(isChecked(event.target.checked));
      // 儲存四個input狀態
      setContactTime(
        `${isChecked(
          event.target.checked
        )}${contactTimeItem1}${contactTimeItem2}${contactTimeItem3}`
      );
    } else if (event.target.id === "time1") {
      setContactTimeItem1(isChecked(event.target.checked));
      setContactTime(
        `${contactTimeItem0}${isChecked(
          event.target.checked
        )}${contactTimeItem2}${contactTimeItem3}`
      );
    } else if (event.target.id === "time2") {
      setContactTimeItem2(isChecked(event.target.checked));
      setContactTime(
        `${contactTimeItem0}${contactTimeItem1}${isChecked(
          event.target.checked
        )}${contactTimeItem3}`
      );
    } else {
      setContactTimeItem3(isChecked(event.target.checked));
      setContactTime(
        `${contactTimeItem0}${contactTimeItem1}${contactTimeItem2}${isChecked(
          event.target.checked
        )}`
      );
    }
  };

  // 判別【聯絡時間】的boolean


  //  取得當前母類別資料
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    console.log(event.target.value);
  };
  //  取得當前子類別資料
  const handleSubCategoryChange = (event) => {
    setSubCategory(event.target.value);
    console.log(event.target.value);
  };
  //  取得當前母類別資料
  const handleCityChange = (event) => {
    setCity(event.target.value);
    console.log(event.target.value);
  };
  //  取得當前子類別資料
  const handleSubCityChange = (event) => {
    setSubCity(event.target.value);
    console.log(event.target.value);
  };

  // 處理 => 發布案件
  const handlePublishCase = () => {
    let status = "刊登中";
    // 取得當前 userID
    let userID = JSON.parse(localStorage.getItem("userID"));
    // 將資料傳遞給後端
    Case.addCase(
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
      isContactPhone,
      contactPhone,
      contactTime,
      status,
      imageA,
      imageB,
      imageC,
      imageD,
      imageE
    )
      .then((result) => {
        console.log(result);
        alert('刊登成功')
        navigate('/personalinfo')
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // 處理 => 儲存至草稿
  const handleDraftCase = () => {
    let status = "草稿";
    let userID = JSON.parse(localStorage.getItem("userID"));
    Case.proposal(
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
      isContactPhone,
      contactPhone,
      contactTime,
      status,
      imageA,
      imageB,
      imageC,
      imageD,
      imageE
    )
      .then((result) => {
        console.log(result);
        alert('已新增草稿')
        navigate('/personalinfo')
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <main className="container">
      {/* 未登入導向至登入介面 */}
      {JSON.parse(localStorage.getItem('userInfo')) === '' && <h1>尚未登入</h1>}


      <div className="caseBox">
        {/* 案件名稱 */}
        <div className="box">
          <h4 className="">案件名稱 :</h4>
          <input
            type="text"
            placeholder="請填寫案件名稱"
            onChange={handlename}
            value={name}
          />
        </div>
        {/* 類別需求 */}
        <div className="box">
          <label htmlFor="category">需求類別：</label>
          <select
            className="form-select"
            aria-label="Default select example"
            style={{ width: "200px" }}
            // value={category}
            onChange={handleCategoryChange}
          >
            <option selected disabled>
              請選擇....
            </option>
            {bigClassNames.map((item) => (<option key={item['bigClassID']} value={item['bigClassID']} >{item['bigClassName']}</option>))}
          </select>
          <br />
          {/* 依不同的母類別找尋相對應的子類別 */}
          {category && (
            <select
              className="form-select"
              aria-label="Default select example"
              style={{ width: "200p;x" }}
              onChange={handleSubCategoryChange}
            >
              <option selected disabled>
                請選擇...
              </option>
              {subBigClassNames.map((item) => (
                <>
                  {item["bigClassID"] === category && (
                    <option key={item['classID']} value={item['classID']}>
                      {item['className']}
                    </option>
                  )}
                </>
              ))}
            </select>
          )}
        </div>
        {/* 金額 */}
        <div className="box">
          <h4 htmlFor="caseMoney">預算金額 :</h4>
          <input
            type="number"
            id="caseMoney"
            placeholder="請輸入預期的金額"
            onChange={handlebudget}
            value={budget}
          />
        </div>
        {/* 期限 */}
        <div className="box">
          <h4 htmlFor="caseMoney">期限 :</h4>
          <input type="radio" id="noTime" name="deadline" />
          <label htmlFor="noTime">不指定日期</label>
          <br />
          <input type="radio" name="deadline" id="yesTime" />
          <label htmlFor="yesTime">指定日期 </label>
          <input type="date" id="yesTime" onChange={handledeadline} value={deadline} />
        </div>
        {/* 地點 */}
        <div className="box">
          <label htmlFor="locationCategory">工作地點 : </label>
          <select
            className="form-select"
            aria-label="Default select example"
            style={{ width: "200px" }}
            onChange={handleCityChange}
          >
            <option selected disabled>
              請選擇....
            </option>
            {bigCityNames.map((item) => (<option key={item['cityID']} value={item['cityID']} >{item['city']}</option>))}
          </select>
          <br />
          {/* 依不同的母類別找尋相對應的子類別 */}
          {city && (
            <select
              className="form-select"
              aria-label="Default select example"
              style={{ width: "200p;x" }}
              onChange={handleSubCityChange}
            >
              <option selected disabled>
                請選擇...
              </option>
              {subCityNames.map((item) => (
                <>
                  {item["cityID"] === city && (
                    <option key={item['districtID']} value={item['districtID']}>
                      {item['district']}
                    </option>
                  )}
                </>
              ))}
            </select>
          )}
        </div>
        {/* 內容 */}
        <div className="box">
          <h4>工作內容 :</h4>
          <textarea
            className="form-control"
            aria-label="With textarea"
            onChange={handledescription}
            value={description}
          ></textarea>
        </div>
        {/* 檔案 */}
        <div className="box">
          <h4>是否需上傳照片或檔案供接案人參考</h4>
          <p>
            1. 最多可新增5個附件，每個大小不超過
            <span className="text-danger fw-bolder">2MB</span> 。
          </p>
          <p>
            2. 因案件上架後為公開頁面， 故
            <span className="text-danger fw-bolder">請勿</span>
            上傳內含個資圖片(如：個人名片或或其他聯絡方式)。
          </p>
          <input type="file" />
        </div>
        {/* 聯絡方式 */}
        <div className="box">
          <h4>聯絡資料</h4>
          <input
            type="text"
            placeholder="請輸入聯絡人名稱"
            onChange={handleContactName}
            value={contactName}
          />
          <h4>允許接案人透過電話聯絡您嗎?</h4>
          <select
            className="form-select"
            aria-label="Default select example"
            onChange={handleIsContactPhone}
            value={isContactPhone}
          >
            <option selected disabled>
              請選擇...
            </option>
            <option value="true">允許</option>
            <option value="false">不允許</option>
          </select>
          <h4>連絡人電話號碼</h4>
          <input
            type="text"
            placeholder="請輸入連絡人電話號碼"
            onChange={handleContactPhone}
            value={contactPhone}
          />
          <h4>請勾選希望接案人聯絡時段?</h4>
          <input
            type="checkbox"
            id="time0"
            name="time"
            onClick={handlecontactTime}
          />
          <label htmlFor="time0">
            上午00:00~上午08:00
          </label>
          <br />
          <input
            type="checkbox"
            id="time1"
            name="time"
            onClick={handlecontactTime}
          />
          <label htmlFor="time1">上午08:00~中午12:00</label>
          <br />
          <input
            type="checkbox"
            id="time2"
            name="time"
            onClick={handlecontactTime}
          />
          <label htmlFor="time2">下午13:00~下午17:00</label>
          <br />
          <input
            type="checkbox"
            id="time3"
            name="time"
            onClick={handlecontactTime}
          />
          <label htmlFor="time3">晚上17:00~晚上24:00</label>
          <br />
        </div>
        {/* btn */}
        <div className="box d-flex justify-content-evenly">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleDraftCase}
          >
            儲存至草稿
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePublishCase}
          >
            發布案件
          </button>
        </div>
      </div>
    </main>
  );
}

export default Proposal;
