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
  { value: "avc1.42E01E", label: "H.264 (MP4)" },
  { value: "vp8", label: "VP8 (WebM)" },
  { value: "vp09.00.10.08", label: "VP9 (WebM)" },
];
