<script setup lang="ts">
import { computed } from 'vue';
import { Track, useMusicPlayer } from './useMusicPlayer';

const props = defineProps<{
  playlist: Track[];
}>();

const {
  currentTrack,
  isLoading,
  isPlaying,
  isPaused,
  trackDuration,
  currentTime,
  progress,
  showPlaylist,
  currentTrackIndex,
  playIndex,
  play,
  pause,
  skip,
  togglePlaylist,
} = useMusicPlayer(props.playlist);
const formatTime = (secs: number): string => {
  const minutes = Math.floor(secs / 60) || 0;
  const seconds = (secs - minutes * 60) || 0;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const trackText = computed(() => {
  return currentTrack.value?.title;
});
const timerText = computed(() => {
  if (!currentTime.value) return;
  return formatTime(Math.floor(currentTime.value));
});

const durationText = computed(() => {
  if (!trackDuration.value) return;
  return formatTime(Math.floor(trackDuration.value));
});
const progressText = computed(() => {
  return `${Math.floor(progress.value)}%`;
});

</script>

<template>
  <div>
    <code style="text-align: left">
      <pre>{{
        JSON.stringify({
          isLoading,
          isPlaying,
          isPaused,
          trackText,
          timerText,
          durationText,
          progressText,
        },
          null,
          4
        )
      }}</pre>
    </code>

    <div class="controlsInner">
      <button @click="playIndex()">Play Index</button>
      <button @click="play()">Play</button>
      <button @click="pause()">Pause</button>
      <button @click="skip('prev')">Prev</button>
      <button @click="skip('next')">Next</button>
      <button @click="togglePlaylist()">Toggle Playlist</button>
    </div>

    <div v-if="showPlaylist">
      <div v-for="(track, index) in playlist" :key="index" @click="playIndex(index)">
        <span v-if="currentTrackIndex === index">*</span>
        {{ track.title }}
      </div>
    </div>

  </div>
</template>
