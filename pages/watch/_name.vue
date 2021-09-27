<template>
  <div>
    <Header />
    <div
      v-if="anime.background != ''"
      class="fixed w-[100vw] h-[100vh] top-0 left-0 -z-1 opacity-5"
      :style="{
        background: `url('${anime.background}') no-repeat center center fixed`,
        'background-size': 'cover'
      }"
    ></div>
    <div class="flex flex-col mx-auto min-h-screen object-cover">
      <div
        @click="toggleTheatre"
        class="theatre_button top"
        title="Режим кинотеатра [T]"
        v-if="theatre && video != null"
      >
        <font-awesome-icon :icon="['fa', 'compress']" />
      </div>

      <div
        @click="toggleTheatre"
        class="theatre_button bot"
        title="Режим кинотеатра [T]"
        v-if="!theatre && video != null"
      >
        <font-awesome-icon :icon="['fa', 'expand']" />
      </div>

      <div
        class="theatre_button bot-2"
        @click="hideChat = !hideChat"
        v-if="
          video != null && !theatre && anime.episodes[nowInd].chat != undefined
        "
        title="Вкл/выкл чата [C]"
      >
        <font-awesome-icon
          :icon="['fa', hideChat ? 'comment-slash' : 'comment']"
        />
      </div>

      <div class="container mx-auto">
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
                  anime.title,
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
          class="player-block relative m-5 flex md:flex-row overflow-hidden"
          :class="{
            theatre: theatre,
            'flex-col': !theatre,
            'rounded-[10px]': !theatre
          }"
        >
          <div
            class="player flex"
            :class="{ hidden: video == null, theatre: theatre }"
          >
            <div
              class="
                video_loading
                absolute
                top-[0px]
                left-[0px]
                w-full
                h-full
                flex flex-col
                justify-center
                items-center
              "
              v-if="needLoad"
            >
              <img
                src="https://olsior.herokuapp.com/loading.gif"
                class="rounded-full w-[70px]"
              />
              <h1 class="text-xs mt-1 text-shadow-xl">Загрузка...</h1>
            </div>
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
              @timeupdate="handleVideo"
              @abort="handleVideo"
              @loadstart="handleVideo"
              @progress="handleVideo"
              @canplay="handleVideo"
              @canplaythrough="handleVideo"
              @ended="
                nowInd++;
                change(
                  nowInd,
                  anime.episodes[nowInd].url,
                  anime.title,
                  anime.episodes[nowInd].chat,
                  anime.episodes[nowInd]
                );
              "
            >
              <source :src="video" />
            </video>
          </div>

          <div
            @mouseenter="lockChat = true"
            @mouseleave="lockChat = false"
            class="chat-block relative overflow-x-hidden pb-[100px] bg-black"
            ref="chat"
            :style="{'width': chatSize + '%'}"
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

        <div class="m-5" v-if="video != null">
          <div class="flex justify-start items-center flex-wrap -mt-2">
            <div class="flex flwx-wrap" v-if="quality.length > 0">
              <select
                class="bg-[#2b2b2b] p-[2px] rounded-[2px] mr-2 mt-2"
                name="quality"
                v-model="selectQuality"
              >
                <option v-for="(q, ind) in quality" :key="ind" :value="q.name">
                  {{ q.name }} SD
                </option>
                <option :value="height">
                  {{ height }}
                  <span class="text-[1px] text-[aqua]">{{
                    `${height == "1080p" ? "FHD" : "HD"}`
                  }}</span>
                </option>
              </select>
            </div>

            <select
              class="bg-[#2b2b2b] p-[2px] rounded-[2px] mr-2 mt-2"
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
              class="bg-[#2b2b2b] p-[2px] rounded-[2px] mr-2 mt-2"
              name="fit"
              v-model="objectFit"
            >
              <option value="fill">Растянуть</option>
              <option value="contain">Обычный</option>
              <option value="cover">Заполнение</option>
            </select>

            <div
              class="flex flwx-wrap items-center mt-2"
              v-if="
                nowInd != -1 &&
                  anime.episodes[nowInd].chat != undefined &&
                  !hideChat
              "
            >
              <label for="size">Размер чата:</label>
              <input
                class="bg-[#2b2b2b] rounded-[2px] w-[45px] ml-2"
                type="number"
                min="1"
                max="100"
                v-model="chatSize"
                id="size"
              />
              <span class="mr-2">%</span>
            </div>

            <div
              class="flex flwx-wrap items-center mt-2"
              v-if="anime.episodes[nowInd].heroku != undefined"
            >
              <input
                class="bg-[#2b2b2b] rounded-[2px] mr-2"
                type="checkbox"
                id="scales"
                v-model="heroku"
              />
              <label for="scales">Использовать другой сервер</label>
            </div>
          </div>
        </div>

        <div class="m-5">
          <div class="episode-block" :class="{ active: video != null }">
            <div
              class="episode-scroll w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
              :class="{ active: video != null }"
            >
              <div
                v-for="(post, index) in anime.episodes"
                :title="post.title"
                :key="index"
                class="episode"
                :class="{ active: nowInd == index }"
                @click="change(index, post.url, anime.title, post.chat, post)"
              >
                <span>{{ post.title }}</span>
                <div class="ml-[5px] flex items-center">
                  <font-awesome-icon
                    :icon="['fa', 'comment-alt']"
                    v-if="post.chat"
                  />
                  <a :href="post.url" class="down">
                    <font-awesome-icon :icon="['fa', 'download']" />
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
              v-if="
                anime.episodes[nowInd] != undefined
                  ? anime.episodes[nowInd].taiming
                  : false
              "
              class="menu_item pr-3 pb-2 pt-2 pl-3 cursor-pointer"
              :class="{ active: activeTab == 'taiming' }"
              @click="activeTab = 'taiming'"
            >
              Таймкоды
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
            <h2 class="text-2xl -ml-[2px]">{{ anime.title }}</h2>
            <div class="genre_block flex mb-2 mt-2 flex-wrap">
              <div
                class="genre_name mr-2"
                v-if="anime.genres ? anime.genres.length > 0 : false"
              >
                Жанры:
              </div>
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

        <div class="m-5" v-if="activeTab == 'taiming'">
          <div class="arches-block">
            <div
              class="cursor-pointer"
              @click="changeTime(taim.time)"
              v-for="(taim, index) in anime.episodes[nowInd].taiming"
              :key="index"
            >
              <span
                :class="{ 'font-medium text-[20px] my-[20px] flex': taim.big }"
                >{{ taim.name }}</span
              >
              <span class="text-[aqua]">{{ taim.time }}</span>
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
      title: `${this.anime.title.split("/")[0]} - Олсиор смотрит аниме`,
      meta: [
        { hid: "og-title", property: "og:title", content: this.anime.title },
        {
          hid: "description",
          name: "description",
          content: this.anime.desc
        },
        {
          property: "og:description",
          hid: "og:description",
          name: "og:description",
          content: this.anime.desc
        },
        {
          property: "og:image",
          hid: "og:image",
          name: "og:image",
          content: `https://olsior.herokuapp.com${this.anime.background}`
        }
      ]
    };
  },
  data() {
    return {
      Header,
      Footer,
      nowInd: -1,
      video: null,
      save: {
        id: 0,
        time: 0
      },
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
      needLoad: true,
      heroku: false,
      chatSize: 25
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
    heroku(value) {
      this.video = "";
      if (this.save.id == this.nowInd) this.needSave = true;
      if (value) {
        if (this.selectQuality == "480p" && this.quality[0].url != undefined) {
          this.video = this.quality[0].url;
        } else {
          this.video = this.post.url;
        }
      } else {
        if (this.post.quality) {
          if (this.selectQuality == "480p") {
            if (this.heroku == false && this.quality[0].heroku != undefined) {
              this.video = this.quality[0].heroku;
            } else {
              this.video = this.post.url;
            }
          }
        } else {
          this.selectQuality = "1080p";
        }
      }
    },
    objectFit(value) {
      this.$refs.video.style.objectFit = value;
    },
    selectQuality(value) {
      if (value == "480p") {
        this.changeQuality(this.quality[0].url, this.quality[0].heroku);
      } else {
        this.changeQuality(this.post.url, this.post.heroku);
      }
    },
    playRate(value) {
      if (this.$refs.video) this.$refs.video.playbackRate = Number(value);
    }
  },
  methods: {
    async getChat(url) {
      const emotes = await this.$axios.$get(
        `https://cdn.glitch.com/513930f1-8551-4a01-b9f0-59a88e2429c1%2Femotes2.json?v=1632040166246`
      );
      this.emotes = emotes;
      let chat = await this.$axios.$get(`${url}`);
      this.emotes.forEach(m => {
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
          display: false
        });
      });
    },
    changeQuality(url, heroku) {
      this.video = "";
      if (this.save.id == this.nowInd) this.needSave = true;
      if (this.heroku == false && this.quality[0].heroku != undefined) {
        this.video = heroku;
      } else {
        this.video = url;
      }
    },
    changeTime(time) {
      this.$refs.video.currentTime = this.hmsToSecondsOnly(time);
    },
    change(ind, url, title, chat, post) {
      this.video = "";
      this.post = post;
      this.chat = "";
      this.parsedChat = [];
      if (this.save.id == ind) this.needSave = true;
      this.nowInd = ind;
      if (this.heroku == false && post.heroku != undefined) {
        this.video = post.heroku;
      } else {
        this.video = url;
      }
      if (post.quality) {
        this.quality = post.quality;
        if (this.selectQuality == "480p") {
          if (this.heroku == false && this.quality[0].heroku != undefined) {
            this.video = this.quality[0].heroku;
          } else {
            this.video = this.quality[0].url;
          }
        }
      } else {
        this.selectQuality = "1080p";
        this.quality = [];
      }
      document.title = `${this.anime.title.split("/")[0]} ${
        post.title
      } - Олсиор смотрит аниме`;
      if (chat != undefined) this.getChat(chat);
      if (this.post.taiming) {
        this.activeTab = "taiming";
      }
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
      if (event.target.videoHeight != 480) {
        this.height = event.target.videoHeight + "p";
        this.selectQuality = this.height;
      } else {
        this.height = "1080p";
        this.selectQuality = `480p`;
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
    handleVideo(event) {
      let video = event.target;
      // console.log(video.readyState);
      if (event.type == "loadstart" || video.readyState != 4) {
        this.needLoad = true;
      } else {
        this.needLoad = false;
      }

      if (event.type == "timeupdate") {
        if (video == undefined && video.currentTime == 0) return;
        if (this.nowTime > video.currentTime) {
          this.parsedChat
            .filter(a => {
              if (a.display == true) return true;
            })
            .forEach(a => {
              a.display = false;
            });
        }
        this.save = {
          time: video.currentTime,
          id: this.nowInd,
          volume: video.volume
        };
        this.nowTime = parseInt(this.save.time.toString().split(".")[0]);
        this.chatUpdate();
        localStorage.setItem(
          `${window.location.href.split("/watch/")[1]}`,
          JSON.stringify({
            time: video.currentTime,
            id: this.nowInd,
            volume: video.volume
          })
        );
      }
    },
    chatUpdate() {
      if (this.$refs.video == undefined) return;
      if (this.parsedChat.length == 0) return;
      let mesaages = this.parsedChat.filter(a => {
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
              top: 9999999999999999
            });
          }, 100);
        }
      });
      if (
        this.parsedChat.filter(a => {
          if (a.display == true) return true;
        }).length >= 200
      ) {
        this.parsedChat
          .filter(a => {
            if (a.display == true) return true;
          })
          .forEach(a => {
            a.display = false;
          });
      }
    },
    toggleTheatre() {
      this.theatre = !this.theatre;
      if (this.theatre) {
        window.scrollTo(0, 0);
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
        case 70:
          event.preventDefault();
          this.toggleTheatre();
          break;
      }
    },
    hmsToSecondsOnly(str) {
      let p = str.split(":"),
        s = 0,
        m = 1;

      while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
      }

      return s;
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
    }
  }
};
</script>
