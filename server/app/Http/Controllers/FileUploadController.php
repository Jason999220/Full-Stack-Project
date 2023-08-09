<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class FileUploadController extends Controller
{
    public function upload(Request $request)
    {
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = Storage::disk('s3')->put('pieceofcases', $file, 'public'); // Upload to S3

            if ($path) {
                $fileUrl = Storage::disk('s3')->url($path); // Get the full file URL
                return response()->json(['url' => $fileUrl]);
            } else {
                return response()->json(['error' => 'Failed to upload']);
            }
        } else {
            return response()->json(['error' => 'No file provided']);
        }
    }
}
