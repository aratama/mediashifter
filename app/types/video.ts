export const supportedCodecs: SupportedCodec[] = [
  { value: "gif", label: "GIFアニメーション" },
  // Video formats
  { value: "avc", label: "H.264 (MP4)" },
  { value: "hevc", label: "H.265 (MP4)" },
  { value: "vp8", label: "VP8 (WebM)" },
  { value: "vp9", label: "VP9 (WebM)" },
  { value: "av1-mp4", label: "AV1 (MP4)" },
  { value: "av1-webm", label: "AV1 (WebM)" },
  // Audio formats
  { value: "aac", label: "AAC (MP4)" },
  { value: "mp3", label: "MP3" },
  { value: "opus", label: "Opus (WebM)" },
  { value: "vorbis", label: "Vorbis (Ogg)" },
  { value: "flac", label: "FLAC" },
  { value: "pcm", label: "PCM (WAV)" },
  // Container formats (for audio-only)
  { value: "wav", label: "WAV" },
  { value: "ogg", label: "OGG" },
  { value: "adts", label: "ADTS" },
];

export type Codec = typeof supportedCodecs[number]["value"];

export interface ConversionOptions {
  codec: Codec;
  bitrate: number;
  width?: number;
  height?: number;
  fps?: number; // GIF用のフレームレート
  quality?: number; // GIF用の品質
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface SupportedCodec {
  value: string;
  label: string;
}

export function isAudioCodec(codec: Codec): boolean {
  const audioCodecs = ['aac', 'mp3', 'opus', 'vorbis', 'flac', 'pcm', 'wav', 'ogg', 'adts'];
  return audioCodecs.includes(codec);
}

export function isVideoCodec(codec: Codec): boolean {
  const videoCodecs = ['avc', 'hevc', 'vp8', 'vp9', 'av1-mp4', 'av1-webm'];
  return videoCodecs.includes(codec);
}
