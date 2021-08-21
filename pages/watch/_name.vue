<template>
  <div>
    <Header />
    <div
      class="fixed w-full top-[0px] left-[0px] -z-5 h-screen"
      :style="{
        background: `url('${anime.background}') no-repeat center center fixed`,
        'background-size': 'cover',
      }"
    />
    <div
      class="bg-hex-[#000000dd] flex flex-col mx-auto min-h-screen object-cover"
    >
      <div
        @click="toggleTheatre"
        class="theatre_button top"
        title="Режим кинотеатра [T]"
        v-if="theatre && video != null"
      >
        <i class="fas fa-compress"></i>
      </div>

      <div
        @click="toggleTheatre"
        class="theatre_button bot"
        title="Режим кинотеатра [T]"
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
        title="Вкл/выкл чата [C]"
      >
        <i
          class="fas"
          :class="{ 'fa-comment-slash': hideChat, 'fa-comment': !hideChat }"
        ></i>
      </div>

      <div class="container mx-auto">
        <div class="head text-2xl m-5 flex justify-start items-center">
          <h2>{{ anime.title }}</h2>
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
                  anime.episodes[save.id].chat,
                  anime.episodes[save.id]
                )
              "
            >
              <span>
                {{ anime.episodes[save.id].title }} ({{
                  formatTime(save.time)
                }})
              </span>
            </div>
          </div>
        </div>

        <div
          class="player-block m-5 flex md:flex-row overflow-hidden"
          :class="{
            theatre: theatre,
            'flex-col': !theatre,
            'rounded-[10px]': !theatre,
          }"
        >
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
              preload="auto"
              :key="video"
              :class="{ theatre: theatre }"
              @keydown="rewind"
              @loadedmetadata="getResolution"
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
            class="chat-block overflow-x-hidden bg-hex-[#1b1b1b99]"
            ref="chat"
            v-if="
              nowInd != -1 &&
              anime.episodes[nowInd].chat != undefined &&
              !hideChat
            "
            :class="{ theatre: theatre }"
          >
            <div v-for="(msg, index) in parsedChat" :key="index">
              <div
                v-if="msg.display"
                class="message"
                style="text-shadow: 1px 1px 5px black"
              >
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

        <div class="m-5" v-if="video != null">
          <div class="flex justify-start items-center space-x-[10px] flex-wrap">
            <div class="flex flwx-wrap" v-if="quality.length > 0">
              <select
                class="bg-[#2b2b2b] p-[2px] rounded-[2px]"
                name="quality"
                v-model="selectQuality"
              >
                <option
                  @click="changeQuality(q.url)"
                  v-for="(q, ind) in quality"
                  :key="ind"
                  :value="q.name"
                >
                  {{ q.name }} SD
                </option>
                <option
                  @click="changeQuality(anime.episodes[nowInd].url)"
                  :value="height"
                >
                  {{height}} <span class="text-[1px] text-[aqua]">{{ `${height == '1080p' ? 'FHD' : 'HD'}` }}</span>
                </option>
              </select>
            </div>
            <select
              class="bg-[#2b2b2b] p-[2px] rounded-[2px]"
              name="speed"
              v-model="playRate"
            >
              <option value="0.25">0.25x</option>
              <option value="0.50">0.50x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.50">1.50x</option>
              <option value="1.75">1.75x</option>
              <option value="2">2x</option>
            </select>

            <select
              class="bg-[#2b2b2b] p-[2px] rounded-[2px]"
              name="fit"
              v-model="objectFit"
            >
              <option value="fill">Растянуть</option>
              <option value="contain">Обычный</option>
              <option value="cover">Заполнение</option>
            </select>
          </div>
        </div>

        <div class="m-5">
          <div class="episode-block" :class="{ active: video != null }">
            <div
              class="episode-scroll w-full flex flex-wrap"
              :class="{ active: video != null }"
            >
              <div
                v-for="(post, index) in anime.episodes"
                :key="index"
                class="episode"
                :class="{ active: nowInd == index }"
                @click="change(index, post.url, anime.title, post.chat, post)"
              >
                <span>{{ post.title }}</span>
                <div class="ml-[5px] flex items-center">
                  <i class="fas fa-comment-alt" v-if="post.chat"></i>
                  <a :href="post.url" class="down">
                    <i class="fas fa-download"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="m-5">
          <div class="menu flex jusity-center items-center border-b-2">
            <div
              v-if="anime.desc"
              class="menu_item pr-3 pb-2 pt-2 pl-3 cursor-pointer"
              :class="{ active: activeTab == 'desc' }"
              @click="activeTab = 'desc'"
            >
              Описание
            </div>
            <div
              v-if="anime.seasons"
              class="menu_item pr-3 pb-2 pt-2 pl-3 cursor-pointer"
              :class="{ active: activeTab == 'seasons' }"
              @click="activeTab = 'seasons'"
            >
              Породяк просмотра
            </div>
            <div
              v-if="anime.arches"
              class="menu_item pr-3 pb-2 pt-2 pl-3 cursor-pointer"
              :class="{ active: activeTab == 'arches' }"
              @click="activeTab = 'arches'"
            >
              Арки
            </div>
            <div
              v-if="anime.op"
              class="menu_item pr-3 pb-2 pt-2 pl-3 cursor-pointer"
              :class="{ active: activeTab == 'op' }"
              @click="activeTab = 'op'"
            >
              Опенинги
            </div>
            <div
              v-if="anime.ed"
              class="menu_item pr-3 pb-2 pt-2 pl-3 cursor-pointer"
              :class="{ active: activeTab == 'ed' }"
              @click="activeTab = 'ed'"
            >
              Ендинги
            </div>
          </div>
        </div>

        <div class="m-5" v-if="activeTab == 'desc'">
          <div class="arches-block">
            <div class="genre_block flex mb-2 flex-wrap">
              <div class="genre_name mr-2">Жанры:</div>
              <div
                class="genre mr-2"
                v-for="(g, ind) in anime.genres"
                :key="ind"
              >
                {{ g }}
              </div>
            </div>
            <pre v-text="anime.desc"></pre>
          </div>
        </div>

        <div class="m-5" v-if="activeTab == 'seasons'">
          <div class="arches-block">
            <div v-for="(seas, index) in anime.seasons" :key="index">
              {{ index + 1 }}.
              <a class="link" target="_blank" :href="seas.url">
                {{ seas.title }}
              </a>
              - {{ seas.text }}
            </div>
          </div>
        </div>

        <div class="m-5" v-if="activeTab == 'arches'">
          <div class="arches-block">
            <pre v-text="anime.arches.split('Арка ').join('')"></pre>
          </div>
        </div>

        <div class="m-5" v-if="activeTab == 'op'">
          <div class="arches-block">
            <div v-for="(op, index) in anime.op" :key="index">
              {{ index + 1 }}.
              <a class="link" target="_blank" :href="op.url">{{ op.title }}</a>
              ({{ op.episodes }})
            </div>
          </div>
        </div>

        <div class="m-5" v-if="activeTab == 'ed'">
          <div class="arches-block">
            <div v-for="(ed, index) in anime.ed" :key="index">
              {{ index + 1 }}.
              <a class="link" target="_blank" :href="ed.url">{{ ed.title }}</a>
              ({{ ed.episodes }})
            </div>
          </div>
        </div>
      </div>
      <Footer :class="{ hidden: this.theatre }" />
    </div>
  </div>
