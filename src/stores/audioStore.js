import { atom, map } from "nanostores";

export const activeAudio = atom(null);
export const audioState = map({
  paused: true,
  loading: false,
  title: "",
  artist: "",
  artwork: "",
  playbackRate: "1.0",
});

// 重置音频
export const resetAudio = () => {
  activeAudio.set(null);
  audioState.set({
    paused: true,
    loading: false,
    title: "",
    artist: "",
    artwork: "",
    playbackRate: "1.0",
  });
};
