import { ref, onUnmounted } from 'vue';
import { Howl } from 'howler';

export interface Track {
  title: string;
  url: string;
}


export function useMusicPlayer(_playlist: Track[]) {
  const playlist = ref(_playlist);
  const currentTrackIndex = ref(0);
  const currentTrack = ref(null as Track | null);
  const isPlaying = ref(false);
  const isPaused = ref(false);
  const isLoading = ref(false);
  const trackDuration = ref(null as number | null);
  const currentTime = ref(null as number | null);
  const progress = ref(0);
  const sound = ref(null as Howl | null);
  const showPlaylist = ref(false);

  const updateProgress = (): void => {
    if (sound.value && trackDuration.value && sound.value.playing()) {
      currentTime.value = sound.value.seek();
      progress.value = (currentTime.value / trackDuration.value) * 100;
      requestAnimationFrame(updateProgress);
    }
  };

  const playIndex = (index: number = currentTrackIndex.value): void => {
    const track = playlist.value[index];
    currentTrack.value = track;

    sound.value?.stop();

    const howl = new Howl({
      src: [
        track.url,
      ],
      html5: true,
      onplay: () => {
        trackDuration.value = Math.round(sound.value!.duration());
        updateProgress();
        isPlaying.value = true;
        isPaused.value = false;
        isLoading.value = false;
      },
      onload: () => {
        isLoading.value = true;
      },
      onend: () => {
        skip('next');
      },
      onpause: () => {
        isPlaying.value = false;
        isPaused.value = true;
      },
      onstop: () => {
        isPlaying.value = false;
        isPaused.value = false;
      },
      onseek: updateProgress,
    });

    howl.play();
    sound.value = howl;
    currentTrackIndex.value = index;
  };


  const pause = (): void => {
    if (sound.value) {
      sound.value.pause();
    }
  };
  const play = (): void => {
    if (sound.value) {
      if (sound.value.playing()) {
        return;
      }
      sound.value.play();
    }
  };

  const skip = (direction: 'next' | 'prev'): void => {
    let newIndex = currentTrackIndex.value;
    if (direction === 'next') {
      newIndex = (currentTrackIndex.value + 1) % playlist.value.length;
    } else if (direction === 'prev') {
      newIndex = (currentTrackIndex.value - 1 + playlist.value.length) % playlist.value.length;
    }
    playIndex(newIndex);
  };


  const togglePlaylist = (): void => {
    showPlaylist.value = !showPlaylist.value;
  };


  const seek = (percentage: number): void => {
    if (sound.value) {
      sound.value.seek(sound.value.duration() * percentage);
    }
  };


  onUnmounted(() => {
    sound.value?.stop();
  });

  return {
    sound,
    currentTrack,
    isPlaying,
    isPaused,
    isLoading,
    trackDuration,
    currentTime,
    progress,
    currentTrackIndex,
    showPlaylist,
    playIndex,
    pause,
    play,
    skip,
    togglePlaylist,
    seek,
  };
}
