import GIF from "gif.js";
import {
  Input,
  Output,
  Conversion,
  ALL_FORMATS,
  BlobSource,
  BufferTarget,
  Mp4OutputFormat,
  WebMOutputFormat,
  WavOutputFormat,
  OggOutputFormat,
  FlacOutputFormat,
  QUALITY_HIGH,
  QUALITY_MEDIUM,
  QUALITY_LOW,
  type ConversionOptions as MediabunnyConversionOptions
} from "mediabunny";
import { ConversionOptions } from "../types/video";

export const convertToGif = async (
  file: File,
  options: ConversionOptions,
  setProgress: (progress: number) => void
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Canvas context を取得できませんでした"));
      return;
    }

    video.src = URL.createObjectURL(file);
    video.muted = true;

    video.addEventListener("loadedmetadata", () => {
      // キャンバスサイズを設定（ユーザー指定の解像度を使用）
      const targetWidth = options.width || video.videoWidth;
      const targetHeight = options.height || video.videoHeight;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const gif = new GIF({
        workers: 2,
        quality: options.quality || 10,
        width: targetWidth,
        height: targetHeight,
        workerScript: "/gif.worker.js",
      });

      const fps = options.fps || 10;
      const frameDelay = 1000 / fps;
      const duration = Math.min(video.duration, 10); // 最大10秒に制限
      const totalFrames = Math.floor(duration * fps);
      let currentFrame = 0;
      let isRendering = false;

      // GIFのイベントリスナーを一度だけ設定
      gif.on("finished", (blob: Blob) => {
        URL.revokeObjectURL(video.src);
        resolve(blob);
      });

      gif.on("progress", (p: number) => {
        setProgress(Math.floor(50 + p * 50)); // 後半50%はレンダリング
      });

      const captureFrame = () => {
        if (currentFrame >= totalFrames) {
          // すべてのフレームをキャプチャしたらGIFをレンダリング
          if (!isRendering) {
            isRendering = true;
            gif.render();
          }
          return;
        }

        video.currentTime = currentFrame / fps;
        currentFrame++;
      };

      // seekedイベントリスナーを一度だけ設定
      video.addEventListener("seeked", () => {
        if (currentFrame <= totalFrames) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          gif.addFrame(ctx, { delay: frameDelay, copy: true });

          setProgress(Math.floor((currentFrame / totalFrames) * 50)); // 前半50%はフレームキャプチャ

          // 次のフレームをキャプチャ
          setTimeout(captureFrame, 10);
        }
      });

      video.addEventListener("canplay", () => {
        captureFrame();
      });
    });

    video.addEventListener("error", () => {
      reject(new Error("動画の読み込みに失敗しました"));
    });
  });
};

export const processVideo = async (
  buffer: ArrayBuffer,
  options: ConversionOptions,
  setProgress: (progress: number) => void
): Promise<ArrayBuffer> => {
  try {
    // mediabunnyを使用した実装
    const result = await processVideoWithMediabunny(buffer, options, setProgress);
    return result;
  } catch (error) {
    console.error('Video processing error:', error);
    // エラーの場合は元のファイルを返す
    return buffer;
  }
};

