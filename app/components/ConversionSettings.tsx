"use client";

import { ConversionOptions, Dimensions, supportedCodecs } from "../types/video";

interface ConversionSettingsProps {
  conversionOptions: ConversionOptions;
  originalDimensions: Dimensions | null;
  maintainAspectRatio: boolean;
  isConverting: boolean;
  selectedFile: File | null;
  progress: number;
  error: string;
  onOptionsChange: (options: ConversionOptions) => void;
  onAspectRatioChange: (maintain: boolean) => void;
  onConvert: () => void;
}

export default function ConversionSettings({
  conversionOptions,
  originalDimensions,
  maintainAspectRatio,
  isConverting,
  selectedFile,
  progress,
  error,
  onOptionsChange,
  onAspectRatioChange,
  onConvert,
}: ConversionSettingsProps) {
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = e.target.value ? parseInt(e.target.value) : undefined;

    const updates: Partial<ConversionOptions> = {
      width: newWidth,
    };

    // アスペクト比を維持する場合、高さを自動計算
    if (maintainAspectRatio && originalDimensions && newWidth) {
      const aspectRatio = originalDimensions.height / originalDimensions.width;
      updates.height = Math.round(newWidth * aspectRatio);
    }

    onOptionsChange({ ...conversionOptions, ...updates });
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = e.target.value ? parseInt(e.target.value) : undefined;

    const updates: Partial<ConversionOptions> = {
      height: newHeight,
    };

    // アスペクト比を維持する場合、幅を自動計算
    if (maintainAspectRatio && originalDimensions && newHeight) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      updates.width = Math.round(newHeight * aspectRatio);
    }

    onOptionsChange({ ...conversionOptions, ...updates });
  };

  const isVideoCodec = supportedCodecs
    .filter((codec) =>
      [
        "avc",
        "hevc",
        "vp8",
        "vp9",
        "av1-mp4",
        "av1-webm",
      ].includes(codec.value)
    )
    .map((codec) => codec.value)
    .includes(conversionOptions.codec);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">変換設定</h2>

      <div className="mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={maintainAspectRatio}
            onChange={(e) => onAspectRatioChange(e.target.checked)}
            className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="text-sm font-medium text-gray-700">
            アスペクト比を固定
          </span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            出力形式
          </label>
          <select
            value={conversionOptions.codec}
            onChange={(e) =>
              onOptionsChange({
                ...conversionOptions,
                codec: e.target.value,
              })
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          >
            <optgroup label="画像">
              <option value="gif">アニメーションGIF</option>
            </optgroup>
            <optgroup label="動画">
              <option value="avc">H.264 (MP4)</option>
              <option value="hevc">H.265 (MP4)</option>
              <option value="vp8">VP8 (WebM)</option>
              <option value="vp9">VP9 (WebM)</option>
              <option value="av1-mp4">AV1 (MP4)</option>
              <option value="av1-webm">AV1 (WebM)</option>
            </optgroup>
            <optgroup label="音声">
              <option value="aac">AAC (MP4)</option>
              <option value="mp3">MP3</option>
              <option value="opus">Opus (WebM)</option>
              <option value="vorbis">Vorbis (Ogg)</option>
              <option value="flac">FLAC</option>
              <option value="pcm">PCM (WAV)</option>
              <option value="wav">WAV</option>
              <option value="ogg">OGG</option>
              <option value="adts">ADTS</option>
            </optgroup>
          </select>
        </div>

        <div></div>

        {isVideoCodec && <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            幅 (px)
          </label>
          <input
            type="number"
            value={conversionOptions.width || ""}
            onChange={handleWidthChange}
            placeholder={
              originalDimensions ? `${originalDimensions.width}` : "自動"
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>}

        {isVideoCodec && <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            高さ (px)
          </label>
          <input
            type="number"
            value={conversionOptions.height || ""}
            onChange={handleHeightChange}
            placeholder={
              originalDimensions ? `${originalDimensions.height}` : "自動"
            }
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
          />
        </div>}

        {conversionOptions.codec === "gif" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              フレームレート (fps)
            </label>
            <select
              value={conversionOptions.fps}
              onChange={(e) =>
                onOptionsChange({
                  ...conversionOptions,
                  fps: parseInt(e.target.value),
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value={5}>5 fps</option>
              <option value={10}>10 fps</option>
              <option value={15}>15 fps</option>
              <option value={20}>20 fps</option>
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ビットレート (bps)
            </label>
            <select
              value={conversionOptions.bitrate}
              onChange={(e) =>
                onOptionsChange({
                  ...conversionOptions,
                  bitrate: parseInt(e.target.value),
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value={500000}>500 Kbps</option>
              <option value={1000000}>1 Mbps</option>
              <option value={2000000}>2 Mbps</option>
              <option value={5000000}>5 Mbps</option>
            </select>
          </div>
        )}

        {conversionOptions.codec === "gif" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              品質 (低いほど高品質)
            </label>
            <select
              value={conversionOptions.quality}
              onChange={(e) =>
                onOptionsChange({
                  ...conversionOptions,
                  quality: parseInt(e.target.value),
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value={1}>最高品質</option>
              <option value={5}>高品質</option>
              <option value={10}>標準</option>
              <option value={20}>低品質</option>
            </select>
          </div>
        )}
      </div>

      <button
        onClick={onConvert}
        disabled={!selectedFile || isConverting}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mt-4"
      >
        {isConverting ? "変換中..." : "動画を変換"}
      </button>

      {error && <p className="text-red-700 mt-2">{error}</p>}

      <div className="mt-4" style={{ minHeight: "52px" }}>
        {isConverting ? (
          <>
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {progress}% 完了
            </p>
          </>
        ) : (
          <div className="h-full"></div>
        )}
      </div>
    </div>
  );
}
