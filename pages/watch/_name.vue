<template>
  <div>
    <Header />
    <div class="container mx-auto">
      <div class="head text-2xl m-5 flex justify-start items-center">
        <h2>{{ anime.title }} <i class="fas fa-chevron-right text-sm"></i></h2>
      </div>
      <div class="m-5">
        <div class="chat-block" v-if="chat != ''">
          <div v-for="(msg, index) in parsedChat" :key="index" class="message">
            <span
              class="time"
              v-text="
                `[${msg.time.hours}:${msg.time.minutes}:${msg.time.seconds}]`
              "
            ></span>
            <span class="author" v-text="msg.author + ':'"></span>
            <span class="text" v-text="msg.text"></span>
          </div>
        </div>

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
          <video
            ref="video"
            class="video"
            @loadeddata="loadedVideo"
            controls
            :key="video"
          >
            <source :src="video" />
          </video>
        </div>
        <div class="episode-block" :class="{ active: video != null }">
          <div class="episode-scroll" :class="{ active: video != null }">
            <div
              v-for="(post, index) in anime.episodes"
              :key="index"
              class="episode"
              :class="{ active: nowInd == index }"
              @click="change(index, post.url, anime.title)"
            >
              <span>{{ post.title }}</span>
              <div class="right">
                <i class="fas fa-comment-alt" v-if="post.chat"></i>
                <a :href="post.url" class="down"
                  ><i class="fas fa-download"></i
                ></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="m-5" v-if="anime.arches">
        <div class="arches-block">
          <h2 class="text-xl">Список арок:</h2>
          <pre v-text="anime.arches.split('Арка ').join('')"></pre>
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
      chat: "",
      parsedChat: [],
      nowChat: [],
      nowTime: 0,
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
    async getChat() {
      const chat = await this.$axios.$get("/chat/bleach_110.txt");
      this.chat = chat;
      this.parseChat();
    },
    parseChat() {
      let timeStart;
      this.chat.split("\r\n").forEach((text, ind) => {
        if (ind == 0) {
          timeStart = new Date(
            `Mon Jan 01 2007 ${text.split(`[`)[1].split(":")[0]}:${
              text.split(`:`)[1].split(":")[0]
            }:${text.split(`:`)[2].split("]")[0]} GMT+0530`
          ).getTime();
          return;
        }
        if (text == "") return;
        let timeEnd = new Date(
          `Mon Jan 01 2007 ${text.split(`[`)[1].split(":")[0]}:${
            text.split(`:`)[1].split(":")[0]
          }:${text.split(`:`)[2].split("]")[0]} GMT+0530`
        ).getTime();
        let hourDiff = timeEnd - timeStart; //in ms
        let secDiff = hourDiff / 1000; //in s
        let minDiff = hourDiff / 60 / 1000; //in minutes
        let hDiff = hourDiff / 3600 / 1000; //in hours
        let result = {};
        result.hours = Math.floor(hDiff);
        result.minutes = Math.floor(minDiff - 60 * result.hours);
        result.seconds = secDiff - 60 * result.minutes;
        result.timesec = secDiff;
        this.parsedChat.push({
          time: result,
          author: text.split("] ")[1].split(":")[0],
          text: text.split("] ")[1].split(":")[1],
        });
      });
    },
    change(ind, url, title) {
      clearInterval(this.timer);
      if (this.save.id == ind) this.needSave = true;
      this.nowInd = ind;
      this.video = url;
      this.title = title;
      this.timer = setInterval(() => {
        if (this.$refs.video.currentTime == undefined) return;
        if (this.$refs.video.currentTime == 0) return;
        this.save = {
          time: this.$refs.video.currentTime,
          id: this.nowInd,
          volume: this.$refs.video.volume,
        };
        this.nowTime = parseInt(this.save.time.toString().split(".")[0]);
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
      if (this.$refs.video == undefined) return;
      if (this.save.time == 0) return;
      if (this.needSave) {
        this.$refs.video.currentTime = this.save.time;
        this.needSave = false;
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
.chat-block {
  overflow: auto;
  height: 400px;
}

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
  position: relative;
  width: 100%;
  height: 70vh;
}

.player .video {
  width: 100%;
  height: 70vh;
  background: black;
  /* z-index: -100; */
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
    display: flex;
    justify-content: space-between;
  }

  .episode span {
    display: inline-flex;
  }
}

@media screen and (min-width: 1280px) {
  .episode {
    width: calc((100% - 10px) / 6);
  }
}

@media screen and (min-width: 1920px) {
  .episode {
    width: calc((100% - 10px) / 7);
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

video::-webkit-media-controls-enclosure {
  padding: 0px;
  height: auto;
}

video::-webkit-media-controls-panel {
  position: absolute;
  bottom: 10px;
  left: 50%;
  width: 50%;
  opacity: 1 !important;
  display: -webkit-flex !important;
  height: auto;

  background: transparent;

  z-index: 1;
  transform: translateX(-50%);
  border-radius: 10px;
  padding-top: 20px;
}

video::-webkit-media-controls-timeline {
  background: transparent;
  position: absolute;
  bottom: 45px;
  height: 4px;
  left: 50%;
  width: 92%;
  transform: translateX(-50%);
}

video::-webkit-media-controls-volume-slider,
video::-webkit-media-controls-timeline {
  background: transparent;
}

video::-webkit-media-controls-volume-slider::-webkit-media-slider-container,
video::-webkit-media-controls-timeline::-webkit-media-slider-container {
  cursor: pointer;
  background: transparent;
}

::-webkit-media-slider-thumb {
  background: red;
}

video::-webkit-media-controls-play-button {
  cursor: pointer;
}

video::-webkit-media-controls-play-button:hover {
}
</style>