</template>

<script>
import "@/assets/css/watch.css";
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
      activeTab: "desc",
      quality: [],
      height: "1080p",
      selectQuality: "1080p",
      post: [],
      objectFit: "contain",
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
  watch: {
    objectFit(value) {
      this.$refs.video.style.objectFit = value;
    },
    selectQuality(value) {
      if (value == "480p") {
        this.changeQuality(this.quality[0].url);
      } else {
        this.changeQuality(this.post.url);
      }
    },
    playRate(value) {
      if (this.$refs.video) this.$refs.video.playbackRate = Number(value);
    },
  },
  methods: {
    async getChat(url) {
      const emotes = await this.$axios.$get(
        `https://cdn.glitch.com/513930f1-8551-4a01-b9f0-59a88e2429c1%2Femotes.json?v=1629155359797`
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
    changeQuality(url) {
      if (this.save.id == this.nowInd) this.needSave = true;
      this.video = url;
    },
    change(ind, url, title, chat, post) {
      this.post = post;
      clearInterval(this.timer);
      this.chat = "";
      this.parsedChat = [];
      if (this.save.id == ind) this.needSave = true;
      this.nowInd = ind;
      this.video = url;
      if (post.quality) {
        this.quality = post.quality;
        if (this.selectQuality == "480p") {
          this.video = this.quality[0].url;
        }
      } else {
        this.selectQuality = "1080p";
        this.quality = [];
      }
      this.title = `${title}`;
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
    getResolution(event) {
      if(event.target.videoHeight != 480) {
        this.height = event.target.videoHeight + "p";
        this.selectQuality = this.height;
      }
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
        case 84:
          event.preventDefault();
          this.toggleTheatre();
          break;
        case 67:
          event.preventDefault();
          this.hideChat = !this.hideChat;
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
