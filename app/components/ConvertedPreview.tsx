"use client";

import { useRef } from "react";
import Image from "next/image";
import { ConversionOptions } from "../types/video";

interface ConvertedPreviewProps {
  convertedBlob: Blob | null;
  convertedUrl: string;
  conversionOptions: ConversionOptions;
  onDownload: () => void;
}

export default function ConvertedPreview({
  convertedBlob,
  convertedUrl,
  conversionOptions,
  onDownload,
}: ConvertedPreviewProps) {
  const convertedVideoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        変換後の動画プレビュー
      </h2>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">変換後のファイルサイズ:</span>
          <span className="font-semibold text-gray-900">
            {convertedBlob ? (
              convertedBlob.size < 1024 * 1024 ? (
                `${(convertedBlob.size / 1024).toFixed(2)} KB`
              ) : (
                `${(convertedBlob.size / 1024 / 1024).toFixed(2)} MB`
              )
            ) : (
              <span className="text-gray-400">---</span>
            )}
          </span>
        </div>
      </div>

      <div
        className="w-full max-w-2xl mx-auto flex items-center justify-center bg-gray-100 rounded-lg mt-4"
        style={{ height: "400px" }}
      >
        {convertedUrl ? (
          conversionOptions.codec === "gif" ? (
            // GIFの場合はImageコンポーネントで表示
            <Image
              src={convertedUrl}
              alt="変換後のGIF"
              width={800}
              height={400}
              className="max-w-full max-h-full rounded-lg"
              style={{ objectFit: "contain" }}
            />
          ) : (
            // 動画の場合はvideoタグで表示
            <video
              ref={convertedVideoRef}
              src={convertedUrl}
              controls
              className="max-w-full max-h-full rounded-lg"
              style={{ objectFit: "contain" }}
            >
              お使いのブラウザは動画の再生に対応していません。
            </video>
          )
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p className="text-gray-500">変換後の動画がここに表示されます</p>
          </div>
        )}
      </div>

      <button
        onClick={onDownload}
        disabled={!convertedBlob}
        className={`w-full mt-4 py-3 px-6 rounded-lg font-semibold transition-colors ${
          convertedBlob
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        変換済み動画をダウンロード
      </button>
    </div>
  );
}
