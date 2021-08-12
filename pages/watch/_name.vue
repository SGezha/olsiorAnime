<template>
  <div>
    <Header />
    <div class="container mx-auto">
      <div class="head text-2xl m-5 flex justify-start items-center">
        <h2>{{ anime.title }} <i class="fas fa-chevron-right text-sm"></i></h2>
      </div>
      <div class="player-block m-5 lg:flex">
        <div class="player" :class="{ hidden: video == null }">
          <video controls :key="video">
            <source :src="video" type="video/mp4" />
          </video>
        </div>
        <div class="episode-block" :class="{ active: video != null }">
          <h2>Серии:</h2>
          <div class="episode-scroll" :class="{ active: video != null }">
            <div
              v-for="(post, index) in anime.episodes"
              :key="index"
              class="episode"
              :class="{ active: nowInd == index }"
            >
              <span @click="change(index, post.url, anime.title)">{{
                post.title
              }}</span>
              <a :href="post.url" class="down"
                ><i class="fas fa-download"></i
              ></a>
            </div>
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
    let anime = await $axios.$get(`https://olsior.herokuapp.com/api/anime?${params.name}`);
    // let anime = await $axios.$get(`/api/anime?${params.name}`);
    anime = JSON.parse(anime);
    return { anime };
  },
  head() {
    return {
      title: this.title,
    };
  },
  data() {
    return {
      Header,
      nowInd: -1,
      video: null,
      title: "Олсиор смотрит аниме",
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
.down {
  margin-left: 5px;
}

.player {
  width: 100%;
  height: 100%;
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

.episode-block h2 {
  margin-left: 5px;
}

.episode-block {
  margin-left: -5px;
  margin-top: 10px;
}

.episode-scroll::-webkit-scrollbar {
  width: 2px;
  height: 2px;
}
.episode-scroll::-webkit-scrollbar-button {
  width: 0px;
  height: 0px;
}
.episode-scroll::-webkit-scrollbar-thumb {
  background: #e1e1e1;
  border: 0px none #ffffff;
  border-radius: 50px;
}
.episode-scroll::-webkit-scrollbar-thumb:hover {
  background: #ffffff;
}
.episode-scroll::-webkit-scrollbar-thumb:active {
  background: #000000;
}
.episode-scroll::-webkit-scrollbar-track {
  background: #666666;
  border: 0px none #ffffff;
  border-radius: 50px;
}
.episode-scroll::-webkit-scrollbar-track:hover {
  background: #666666;
}
.episode-scroll::-webkit-scrollbar-track:active {
  background: #333333;
}
.episode-scroll::-webkit-scrollbar-corner {
  background: transparent;
}

@media (min-width: 1024px) {
  .player {
    width: 100%;
    height: 725px;
  }

  .episode-scroll.active {
    overflow-y: auto;
    height: 410px;
  }

  .episode-block.active {
    position: relative;
    margin-left: 10px;
    max-width: 200px;
  }

  .episode-block {
    margin-left: -5px;
    margin-top: 0px;
  }
}

@media (min-width: 1280px) {
  .player {
    height: 559px;
  }

  .episode-scroll.active {
    height: 559px;
  }
}

@media (min-width: 1920px) {
  .player {
    height: 725px;
  }

  .episode-scroll.active {
    height: 700px;
  }
}
</style>
