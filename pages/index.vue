<template>
  <div>
    <Header />
    <Main :anime="anime" />
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Main from "@/components/main.vue";
import Footer from "@/components/footer.vue";

export default {
  async asyncData({ params, $axios }) {
    let anime = await $axios.$get(
      `https://olsior.herokuapp.com/api/list`
    );
    // let anime = await $axios.$get(`/api/anime?${params.name}`);
    anime = JSON.parse(anime);
    return { anime };
  },
  data() {
    return {
      Header,
      Main,
      Footer
    };
  },
  mounted() {},
  computed: {},
  methods: {}
};
</script>

<style>
body {
  background: #1b1b1b;
}
</style>
