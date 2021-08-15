<template>
  <div>
    <Header />

    <div
      @click="toggleTheatre"
      class="theatre_button top"
      title="Режим кинотеатра"
      v-if="theatre && video != null"
    >
      <i class="fas fa-compress"></i>
    </div>

    <div
      @click="toggleTheatre"
      class="theatre_button bot"
      title="Режим кинотеатра"
      v-if="!theatre && video != null"
    >
      <i class="fas fa-expand"></i>
    </div>

    <div
      class="theatre_button bot-2"
      @click="hideChat = !hideChat"
      v-if="
        video != null && !theatre && anime.episodes[nowInd].chat != undefined
      "
    >
      <i
        class="fas"
        :class="{ 'fa-comment-slash': hideChat, 'fa-comment': !hideChat }"
      ></i>
    </div>

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
          <div
            class="oneepisode"
            @click="
              change(
                save.id,
                anime.episodes[save.id].url,
                anime.episodes[save.id].title,
                anime.episodes[save.id].chat
              )
            "
          >
            <span
              >{{ anime.episodes[save.id].title }} ({{
                formatTime(save.time)
              }})</span
            >
          </div>
        </div>
      </div>

      <div class="player-block m-5 flex" :class="{ theatre: theatre }">
        <div
          class="player"
          :class="{ hidden: video == null, theatre: theatre }"
        >
          <video
            ref="video"
            class="video"
            @loadeddata="loadedVideo"
            controls
            autoplay
            :key="video"
            :class="{ theatre: theatre }"
            @keydown="rewind"
            @ended="
              nowInd++;
              change(
                nowInd,
                anime.episodes[nowInd].url,
                anime.title,
                anime.episodes[nowInd].chat
              );
            "
          >
            <source :src="video" />
          </video>
        </div>

        <div
          @mouseenter="lockChat = true"
          @mouseleave="lockChat = false"
          class="chat-block overflow-x-hidden"
          ref="chat"
          v-if="
            nowInd != -1 &&
            anime.episodes[nowInd].chat != undefined &&
            !hideChat
          "
          :class="{ theatre: theatre }"
        >
          <div v-for="(msg, index) in parsedChat" :key="index">
            <div v-if="msg.display" class="message">
              <!-- <span class="time" v-text="`[${msg.time.time}]`"></span> -->
              <span
                class="author"
                v-text="msg.author + ':'"
                :style="{ color: `${msg.color}` }"
              ></span>
              <span class="text" v-html="msg.text"></span>
            </div>
          </div>
        </div>
      </div>

      <div class="m-5">
        <div
          class="play-rate-block flex items-center flex-wrap"
          v-if="nowInd != -1"
        >
          <h2>Скорость проигрывания:</h2>
          <div
            class="ml-2 mr-2 cursor-pointer playrate"
            @click="changePlayRate(0.25)"
            :class="{ active: playRate == 0.25 }"
          >
            0.25
          </div>
          <div
            class="ml-2 mr-2 cursor-pointer playrate"
            @click="changePlayRate(0.5)"
            :class="{ active: playRate == 0.5 }"
          >
            0.50
          </div>
          <div
            class="ml-2 mr-2 cursor-pointer playrate"
            @click="changePlayRate(0.75)"
            :class="{ active: playRate == 0.75 }"
          >
            0.75
          </div>
          <div
            class="ml-2 mr-2 cursor-pointer playrate"
            @click="changePlayRate(1)"
            :class="{ active: playRate == 1 }"
          >
            1
          </div>
          <div
            class="ml-2 mr-2 cursor-pointer playrate"
            @click="changePlayRate(1.25)"
            :class="{ active: playRate == 1.25 }"
          >
            1.25
          </div>
          <div
            class="ml-2 mr-2 cursor-pointer playrate"
            @click="changePlayRate(1.5)"
            :class="{ active: playRate == 1.5 }"
          >
            1.50
          </div>
          <div
            class="ml-2 mr-2 cursor-pointer playrate"
            @click="changePlayRate(1.75)"
            :class="{ active: playRate == 1.75 }"
          >
            1.75
          </div>
          <div
            class="ml-2 mr-2 cursor-pointer playrate"
            @click="changePlayRate(2)"
            :class="{ active: playRate == 2 }"
          >
            2
          </div>
        </div>
        <div class="episode-block" :class="{ active: video != null }">
          <div class="episode-scroll" :class="{ active: video != null }">
            <div
              v-for="(post, index) in anime.episodes"
              :key="index"
              class="episode"
              :class="{ active: nowInd == index }"
              @click="change(index, post.url, anime.title, post.chat)"
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

      <div class="m-5" v-if="anime.seasons">
        <div class="arches-block">
          <h2 class="text-xl">Порядок просмотра:</h2>
          <div v-for="(seas, index) in anime.seasons" :key="index">
            {{ index + 1 }}.
            <a class="link" target="_blank" :href="seas.url">{{
              seas.title
            }}</a>
            - {{ seas.text }}
          </div>
        </div>
      </div>

      <div class="m-5" v-if="anime.arches">
        <div class="arches-block">
          <h2 class="text-xl">Список арок:</h2>
          <pre v-text="anime.arches.split('Арка ').join('')"></pre>
        </div>
      </div>

      <div class="m-5" v-if="anime.op">
        <div class="arches-block">
          <h2 class="text-xl">Опенинги:</h2>
          <div v-for="(op, index) in anime.op" :key="index">
            {{ index + 1 }}.
            <a class="link" target="_blank" :href="op.url">{{ op.title }}</a>
            ({{ op.episodes }})
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";