// mediabunnyを使用した実装
const processVideoWithMediabunny = async (
  buffer: ArrayBuffer,
  options: ConversionOptions,
  setProgress: (progress: number) => void
): Promise<ArrayBuffer> => {
  try {
    // 入力ファイルを設定
    const inputBlob = new Blob([buffer]);
    const input = new Input({
      formats: ALL_FORMATS,
      source: new BlobSource(inputBlob),
    });

    // 出力形式を決定
    let outputFormat;
    if (options.codec === 'gif') {
      // GIFの場合は既存の実装を使用
      throw new Error('GIF conversion should use convertToGif function');
    } else if (['wav', 'pcm'].includes(options.codec)) {
      // WAV format
      outputFormat = new WavOutputFormat();
    } else if (['ogg', 'vorbis'].includes(options.codec)) {
      // OGG format for Vorbis
      outputFormat = new OggOutputFormat();
    } else if (options.codec === 'flac') {
      // FLAC format
      outputFormat = new FlacOutputFormat();
    } else if (['vp8', 'vp9', 'av1-webm', 'opus'].includes(options.codec)) {
      // WebM format for VP8, VP9, AV1-WebM, Opus
      outputFormat = new WebMOutputFormat();
    } else if (options.codec === 'adts') {
      // ADTS format - use MP4 container for AAC
      outputFormat = new Mp4OutputFormat();
    } else {
      // Default to MP4 for avc, hevc, av1-mp4, aac, mp3
      outputFormat = new Mp4OutputFormat();
    }

    // 出力設定
    const output = new Output({
      format: outputFormat,
      target: new BufferTarget(),
    });

    // 品質設定をmediabunnyの形式に変換
    let qualityLevel = QUALITY_MEDIUM;
    if (options.bitrate) {
      if (options.bitrate >= 5000000) {
        qualityLevel = QUALITY_HIGH;
      } else if (options.bitrate <= 1000000) {
        qualityLevel = QUALITY_LOW;
      }
    }

    // 変換設定を構築
    const conversionConfig: MediabunnyConversionOptions = {
      input,
      output,
    };

    // 動画設定（動画コーデックの場合）
    const videoCodecs = ['avc', 'hevc', 'vp8', 'vp9', 'av1-mp4', 'av1-webm'];
    if (videoCodecs.includes(options.codec) && (options.width || options.height || options.bitrate)) {
      const videoConfig: {
        width?: number;
        height?: number;
        bitrate?: number;
        codec?: "avc" | "hevc" | "vp9" | "av1" | "vp8";
        fit?: "contain" | "cover" | "fill";
      } = {};

      if (options.width) {
        videoConfig.width = options.width;
      }
      if (options.height) {
        videoConfig.height = options.height;
      }

      // widthとheightの両方が指定されている場合はfitオプションを追加
      if (options.width && options.height) {
        videoConfig.fit = "contain"; // アスペクト比を維持しながらリサイズ
      }

      if (options.bitrate) {
        videoConfig.bitrate = options.bitrate;
      }

      // コーデック設定
      if (options.codec === 'av1-mp4' || options.codec === 'av1-webm') {
        videoConfig.codec = 'av1';
      } else {
        videoConfig.codec = options.codec as "avc" | "hevc" | "vp9" | "vp8";
      }

      conversionConfig.video = videoConfig;
    }

    // 音声設定（音声コーデックの場合）
    const audioCodecs = ['aac', 'mp3', 'opus', 'vorbis', 'flac', 'pcm', 'wav', 'ogg', 'adts'];
    if (audioCodecs.includes(options.codec)) {
      const audioConfig: {
        bitrate?: number;
        codec?: "aac" | "mp3" | "opus" | "vorbis" | "flac" | "pcm-s16";
      } = {};

      if (options.bitrate) {
        audioConfig.bitrate = options.bitrate;
      }

      // PCMの場合は具体的なフォーマットを指定
      if (options.codec === 'pcm') {
        audioConfig.codec = 'pcm-s16';
      } else {
        audioConfig.codec = options.codec as "aac" | "mp3" | "opus" | "vorbis" | "flac";
      }

      conversionConfig.audio = audioConfig;
    }

    // 変換を初期化
    const conversion = await Conversion.init(conversionConfig);

    // プログレスコールバックを設定
    conversion.onProgress = (progress: number) => {
      setProgress(Math.floor(progress * 100));
    };

    // 変換を実行
    await conversion.execute();

    // 結果を取得
    const result = output.target.buffer;
    if (!result) {
      throw new Error('変換結果が取得できませんでした');
    }

    return result;

  } catch (error) {
    console.error('Mediabunny processing error:', error);
    throw error;
  }
};


export const downloadConvertedVideo = (convertedBlob: Blob, codec: string) => {
  const url = URL.createObjectURL(convertedBlob);
  const a = document.createElement("a");
  a.href = url;

  let extension = "mp4";
  let filename = "converted_media";

  // 拡張子とファイル名を決定
  switch (codec) {
    case "gif":
      extension = "gif";
      filename = "converted_animation";
      break;
    case "vp8":
    case "vp9":
    case "av1-webm":
    case "opus":
      extension = "webm";
      filename = "converted_video";
      break;
    case "vorbis":
    case "ogg":
      extension = "ogg";
      filename = "converted_audio";
      break;
    case "mp3":
      extension = "mp3";
      filename = "converted_audio";
      break;
    case "flac":
      extension = "flac";
      filename = "converted_audio";
      break;
    case "wav":
    case "pcm":
      extension = "wav";
      filename = "converted_audio";
      break;
    case "adts":
      extension = "aac";
      filename = "converted_audio";
      break;
    case "aac":
      extension = "m4a";
      filename = "converted_audio";
      break;
    case "avc":
    case "hevc":
    case "av1-mp4":
    default:
      extension = "mp4";
      filename = "converted_video";
      break;
  }

  a.download = `${filename}.${extension}`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
