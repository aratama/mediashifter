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
import { Codec, ConversionOptions, isAudioCodec, isVideoCodec, } from "../types/video";

export const processVideo = async (buffer: ArrayBuffer, options: ConversionOptions, setProgress: (progress: number) => void): Promise<ArrayBuffer> => {
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

  // const isAudio = isAudioCodec(options.codec);
  // const isVideo = isVideoCodec(options.codec);

  // 変換設定を構築
  // const conversionConfig: MediabunnyConversionOptions = {
  //   input,
  //   output,
  //   video: {
  //     discard: isAudio, // 音声専用コーデックの場合は動画トラックを破棄
  //   },
  //   audio: {
  //     discard: isVideo, // 動画専用コーデックの場合は音声トラックを破棄
  //   }
  // };

  // if (isVideo) {
  //   const videoConfig: {
  //     width?: number;
  //     height?: number;
  //     bitrate?: number;
  //     codec?: "avc" | "hevc" | "vp9" | "av1" | "vp8";
  //     fit?: "contain" | "cover" | "fill";
  //   } = {};

  //   if (options.width) {
  //     videoConfig.width = options.width;
  //   }
  //   if (options.height) {
  //     videoConfig.height = options.height;
  //   }

  //   // widthとheightの両方が指定されている場合はfitオプションを追加
  //   if (options.width && options.height) {
  //     videoConfig.fit = "contain"; // アスペクト比を維持しながらリサイズ
  //   }

  //   if (options.bitrate) {
  //     videoConfig.bitrate = options.bitrate;
  //   }

  //   // コーデック設定
  //   if (options.codec === 'av1-mp4' || options.codec === 'av1-webm') {
  //     videoConfig.codec = 'av1';
  //   } else {
  //     videoConfig.codec = options.codec as "avc" | "hevc" | "vp9" | "vp8";
  //   }

  //   conversionConfig.video = videoConfig;
  // }

  // // 音声設定（音声コーデックの場合）
  // if (isAudio) {
  //   const audioConfig: {
  //     bitrate?: number;
  //     codec?: "aac" | "mp3" | "opus" | "vorbis" | "flac" | "pcm-s16";
  //   } = {};

  //   if (options.bitrate) {
  //     audioConfig.bitrate = options.bitrate;
  //   }

  //   // コーデック設定
  //   if (options.codec === 'pcm') {
  //     audioConfig.codec = 'pcm-s16';
  //   } else if (options.codec === 'ogg') {
  //     // OGGコンテナの場合はVorbisコーデックを使用
  //     audioConfig.codec = 'vorbis';
  //   } else if (options.codec === 'wav') {
  //     // WAVコンテナの場合はPCMコーデックを使用
  //     audioConfig.codec = 'pcm-s16';
  //   } else {
  //     audioConfig.codec = options.codec as "aac" | "mp3" | "opus" | "vorbis" | "flac";
  //   }

  //   conversionConfig.audio = audioConfig;

  //   // 音声専用の場合は動画トラックを除外（undefinedにして動画処理をスキップ）
  //   // conversionConfig.video は設定しない（undefinedのまま）
  // }

  const conversionConfig: MediabunnyConversionOptions = {
    input,
    output,
  };

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
};

