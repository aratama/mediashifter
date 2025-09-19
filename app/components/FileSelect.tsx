"use client";

import { useRef } from "react";
import { Dimensions } from "../types/video";

interface FileSelectProps {
  selectedFile: File | null;
  previewUrl: string;
  originalDimensions: Dimensions | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileSelect({
  selectedFile,
  previewUrl,
  originalDimensions,
  videoRef,
  onFileSelect,
}: FileSelectProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">ファイル選択</h2>

      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={onFileSelect}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />

      <div className="mt-2 text-sm text-gray-600" style={{ minHeight: "48px" }}>
        {selectedFile ? (
          <>
            <p>
              元のファイルのサイズ:  (
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
            {originalDimensions && (
              <p>
                元の解像度: {originalDimensions.width} x{" "}
                {originalDimensions.height} px
              </p>
            )}
          </>
        ) : (
          <p className="text-gray-400">ファイルが選択されていません</p>
        )}
      </div>

      <div
        className="w-full max-w-2xl mx-auto flex items-center justify-center bg-gray-100 rounded-lg"
        style={{ height: "400px" }}
      >
        {previewUrl ? (
          <video
            ref={videoRef}
            src={previewUrl}
            controls
            className="max-w-full max-h-full rounded-lg w-full h-full"
            style={{ objectFit: "contain" }}
          >
            お使いのブラウザは動画の再生に対応していません。
          </video>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-gray-500">
              動画を選択するとここにプレビューが表示されます
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