export default {
  async asyncData({ params, $axios }) {
    let anime = await $axios.$get(
      `https://olsior.herokuapp.com/api/anime?${params.name}`
    );
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
      Footer,
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
      nowTime: 0,
      theatre: false,
      emotes: [],
      lockChat: false,
      hideChat: false,
      playRate: 1,
    };
  },
  mounted() {
    // window.addEventListener("keydown", this.rewind);
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
    async getChat(url) {
      const emotes = await this.$axios.$get(
        `https://cdn.glitch.com/513930f1-8551-4a01-b9f0-59a88e2429c1%2Femotes.json?v=1629031864311`
      );
      this.emotes = emotes;
      let chat = await this.$axios.$get(`${url}`);
      this.emotes.forEach((m) => {
        chat = chat
          .split(`${m.name}`)
          .join(`<img class="emote" src="${m.url}">`);
      });
      this.chat = chat;
      this.parseChat();
    },
    parseChat() {
      this.parsedChat = [];
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
        let result = {};
        result.time = this.formatTime(secDiff);
        result.timesec = secDiff;
        this.parsedChat.push({
          time: result,
          author: text.split("] ")[1].split(":")[0],
          text: text
            .split("] ")[1]
            .split(`${text.split("] ")[1].split(":")[0]}: `)
            .join(""),
          display: false,
        });
      });
    },
    change(ind, url, title, chat) {
      clearInterval(this.timer);
      this.chat = "";
      this.parsedChat = [];
      if (this.save.id == ind) this.needSave = true;
      this.nowInd = ind;
      this.video = url;
      this.title = title;
      if (chat != undefined) this.getChat(chat);
      this.timer = setInterval(() => {
        if (this.$refs.video == undefined) return;
        if (this.$refs.video.currentTime == 0) return;
        this.save = {
          time: this.$refs.video.currentTime,
          id: this.nowInd,
          volume: this.$refs.video.volume,
        };
        this.nowTime = parseInt(this.save.time.toString().split(".")[0]);
        this.chatUpdate();
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
    openFullscreen() {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    },
    closeFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    },
    changePlayRate(value) {
      this.playRate = value;
      this.$refs.video.playbackRate = this.playRate;
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
    chatUpdate() {
      if (this.$refs.video == undefined) return;
      if (this.parsedChat.length == 0) return;
      let mesaages = this.parsedChat.filter((a) => {
        if (a.time.timesec == this.nowTime) return true;
      });
      if (mesaages == undefined) return;
      mesaages.forEach((a, ind) => {
        if (a.display) return;
        a.display = true;
        a.color = this.getRandomColor();
        if (ind + 1 == mesaages.length && !this.lockChat) {
          setTimeout(() => {
            this.$refs.chat.scrollTo({
              top: 9999999999999999,
            });
          }, 100);
        }
      });
      if (
        this.parsedChat.filter((a) => {
          if (a.display == true) return true;
        }).length >= 200
      ) {
        this.parsedChat
          .filter((a) => {
            if (a.display == true) return true;
          })
          .forEach((a) => {
            a.display = false;
          });
      }
    },
    toggleTheatre() {
      this.theatre = !this.theatre;
      console.log(this.theatre);
      if (this.theatre) {
        document.body.style.overflow = "hidden";
        this.openFullscreen();
      } else {
        document.body.style.overflow = "auto";
        this.closeFullscreen();
      }
    },
    rewind(event) {
      switch (event.keyCode) {
        case 37:
          event.preventDefault();
          this.$refs.video.currentTime = this.$refs.video.currentTime - 5;
          break;
        case 39:
          event.preventDefault();
          this.$refs.video.currentTime = this.$refs.video.currentTime + 5;
          break;
      }
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
    getRandomColor() {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
  },
};
</script>

<style>
html,
body {
  max-width: 100%;
}

.video:focus {
  border: none;
  outline: none;
}

.playrate {
  transition: color 0.3s ease;
}

.playrate.active {
  color: aqua;
}

.video:hover {
  border: none;
  outline: none;
}

.hide-chat {
  position: absolute;
  right: 5px;
  top: 5px;
}

.theatre_button {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  z-index: 999;
  background: #2b2b2b;
  border-radius: 50%;
  cursor: pointer;
  bottom: 10px;
  right: 10px;
  transition: background 0.3s ease;
}

.theatre_button:hover {
  background: #3b3b3b;
}

.theatre_button.bot {
  bottom: 10px;
  right: 10px;
}

.theatre_button.bot-2 {
  bottom: 10px;
  right: 70px;
}

.theatre_button.top {
  top: 10px;
  right: 10px;
  opacity: 0.5;
}

.arches-block {
  width: 100%;
  word-wrap: normal;
}

.arches-block pre {
  width: 100%;
  word-wrap: normal;
  white-space: pre-wrap;
}

.history {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.history.active {
  display: none;
}

.down {
  margin-left: 5px;
}

.chat-block {
  width: 30%;
  overflow-y: auto;
  height: 30vh;
  padding: 10px;
}

.player {
  position: relative;
  width: 100%;
  height: 30vh;
}

.player .video {
  width: 100%;
  height: 30vh;
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

.right {
  margin-left: 5px;
}

.episode {
  cursor: pointer;
  display: flex;
  padding: 5px 10px;
  background: #2b2b2b;
  border: 1px solid #2b2b2b;
  border-radius: 5px;
  transition: 0.3s ease;
  margin: 5px;
  font-size: 14px;
  transition: background 0.3s ease;
}

.episode:hover {
  background: #3b3b3b;
}

@media screen and (min-width: 768px) {
  .history {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .chat-block {
    width: 30%;
    overflow: auto;
    height: 70vh;
    padding: 10px;
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

  .episode {
    width: calc((100% - 10px) / 4);
    justify-content: space-between;
    font-size: 16px;
  }

  .episode span {
    display: inline-flex;
  }
}

@media screen and (min-width: 1280px) {
  .episode {
    width: calc((100% - 10px) / 6);
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
    /* opacity: 1 !important; */
    display: -webkit-flex !important;
    height: 70px;

    background: #2b2b2be5;

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

.player-block.theatre {
  position: absolute;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  background: #1b1b1b;
}

.player.theatre {
  width: 100%;
  height: 100%;
  transition: 0.5s ease;
}

.video.theatre {
  width: 100%;
  height: 100%;
}

.chat-block.theatre {
  height: 100vh;
  width: 30%;
  font-size: 10px;
}

.emote {
  display: inline-block;
  height: 15px;
  width: auto;
  transform: translateY(3px);
}

@media screen and (min-width: 768px) {
  .chat-block.theatre {
    height: 100vh;
    width: 20%;
    font-size: 100%;
  }

  .emote {
    display: inline-block;
    height: 25px;
    width: auto;
    transform: translateY(5px);
  }
}
</style>
