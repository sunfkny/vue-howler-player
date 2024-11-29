<script setup lang="ts">
import { type Ref, ref } from 'vue';
import MusicPlayer from './components/MusicPlayer.vue';
import { Track } from './components/useMusicPlayer';

function getMusicUrl(name: string) {
  return `https://howlerjs.com/assets/howler.js/examples/player/audio/${name}.webm`;
}

const playlist: Ref<Track[]> = ref([
  { title: 'Rave Digger', url: getMusicUrl('rave_digger') },
  { title: '80s Vibe', url: getMusicUrl('80s_vibe') },
  { title: 'Running Out', url: getMusicUrl('running_out') }
]);

</script>

<template>
  <div>
    <MusicPlayer :playlist="playlist" />
  </div>
</template>

<style scoped></style>
