<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;



class CasesController extends Controller
{
    // 提案
    public function insertCase(Request $request)
    {

        $caseID = (int)$request['caseID'];
        $userID = (int)$request['userID'];
        $name = $request['name'];
        $category = $request['category'];
        $subCategory = $request['subCategory'];
        $budget = (int)$request['budget'];
        $deadline = $request['deadline'];
        $city = $request['city'];
        $subCity = $request['subCity'];
        $description = $request['description'];
        $contactName = $request['contactName'];
        $contactAble = (int)$request['contactAble'];
        $contactPhone = $request['contactPhone'];
        $contactTime = $request['contactTime'];
        $status = $request['status'];
        $imageA = $request['imageA'];
        $imageB = $request['imageB'];
        $imageC = $request['imageC'];
        $imageD = $request['imageD'];
        $imageE = $request['imageE'];
        $Files = $request->file('allFiles');

        // 處理檔案附檔名及轉碼問題
        $allFileName = 'proposalFiles/'; // 初始設定標頭【proposalFiles/】，自定義的folder name
        $filesNameArray = []; // 存放所有的檔案包括檔名.副檔名

        for($i = 0; $i < count($Files); $i++){
            $fileName = $Files[$i]->getClientOriginalName(); // 檔案名稱
            $Files[$i]->storeAs('proposalFiles', $fileName); // 將要儲存在 storage 的哪個資料夾名稱
            $allFileName .= (string)$fileName . ",proposalFiles/"; // 將 加上逗號
            array_push($filesNameArray, $fileName); // 將 【$fileName】 push to 【$filesNameArray】
        }

        $allFileName = substr($allFileName, 0, -15) . ''; // 將最後的【,files/】移除並加上【"】

        // 為了將其取出
        // $result = DB::select("CALL newPortfolio($userID, $allFileName)")[0]->result; // file name saved in DB
        // $filesName = DB::select("select portfolio from myresume where userID = $userID")[0]->portfolio; // get the file name from the DB

        // return [$caseID,$userID, $name, $category, $subCategory, $budget, $deadline, $city,$subCity, $description, $contactName,$contactAble, $contactPhone, $contactTime, $status, $imageA, $imageB, $imageC, $imageD, $imageE];
        try {
            $results = DB::select("CALL addMyCase(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [$caseID,$userID, $name, $category, $subCategory, $budget, $deadline, $city,$subCity, $description, $contactName,$contactAble, $contactPhone, $contactTime, $status, $allFileName]);
            return $results;
        } catch (\Exception $e) {
            return response()->json(['result' => '插入案件失败']);
        }
        // CALL addMyCase(0,26,'組裝娃娃','B','B02','20000','2025/12/23','g','g09','幫忙組裝娃娃','娃娃女王',1,'0915758668','0110','刊登中','null','null','null','null','null');
    }

    // 獲取母、子類別
    public function getCategorys()
    {
        $results = DB::select('CALL caseListBigClass()');
        return response()->json($results);
    }
    public function getSubCategorys()
    {
        $results = DB::select('CALL caseClass()');
        return response()->json($results);
    }

    // 獲得母、子地區
    public function getCitys()
    {
        $results = DB::select('CALL caseListCity()');
        return $results;
    }
    public function getSubCitys()
    {
        $results = DB::select('CALL caseDistrict()');
        return $results;
    }


    // 搜尋並返回特定條件的案例
    public function getCases(Request $request)
    {
        $bigClassID = $request->input('bigClassID');
        $classID = $request->input('classID');
        $cityID = $request->input('cityID');
        $districtID = $request->input('districtID');
        $page = $request->input('page');

        $results = DB::select('CALL caseFilter(?,?,?,?,?)', [$bigClassID,$classID,$cityID,$districtID,$page]);
        $filesName = [];
        // 取出每個物件的 files 欄位資料
        for($i = 0; $i < count($results); $i++) {
            array_push($filesName, $results[$i]->image);
        };
        // 將其字串變為陣列
        for($i = 0; $i < count($filesName); $i++) {
            $filesName[$i] = explode(',', $filesName[$i]);
        };
        // 取得第一個的【jpg】||【jpeg】檔，否則為null
        $newFileArray=[];
        for($i = 0; $i < count($filesName); $i++) {
            // 假如一筆以上的資料，判斷有無【jpg】||【jpeg】檔
            if(count($filesName[$i]) > 1){
                for($j = 0; $j < count($filesName[$i]); $j++) {
                    if(strpos($filesName[$i][$j],'jpg')  !== false|| strpos($filesName[$i][$j],'jpeg')  !== false ){
                        array_push($newFileArray,$filesName[$i][$j]);
                        if(count($newFileArray) === 1){
                            break;
                        }
                    }
                }
                if(count($newFileArray) === 0){
                    array_push($newFileArray,null);
                }
            }

            // 只有一筆資料，判斷有無【jpg】||【jpeg】檔
            if(count($filesName[$i]) === 1){
                if(strpos($filesName[$i][0],'jpg')  !== false|| strpos($filesName[$i][0],'jpeg')  !== false){
                    // array_push($newFileArray,true);
                    array_push($newFileArray,$filesName[$i][0]);
                }else{
                    array_push($newFileArray,null);
                }
            }
        };
        // $filesObject = [];
        for($i = 0; $i < count($newFileArray); $i++) {
            if($newFileArray[$i] === null ){
                // array_push($filesObject,  null);
                $results[$i]->image = null;
            }else{
                if(base64_encode(Storage::get($newFileArray[$i]))===''){
                    $file = null;
                }else{
                    $file = base64_encode(Storage::get($newFileArray[$i]));// 一串長得很奇怪的亂碼
                }
                // array_push($filesObject,  $file); // 原本是想另外修改再丟到前端
                $results[$i]->image = $file; // 直接修改 資料庫回傳的資料
            }
        }
        return $results;
    }

    // 取得當前被點擊案件資訊
    public function getCaseInfo(Request $request)
    {
        $caseID =  (int)$request['caseID'];
        $userID =  (int)$request['userID'];
        $results = DB::select('CALL enterCase(?,?)',[$caseID, $userID]);
        // 處理檔案編碼
        $results[0]->image = explode(',', $results[0]->image);
        for($i = 0; $i < count($results[0]->image); $i++){
            $results[0]->image[$i] = base64_encode(Storage::get($results[0]->image[$i]));
        }
        // 處理頭像編碼
        $results[0]->profilePhoto = base64_encode(Storage::get($results[0]->profilePhoto));
        return $results;
    }

    // 取得當前被點擊案件的類似案件
    public function getSimilarCase(Request $request)
    {
        $classID =  $request['classID'];
        // return $classID;
        $results = DB::select('CALL similarCase(?)',[$classID]);
        return $results;
    }

    // 新增報價人員
    public function newBidder(Request $request)
    {
        $caseID =  (int)$request['caseID'];
        $userID =  (int)$request['userID'];
        $quotation =  (int)$request['quotation'];
        $win =  $request['win']; // 前端為甚麼要傳這個，還有tinyint 是甚麼型別
        $selfRecommended =  $request['selfRecommended'];
        $results = DB::select('CALL newBidder(?,?,?,?,?)',[$caseID,$userID,$quotation,$win,$selfRecommended]);
        return $results;
    }

    // 取得當前被點擊案件的報價人員
    public function getBidder(Request $request)
    {
        $caseID =  (int)$request['caseID'];
        $results = DB::select('CALL getBidder(?)',[$caseID]);
        return $results;
    }


}