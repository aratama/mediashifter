"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ConversionOptions, Dimensions } from "./types/video";
import FileSelect from "./components/FileSelect";
import ConversionSettings from "./components/ConversionSettings";
import ConvertedPreview from "./components/ConvertedPreview";
import NoticesSection from "./components/NoticesSection";
import {
  convertToGif,
  processVideo,
  downloadConvertedVideo,
} from "./utils/videoConverter";

export default function VideoConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isConverting, setIsConverting] = useState(false);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string>("");
  const [originalDimensions, setOriginalDimensions] =
    useState<Dimensions | null>(null);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [convertedUrl, setConvertedUrl] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement>(null);

  const [conversionOptions, setConversionOptions] = useState<ConversionOptions>(
    {
      codec: "gif",
      bitrate: 1000000,
      fps: 10,
      quality: 10,
      width: undefined,
      height: undefined,
    }
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("video/")) {
        setSelectedFile(file);
        setError("");

        // プレビュー用のURLを作成
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        // 変換済みファイルをクリア
        setConvertedBlob(null);
        // 変換済みURLをクリア
        if (convertedUrl) {
          URL.revokeObjectURL(convertedUrl);
          setConvertedUrl("");
        }

        // 動画の元の解像度を取得
        const video = document.createElement("video");
        video.src = url;
        video.addEventListener("loadedmetadata", () => {
          setOriginalDimensions({
            width: video.videoWidth,
            height: video.videoHeight,
          });
          // デフォルトの解像度を元の動画と同じに設定
          setConversionOptions((prev) => ({
            ...prev,
            width: video.videoWidth,
            height: video.videoHeight,
          }));
        });
      } else {
        setError("動画ファイルを選択してください");
      }
    },
    [previewUrl, convertedUrl]
  );

  const convertVideo = useCallback(async () => {
    if (!selectedFile) {
      setError("ファイルが選択されていません");
      return;
    }

    // GIF変換の場合は別処理
    if (conversionOptions.codec === "gif") {
      setIsConverting(true);
      setProgress(0);
      setError("");

      try {
        const blob = await convertToGif(
          selectedFile,
          conversionOptions,
          setProgress
        );
        setConvertedBlob(blob);

        // 変換後のプレビューURL作成
        if (convertedUrl) {
          URL.revokeObjectURL(convertedUrl);
        }
        const url = URL.createObjectURL(blob);
        setConvertedUrl(url);
      } catch (err) {
        setError(
          `変換エラー: ${err instanceof Error ? err.message : "不明なエラー"}`
        );
      } finally {
        setIsConverting(false);
        setProgress(0);
      }
      return;
    }

    // WebCodecs APIの対応確認
    if (!("VideoEncoder" in window) || !("VideoDecoder" in window)) {
      setError("お使いのブラウザはWebCodecs APIに対応していません");
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setError("");

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const convertedBuffer = await processVideo(
        arrayBuffer,
        conversionOptions,
        setProgress
      );

      const mimeType = conversionOptions.codec.startsWith("vp")
        ? "video/webm"
        : "video/mp4";
      const blob = new Blob([convertedBuffer], { type: mimeType });
      setConvertedBlob(blob);

      // 変換後のプレビューURL作成
      if (convertedUrl) {
        URL.revokeObjectURL(convertedUrl);
      }
      const url = URL.createObjectURL(blob);
      setConvertedUrl(url);
    } catch (err) {
      setError(
        `変換エラー: ${err instanceof Error ? err.message : "不明なエラー"}`
      );
    } finally {
      setIsConverting(false);
      setProgress(0);
    }
  }, [selectedFile, conversionOptions, convertedUrl]);

  const handleDownload = useCallback(() => {
    if (!convertedBlob) return;
    downloadConvertedVideo(convertedBlob, conversionOptions.codec);
  }, [convertedBlob, conversionOptions.codec]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      if (convertedUrl) {
        URL.revokeObjectURL(convertedUrl);
      }
    };
  }, [previewUrl, convertedUrl]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          動画変換アプリ
        </h1>

        <FileSelect
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          originalDimensions={originalDimensions}
          videoRef={videoRef}
          onFileSelect={handleFileSelect}
        />

        <ConversionSettings
          conversionOptions={conversionOptions}
          originalDimensions={originalDimensions}
          maintainAspectRatio={maintainAspectRatio}
          isConverting={isConverting}
          selectedFile={selectedFile}
          progress={progress}
          error={error}
          onOptionsChange={setConversionOptions}
          onAspectRatioChange={setMaintainAspectRatio}
          onConvert={convertVideo}
        />

        <ConvertedPreview
          convertedBlob={convertedBlob}
          convertedUrl={convertedUrl}
          conversionOptions={conversionOptions}
          onDownload={handleDownload}
        />

        <NoticesSection />
      </div>
    </div>
  );
}
