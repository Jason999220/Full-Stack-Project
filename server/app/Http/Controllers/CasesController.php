<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class CasesController extends Controller
{

    // 提案
    public function addCase(Request $request)
{
    $userID = $request->input('userID');
    $name = $request->input('name');
    $category = $request->input('category');
    $subCategory = $request->input('subCategory');
    $budget = $request->input('budget');
    $deadline = $request->input('deadline');
    $city = $request->input('city');
    $subCity = $request->input('subCity');
    $description = $request->input('description');
    $contactName = $request->input('contactName');
    $contactPhone = $request->input('contactPhone');
    $contactTime = $request->input('contactTime');
    $status = $request->input('status');
    $imageA = $request->input('imageA');
    $imageB = $request->input('imageB');
    $imageC = $request->input('imageC');
    $imageD = $request->input('imageD');
    $imageE = $request->input('imageE');

    try {
        // DB::select("CALL addMyCase(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [$myuserID, $mycaseName, $mybigClassID, $myclassID, $mybudget, $mydeadline, $mycity, $mydescription, $mycontactName, $mycontactPhone, $mycontactTime, $mycaseStatus, $myimageA, $myimageB, $myimageC, $myimageD, $myimageE]);

        DB::select("CALL addMyCase($userID,'$name','$category','$subCategory','$budget','$deadline','$city','$subCity','$description','$contactName','$contactPhone','$contactTime','$status','$imageA','$imageB','$imageC','$imageD','$imageE')");
        if ($status == '草稿') {
        $result = '案件已儲存至草稿';
    } elseif ($status == '刊登中') {
        $result = '案件已刊登';
    }
    return response()->json(['result' => $result]);
    } catch (\Exception $e) {
        return response()->json(['result' => '插入案件失败']);
    }
    // $result = DB::select("CALL addMyCase($userID,'$name','$category','$subCategory','$budget','$deadline','$city','$subCity','$description','$contactName','$contactPhone','$contactTime','$status','$imageA','$imageB','$imageC','$imageD','$imageE')");
    // CALL addMyCase('17','test10','B','B03','20000','2000/12/23','台南市','東區','good','test','true','0110','發布案件','null','null','null','null','null');
    // return $result;
}


   // 搜尋並返回特定條件的案例
   public function getCases(Request $request)
   {
       $page = $request->input('page');
       $categories = $request->input('categories');

       $results = DB::select('CALL caseFilter(?, ?)', [$page, $categories]);

       return response()->json($results);
   }

   // 刊登中案例列表，每頁顯示30筆
   public function selectCases(Request $request)
   {
       $page = $request->input('page');
       $pagehead = ($page - 1) * 30;

       // 呼叫存儲過程
       $results = DB::select('CALL GetCases(?)', [$pagehead]);

       return response()->json($results);
   }


   // 提供bidder案件提供案件詳細訊息
   public function checkStatus(Request $request)
   {
       $mycaseID = $request->input('mycaseID');
       $myuserID = $request->input('myuserID');

       try {
           DB::select('CALL checkBidStatus(?, ?, @result)', [$mycaseID, $myuserID]);

           $statusResult = DB::select('SELECT @result AS result')[0]->result;

           if ($statusResult == '已報價') {
               $caseResult = DB::select('SELECT "已報價" as result, users.userID, profilePhoto, caseID, caseName, deadline, description, contactName, contactPhone, contactTime, budget, city, updateTime, imageA, imageB, imageC, imageD, imageE
                                        FROM mycase, users
                                        WHERE mycase.userID = users.userID AND mycase.caseID = ?', [$mycaseID]);
           } else {
               $caseResult = DB::select('SELECT "未報價" as result, users.userID, profilePhoto, caseID, caseName, deadline, description, contactName, contactPhone, contactTime, budget, city, updateTime, imageA, imageB, imageC, imageD, imageE
                                        FROM mycase, users
                                        WHERE mycase.userID = users.userID AND mycase.caseID = ?', [$mycaseID]);
           }

           return response()->json($caseResult);
       } catch (\Exception $e) {
           return response()->json(['error' => '呼叫存儲過程失敗']);
       }


   }

}
