<template>
  <div>
    <transition name="slide-fade">
      <div
        v-if="show"
        class="bg-hex-[#1b1b1b] fixed left-0 top-0 w-screen h-screen flex justify-center items-center z-50 flex-col"
      >
        <img
          src="https://olsior.herokuapp.com/loading.webp"
          class="rounded-1 w-[100px] h-[100px]"
        />
        <h1 class="text-sm mt-1">Загрузка...</h1>
      </div>
    </transition>

    <div class="container mx-auto" v-if="watched.length > 0">
      <div class="popular">
        <div
          class="head text-2xl my-5 px-[20px] flex justify-start items-center"
        >
          <h2 class="flex justify-center items-center">
            Сейчас смотрит
            <font-awesome-icon
              class="ml-2 mt-1"
              style="font-size: 1rem;"
              :icon="['fa', 'chevron-right']"
            />
          </h2>
        </div>
        <div
          class="
          main-block
          grid
          w-full
          grid-cols-2
          md:grid-cols-4
          lg:grid-cols-5
          xl:grid-cols-6
          2xl:grid-cols-8
          gap-[10px]
        "
        >
          <Nuxt-link
            v-for="(pop, index) in smotrit"
            :key="index"
            :to="'/watch/' + pop.url"
            class="card w-full"
          >
            <div class="preview shadow">
              <div
                class="preview-img bg-center bg-cover md:min-h-full"
                :style="{ backgroundImage: 'url(/anime/' + pop.url + '.jpg)' }"
              ></div>
              <div class="anime-stats">
                <span
                  :class="{ 'opacity-0': pop.stars == '-' }"
                  class="stars text-[#fff]"
                >
                  {{ pop.stars }}
                  <font-awesome-icon
                    v-if="pop.stars != 'Крис смотрит'"
                    :icon="['fa', 'star']"
                  />
                </span>
                <span
                  v-if="pop.episodes != '1/1'"
                  class="episodes"
                  v-text="pop.episodes + ' серий'"
                ></span>
              </div>
            </div>

            <div class="anime-title text-gray-800">
              <h2 v-text="pop.title" :title="pop.title"></h2>
            </div>
          </Nuxt-link>
        </div>

        <div
          class="head text-2xl my-5 px-[20px] flex justify-start items-center"
        >
          <h2 class="flex justify-content items-center">
            Посмотрел
            <font-awesome-icon
              class="ml-2 mt-1"
              style="font-size: 1rem;"
              :icon="['fa', 'chevron-right']"
            />
          </h2>
        </div>
        <div
          class="
          main-block
          grid
          w-full
          grid-cols-2
          md:grid-cols-4
          lg:grid-cols-5
          xl:grid-cols-6
          2xl:grid-cols-8
          gap-[10px]
        "
        >
          <Nuxt-link
            v-for="(pop, index) in watched"
            :key="index"
            :to="'/watch/' + pop.url"
            class="card w-full"
          >
            <div class="preview shadow">
              <div
                class="preview-img bg-center bg-cover md:min-h-full"
                :style="{ backgroundImage: 'url(/anime/' + pop.url + '.jpg)' }"
              ></div>
              <div class="anime-stats">
                <span
                  :class="{ 'opacity-0': pop.stars == '-' }"
                  class="stars text-[#fff]"
                >
                  {{ pop.stars }}
                  <font-awesome-icon
                    v-if="pop.stars != 'Крис смотрит'"
                    :icon="['fa', 'star']"
                  />
                </span>
                <span
                  v-if="pop.episodes != '1/1'"
                  class="episodes"
                  v-text="pop.episodes + ' серий'"
                ></span>
              </div>
            </div>

            <div class="anime-title text-gray-800">
              <h2 v-text="pop.title" :title="pop.title"></h2>
            </div>
          </Nuxt-link>
        </div>

        <div class="head text-2xl my-5 px-[20px] flex justify-start items-center">
          <h2 class="flex justify-center items-center">
            Последнии нарезки
            <font-awesome-icon
              class="ml-2 mt-1"
              style="font-size: 1rem;"
              :icon="['fa', 'chevron-right']"
            />
          </h2>
        </div>
          <div class="main-block">
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-[10px]">
              <iframe class="w-full rounded-[10px] min-h-[30vh]" style="aspect-ratio: 16 / 9;" src="https://www.youtube.com/embed/9WjuJQjivQE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              <iframe class="w-full rounded-[10px] min-h-[30vh]" style="aspect-ratio: 16 / 9;" src="https://www.youtube.com/embed/5E5sMi-KO6A" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              <iframe class="w-full rounded-[10px] min-h-[30vh]" style="aspect-ratio: 16 / 9;" src="https://www.youtube.com/embed/xdNcV53CqN0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      smotrit: [],
      watched: [],
      show: true
    };
  },
  async mounted() {
    const animes = await this.$axios.$get(`${window.location.href}api/list`);
    let data = JSON.parse(animes);
    data.forEach(a => {
      if (a.watched) {
        this.watched.push(a);
      } else {
        this.smotrit.push(a);
      }
    });
    setTimeout(() => {
      this.show = false;
    }, 100)
  }
};
</script>

<style>
* {
  color: white;
}

.main-block {
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
  max-width: 100%;
}

.card:hover .preview-img {
  transform: scale(1.05);
}

.preview-img {
  width: 100%;
  height: 30vh;
  overflow: hidden;
  border-radius: 4px;
}

.card img {
  width: 100%;
  height: 30vh;
  overflow: hidden;
  border-radius: 4px;
  transform: scale(1);
  transition: 0.3s ease;
}

.anime-title h2 {
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 10px;
  text-align: center;
  word-spacing: normal;
  white-space: nowrap;
  color: white;
  font-size: 14px;
}

.anime-stats {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  height: 100%;
}

.anime-stats span {
  display: inline-block;
  font-size: 8px;
  padding: 5px 10px;
}

span.episodes {
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  font-size: 14px;
}

span.stars {
  background: rgba(0, 0, 0, 0.8);
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  font-size: 16px;
}

span.stars .fa-star {
  margin-left: 2px;
}

.preview {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}

@media (min-width: 768px) {
  .anime-title h2 {
    font-size: 16px;
  }

  .anime-stats span {
    display: inline-block;
    font-size: 16px;
    padding: 5px 10px;
  }

  .preview-img {
    width: 100%;
    height: 260px;
    max-height: 450px;
    overflow: hidden;
    border-radius: 4px;
  }

  .card img {
    width: 100%;
    height: 260px;
    max-height: 450px;
    overflow: hidden;
    border-radius: 4px;
    transform: scale(1);
    transition: 0.3s ease;
  }
}

@media (min-width: 1921px) {
  .anime-title h2 {
    font-size: 16px;
  }

  .anime-stats span {
    display: inline-block;
    font-size: 10px;
    padding: 5px 10px;
  }

  .preview-img {
    width: 100%;
    max-height: 350px;
    overflow: hidden;
    border-radius: 4px;
  }

  .card img {
    width: 100%;
    height: 350px;
    overflow: hidden;
    border-radius: 4px;
    transform: scale(1);
    transition: 0.3s ease;
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s linear;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
