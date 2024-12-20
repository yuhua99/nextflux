import { atom, map } from "nanostores";

export const activeAudio = atom(null);
export const audioState = map({
  paused: true,
  title: "",
  artist: "",
  artwork: "",
});

// 重置音频
export const resetAudio = () => {
  activeAudio.set(null);
  audioState.set({
    paused: true,
    title: "",
    artist: "",
    artwork: "",
  });
};
