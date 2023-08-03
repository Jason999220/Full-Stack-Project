<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;


class ChatController extends Controller
{
    
    // 取得與該對象聊天訊息
    public function getMessage(Request $request)
    {
        $currentUserId =  (int)$request['currentUserId'];
        $chatUserId =  (int)$request['chatUserId'];
        $results = DB::select('CALL chat(?,?)',[$currentUserId,$chatUserId]);
        return $results;
    }

    // 取得所有聊過天的使用者資訊
    public function getChatOtherUser(Request $request)
    {
        $currentUserId =  (int)$request['currentUserId'];
        $results = DB::select('CALL chatUser(?)',[$currentUserId]);
        for ($i=0; $i < count($results); $i++) {
            if ($results[$i]->profilePhoto != null) {
                $newPhoto = Storage::get($results[$i]->profilePhoto);
                $results[$i]->profilePhoto = base64_encode($newPhoto);
            }
        }
        
        return $results;
    }

    // 將訊息儲存後端
    public function sendMessage(Request $request)
    {
        $fromID =  (int)$request['fromID'];
        $toID =  (int)$request['toID'];
        $message =  $request['message'];
        $image =  $request['image'];
        $results = DB::select('CALL sendMessage(?,?,?,?)',[$fromID,$toID,$message,$image]);
        return $results;
    }


}