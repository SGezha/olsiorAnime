<template>
  <div>
    <Header />
    <div class="container mx-auto">
      <div class="head text-2xl m-5 flex justify-start items-center">
        <h2>{{ anime.title }} <i class="fas fa-chevron-right text-sm"></i></h2>
      </div>
      <div class="m-5">
        <div
          class="history"
          :class="{ active: video != null }"
          v-if="save.time != 0"
        >
          <h2>Вы остановились на</h2>
          <div class="oneepisode">
            <span
              @click="
                change(
                  save.id,
                  anime.episodes[save.id].url,
                  anime.episodes[save.id].title
                )
              "
              >{{ anime.episodes[save.id].title }} ({{
                formatTime(save.time)
              }})</span
            >
            <a :href="anime.episodes[save.id].url" class="down"
              ><i class="fas fa-download"></i
            ></a>
          </div>
        </div>
      </div>
      <div class="player-block m-5">
        <div class="player" :class="{ hidden: video == null }">
          <video ref="video" @loadeddata="loadedVideo" controls :key="video">
            <source :src="video" type="video/mp4" />
          </video>
        </div>
        <div class="episode-block" :class="{ active: video != null }">
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
      save: {
        id: 0,
        time: 0,
      },
      timer: null,
      needSave: false,
    };
  },
  mounted() {
    if (
      localStorage.getItem(`${window.location.href.split("/watch/")[1]}`) !=
      null
    ) {
      this.save = JSON.parse(
        localStorage.getItem(`${window.location.href.split("/watch/")[1]}`)
      );
      console.log(this.save);
    }
  },
  computed: {},
  methods: {
    change(ind, url, title) {
      clearInterval(this.timer);
      if (this.save.id == ind) this.needSave = true;
      this.nowInd = ind;
      this.video = url;
      this.title = title;
      this.timer = setInterval(() => {
        if (this.$refs.video.currentTime == undefined) return;
        if (this.$refs.video.currentTime == 0) return;
        localStorage.setItem(
          `${window.location.href.split("/watch/")[1]}`,
          JSON.stringify({
            time: this.$refs.video.currentTime,
            id: this.nowInd,
            volume: this.$refs.video.volume,
          })
        );
      }, 1000);
    },
    loadedVideo() {
      if (this.needSave) {
        this.$refs.video.currentTime = this.save.time;
        this.needSave;
      }
      this.$refs.video.volume = this.save.volume;
    },
    formatTime(duration) {
      // Hours, minutes and seconds
      var hrs = ~~(duration / 3600);
      var mins = ~~((duration % 3600) / 60);
      var secs = ~~duration % 60;

      // Output like "1:01" or "4:03:59" or "123:03:59"
      var ret = "";

      if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
      }

      ret += "" + mins + ":" + (secs < 10 ? "0" : "");
      ret += "" + secs;
      return ret;
    },
  },
};
</script>

<style>
.history {
  display: flex;
  align-items: center;
}

.history.active {
  display: none;
}

.down {
  margin-left: 5px;
}

.player {
  width: 100%;
  height: 100%;
}

.episode-block {
  margin-left: -5px;
  margin-top: 10px;
}

.episode-scroll {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

.episode {
  cursor: pointer;
  display: inline-block;
  padding: 5px 10px;
  background: #2b2b2b;
  border: 1px solid #2b2b2b;
  border-radius: 5px;
  transition: 0.3s ease;
  margin: 5px;
}

@media screen and (min-width: 768px) {
  .episode {
    width: calc((100% - 10px) / 4);
  }
}

@media screen and (min-width: 1280px) {
  .episode {
    width: calc((100% - 10px) / 6);
  }
}

@media screen and (min-width: 1920px) {
  .episode {
    width: calc((100% - 10px) / 9);
  }
}

.oneepisode {
  cursor: pointer;
  width: fit-content;
  padding: 5px 10px;
  background: #2b2b2b;
  border: 1px solid #2b2b2b;
  border-radius: 5px;
  transition: 0.3s ease;
  margin: 0px;
  margin-top: 5px;
  margin-left: 10px;
}

.episode.active {
  border: 1px solid white;
}

.episode-block h2 {
  margin-left: 5px;
  display: block;
  width: 100%;
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
</style>
