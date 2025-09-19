import GIF from "gif.js";
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
  return new Promise((resolve) => {
    // 簡易的な変換処理のシミュレーション
    // 実際のWebCodecs APIを使った変換は非常に複雑なため、
    // ここではプログレス表示とファイル処理のデモを行います

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        // 元のファイルをそのまま返す（実際の変換の代わり）
        resolve(buffer);
      }
    }, 200);
  });
};

export const downloadConvertedVideo = (convertedBlob: Blob, codec: string) => {
  const url = URL.createObjectURL(convertedBlob);
  const a = document.createElement("a");
  a.href = url;

  let extension = "mp4";
  if (codec === "gif") {
    extension = "gif";
  } else if (codec.startsWith("vp")) {
    extension = "webm";
  }

  a.download = `converted_video.${extension}`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
