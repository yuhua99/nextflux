import { atom } from "nanostores";

export const activeAudio = atom(null);
export const paused = atom(true);
export const title = atom("");
export const artist = atom("");
export const artwork = atom("");

// 重置音频
export const resetAudio = () => {
  activeAudio.set(null);
  paused.set(true);
  title.set("");
  artist.set("");
  artwork.set("");
};
