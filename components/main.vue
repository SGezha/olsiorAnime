<template>
  <div class="container mx-auto">
    <div class="popular">
      <div class="head text-2xl m-5 flex justify-start items-center">
        <h2>Сейчас смотрит <i class="fas fa-chevron-right text-sm"></i></h2>
      </div>
      <div class="main-block flex sm:justify-center md:justify-start items-center flex-wrap">
        <Nuxt-link
          v-for="(pop, index) in smotrit"
          :key="index"
          :to="'/watch/' + pop.url"
          class="card"
        >
          <div class="preview shadow">
            <div
              class="preview-img bg-center bg-cover"
              :style="{ backgroundImage: 'url(' + pop.img + ')' }"
            ></div>
            <div class="anime-stats">
              <span class="stars">{{ pop.stars }} <i class="fas fa-star"></i></span>
              <span class="episodes" v-text="pop.episodes + ' серий'"></span>
            </div>
          </div>

          <div class="anime-title text-gray-800">
            <h2 v-text="pop.title" :title="pop.title"></h2>
          </div>
        </Nuxt-link>
      </div>

      <div class="head text-2xl m-5 flex justify-start items-center">
        <h2>Посмотрел <i class="fas fa-chevron-right text-sm"></i></h2>
      </div>
      <div class="main-block flex sm:justify-center md:justify-start items-center flex-wrap">
        <Nuxt-link
          v-for="(pop, index) in watched"
          :key="index"
          :to="'/watch/' + pop.url"
          class="card"
        >
          <div class="preview shadow">
            <div
              class="preview-img bg-center bg-cover"
              :style="{ backgroundImage: 'url(' + pop.img + ')' }"
            ></div>
            <div class="anime-stats">
              <span class="stars">{{ pop.stars }} <i class="fas fa-star"></i></span>
              <span class="episodes" v-text="pop.episodes + ' серий'"></span>
            </div>
          </div>

          <div class="anime-title text-gray-800">
            <h2 v-text="pop.title" :title="pop.title"></h2>
          </div>
        </Nuxt-link>
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
    };
  },
  async mounted() {
    const animes = await this.$axios.$get(`${window.location.href}api/list`);
    let data = JSON.parse(animes);
    data.forEach((a) => {
      if (a.watched) {
        this.watched.push(a);
      } else {
        this.smotrit.push(a);
      }
    });
  },
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

.card {
  width: 46%;
  margin: 0 5px;
}

.preview-img {
  width: 100%;
  height: 200px;
  max-height: 450px;
  overflow: hidden;
  border-radius: 4px;
}

.card img {
  width: 100%;
  height: 200px;
  max-height: 450px;
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
}

.anime-stats {
  position: absolute;
  display: flex;
  justify-content: center;
  bottom: 10px;
}

.anime-stats span {
  display: inline-block;
  color: white;
  font-size: 10px;
  padding: 5px 10px;
}

span.episodes {
  background: #6bc9d1;
  border-radius: 0px 4px 4px 0px;
}

span.stars {
  background: #ffd700;
  border-radius: 4px 0px 0px 4px;
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
  .card {
    min-width: 192px;
    width: 10vw;
    margin: 0 10px;
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
</style>
