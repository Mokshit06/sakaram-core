import { TrackballControls } from '@react-three/drei';
import create from 'zustand';
import { persist, devtools } from 'zustand/middleware';

type Track = {
  // id: string;
  url: string;
  name: string;
  // in ms
  duration: number;
  image: string;
  artist: {
    name: string;
  };
};

type MusicState = {
  isPlaying: boolean;
  setPlaying: (playing: boolean) => void;
  togglePlaying: () => void;
  currentTrackIndex: number;
  setCurrentTrackIndex: (currentTrackIndex: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  currentTime: number;
  setCurrentTime: (currentTime: number) => void;
  tracks: Track[];
};

const useMusic = create<MusicState>(
  devtools(
    persist(
      set => ({
        isPlaying: false,
        setPlaying: playing => set({ isPlaying: playing }),
        togglePlaying: () => set(state => ({ isPlaying: !state.isPlaying })),
        currentTrackIndex: 0,
        nextTrack: () => {
          set(state => ({
            currentTrackIndex:
              state.currentTrackIndex === state.tracks.length - 1
                ? 0
                : state.currentTrackIndex + 1,
          }));
        },
        previousTrack: () =>
          set(state => ({
            currentTrackIndex:
              state.currentTrackIndex === 0
                ? state.tracks.length - 1
                : state.currentTrackIndex - 1,
          })),
        setCurrentTrackIndex: currentTrackIndex => set({ currentTrackIndex }),
        currentTime: 0,
        setCurrentTime: currentTime => set({ currentTime }),
        tracks: [
          {
            artist: { name: 'Tamino' },
            duration: 196226,
            image:
              'https://i.scdn.co/image/ab67616d00004851225a21d90651e86f8cee6b19',
            name: 'Crocodile',
            url: '',
          },
          {
            artist: { name: 'Tamino' },
            duration: 196226,
            image:
              'https://i.scdn.co/image/ab67616d00004851225a21d90651e86f8cee6b19',
            name: 'Second song',
            url: '',
          },
        ],
      }),
      {
        name: 'sakaram-music',
        blacklist: ['tracks', 'isPlaying'],
      }
    )
  )
);

export default useMusic;
