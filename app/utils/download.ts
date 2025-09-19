import { Codec } from "../types/video";

export const downloadConvertedVideo = (convertedBlob: Blob, codec: Codec) => {
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
