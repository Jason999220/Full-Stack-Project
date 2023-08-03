<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class InformationController extends Controller
{
    //進入我的帳戶
    public function enterProfile($token)
    {
        // $token = $request->token;
        $result = DB::select("CALL enterProfile(?)", [$token]);
        // return $token;
        $filesName = $result[0]->portfolio;
        $filesArray = explode(',', $filesName);
        // return $filesArray;
        // return base64_encode(Storage::get($filesArray[0]));
        $filesObject = [];
        
        for($i = 0; $i < count($filesArray); $i++) {
            array_push($filesObject, base64_encode(Storage::get($filesArray[$i])));
        }
        $result[0]->portfolio = $filesObject;
        $filesNameArray = [];
        for($i = 0; $i < count($filesArray); $i++){
            $fileName = substr($filesArray[$i], 6);
            array_push($filesNameArray, $fileName);
        }
        if ($result[0]->profilePhoto){
            $file = $result[0]->profilePhoto;
            $Photo = Storage::get($file);
            $result[0]->profilePhoto = base64_encode($Photo);
        } else {
            $Photo = Storage::get('upload/images.jpeg');
            $result[0]->profilePhoto = base64_encode($Photo);
        }

        return [
            'message' => $result,
            'filesNameArray' => $filesNameArray
        ];
    }

    //修改大頭照
    public function uploadPhoto(Request $request)
    {
        if ($request->hasFile('photo')) {
            $image = $request->file('photo');
            $filename = $image->store('documents');
        } else {
            // 使用默認圖片，路徑 public/upload/images.jpg
            $filename = 'upload/image.jpg';
        }

        $userID = $request->userID;
        $file = DB::select("CALL newPhoto(?, ?)", [$userID, $filename])[0]->profilePhoto;
        $newPhoto = Storage::get($file);
        // return $file;
        return response()->json(['profilePhoto' => base64_encode($newPhoto)]);
    }


    // 修改姓名
    public function updateUser($myUserID, $myUserName)
    {
        // return $myUserName;
        try {
            $result = DB::select('CALL newUserName(?, ?)', [$myUserID, $myUserName]);
            return response()->json(['result' => '修改姓名成功']);
        } catch (\Exception $e) {
            return response()->json(['result' => '修改姓名失败']);
        }
    }

    //修改密碼
    public function checkOldPassword(Request $request)
    {
        // return gettype($request['myOldPassword']);

        $myUserID = $request['myUserID'];
        $myNewPassword = $request['myNewPassword'];
        $myOldPassword = (string)$request['myOldPassword'];
        $newHashpassword = Hash::make($myNewPassword);
        // return $newHashpassword;
        $oldHashPassword = DB::select("select hashpassword from users where userID = '$myUserID'")[0]->hashpassword;
        // return $hashPassword;
        // return Hash::check($myOldPassword, $oldHashPassword);
        if (Hash::check($myOldPassword, $oldHashPassword)) {
            // return '123';
            return DB::select("call newHashpassword('$myUserID', '$newHashpassword')")[0]->result;
        } else {
            return '原密碼錯誤';
        }




    }

    //修改電話
    public function updatePhone(Request $request)
    {
        $myuserID = $request['myUserID'];
        $myphone = $request['myPhone'];
        // return $myphone;
        $result = DB::select("CALL newPhone(?, ?)", [$myuserID, $myphone]);
        return response()->json(['result' => $result, 'phone' => $myphone]);
    }

    // 修改信箱
    public function updateEmail($myuserID, $myemail)
    {
        try {
            DB::select("CALL newEmail(?, ?)", [$myuserID, $myemail]);

            return response()->json(['result' => '修改信箱成功']);
        } catch (\Exception $e) {
            return response()->json(['result' => '修改信箱失败']);
        }
    }

    //修改學經歷
    public function updateExperience(Request $request)
    {
        // return '123';
        $myuserID = $request['myUserID'];
        $myEucation = $request['myExperience'];
        $result = DB::select("CALL newEducation(?, ?)", [$myuserID, $myEucation]);
        return response()->json(['result' => $result, 'experience' => $myEucation]);
    }

    //修改作品集
    public function updatePortfolio(Request $request)
    {
        // return count($request->file('myPortfolio'));
        if (!$request->file('myPortfolio')){
            return response()->json(['result' => '未選擇檔案', 'files' => [], 'fileName' => []]);;
        }
        $file = $request->file('myPortfolio');
        // return $file;
        $userID = $request->myUserID;
        $allFileName = '"files/';
        $filesNameArray = [];
        for($i = 0; $i < count($file); $i++){
            $fileName = $file[$i]->getClientOriginalName();
            $file[$i]->storeAs('files', $fileName);
            $allFileName .= (string)$fileName . ",files/";
            array_push($filesNameArray, $fileName);
        }
        $allFileName = substr($allFileName, 0, -7) . '"';
        $result = DB::select("CALL newPortfolio($userID, $allFileName)")[0]->result;
        $filesName = DB::select("select portfolio from myresume where userID = $userID")[0]->portfolio;
        $filesArray = explode(',', $filesName);
        // return $filesArray;
        // return base64_encode(Storage::get($filesArray[0]));
        $filesObject = [];
        
        for($i = 0; $i < count($file); $i++) {
            array_push($filesObject, base64_encode(Storage::get($filesArray[$i])));
        }
        return response()->json(['result' => $result, 'files' => $filesObject, 'fileName' => $filesNameArray]);
    }

    // 更新擅長工具
    public function updateSkills(Request $request)
    {
        // return '123';
        $myUserID = $request['myUserID'];
        $mySkills = $request['mySkills'];

        $result = DB::select("CALL newSoftwore(?, ?)", [$myUserID, $mySkills])[0]->result;
        $Skills = DB::select("select softwore from myresume where userID = $myUserID")[0]->softwore;
        return response()->json(['result' => $result, 'skills' => $Skills]);
    }


    // 更新自傳
    public function updateSelfIntroduction(Request $request)
    {
        $myUserID = $request['myUserID'];
        $mySelfIntroduction = $request['mySelfIntroduction'];
        $result = DB::select("CALL newSelfIntroduction(?, ?)", [$myUserID, $mySelfIntroduction])[0]->result;
        $SelfIntroduction = DB::select("select selfIntroduction from myresume where userID = $myUserID")[0]->selfIntroduction;
        return response()->json(['result' => $result, 'SelfIntroduction' => $SelfIntroduction]);
    }



    // 提案紀錄
    public function getProposeCase(Request $request)
    {
        $userID = (int)$request['userID'];
        $caseStatus = $request['caseStatus'];
        $page = (int)$request['page'];
        $results = DB::select("CALL proposeCase(?, ?,?)", [$userID, $caseStatus,$page]);
        return $results;
    }

    // 接案紀錄
    public function getBidderCase(Request $request)
    {
        $userID = (int)$request['userID'];
        $caseStatus = $request['caseStatus'];
        $results = DB::select("CALL enterBidderCase(?, ?)", [$userID, $caseStatus]);
        return $results;
    }

    // 刪除案件
    public function deleteCase(Request $request)
    {
        $caseID = (int)$request['caseID'];
        $results = DB::select("CALL delCase(?)", [$caseID]);
        return $results;
    }

    // 下架案件
    public function cancelCase(Request $request)
    {
        $caseID = (int)$request['caseID'];
        $results = DB::select("CALL cancelCase(?)", [$caseID]);
        return $results;
    }

    // 修改案件
    public function caseRevise(Request $request)
    {
        $caseID = (int)$request['caseID'];
        $results = DB::select("CALL caseRevise(?)", [$caseID]);
        return $results;
    }

    //提案進度條
    public function enterCaseStepClient(Request $request)
    {
        $userID = $request['userID'];
        $page = $request['page'];
        // return $caseID;
        $result = DB::select("CALL enterCaseStepClient(?, ?)", [$userID, $page]);
        return $result;
    }
}