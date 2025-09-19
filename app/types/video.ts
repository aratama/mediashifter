export interface ConversionOptions {
  codec: string;
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
