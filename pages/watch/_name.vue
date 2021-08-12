<template>
  <div>
    <Header />
    <div class="container mx-auto">
      <div class="head text-2xl m-5 flex justify-start items-center">
        <h2>{{ anime.title }} <i class="fas fa-chevron-right text-sm"></i></h2>
      </div>
      <div class="player-block m-5 flex">
        <div class="player" :class="{ hidden: video == null }">
          <video controls :key="video">
            <source :src="video" type="video/mp4" />
          </video>
        </div>
        <div class="episode-block" :class="{ active: video != null }">
          <h2>Серии:</h2>
          <div
            v-for="(post, index) in anime.episodes"
            :key="index"
            class="episode"
            :class="{ active: nowInd == index }"
            @click="change(index, post.url, anime.title)"
          >
            {{ post.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/header.vue";

export default {
  async asyncData({ params, $axios }) {
    let anime = await $axios.$get(`/api/anime?${params.name}`);
    anime = JSON.parse(anime);
    return { anime };
  },
  head() {
    return {
      title: this.title,
    }
  },
  data() {
    return {
      Header,
      nowInd: -1,
      video: null,
      title: "Олсиор смотрит аниме"
    };
  },
  mounted() {},
  computed: {},
  methods: {
    change(ind, url, title) {
      this.nowInd = ind;
      this.video = url;
      this.title = title;
    },
  },
};
</script>

<style>
.player {
  width: 100%;
  height: 100%;
}

.episode-block {
  margin: 0;
}

.episode-block.active {
  margin-left: 20px;
}

.episode-block h2 {
  margin-left: 5px;
}

.episode {
  cursor: pointer;
  display: inline-block;
  padding: 5px 10px;
  background: #2b2b2b;
  border: 1px solid #2b2b2b;
  margin: 5px 5px;
  border-radius: 5px;
  transition: 0.3s ease;
}

.episode.active {
  border: 1px solid white;
}
</style>
