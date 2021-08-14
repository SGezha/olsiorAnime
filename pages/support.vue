<template>
  <div>
    <Header />
    <div class="container mx-auto">
      <div class="head text-2xl m-5 flex justify-start items-center">
        <h2>Поддержать автора сайта денюшкой</h2>
      </div>
      <div class="m-5">
        <p>Номер карты: 4276520013949280 Галина Николаевна А.</p>
        <a
          href="https://www.donationalerts.com/r/sgezha"
          class="flex mt-2 items-center"
          ><img src="/donate.png" alt="" class="donate" /> С помощью сервиса
          DonationAlerts</a
        >
        <h2 class="mt-2">История донатов:</h2>
        <div v-html="donats"></div>
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
    let donats = await $axios.$get(`https://olsior.herokuapp.com/api/getdonations`);
    return { donats };
  },
  data() {
    return {
      Header,
      Footer,
    };
  },
  mounted() {},
  computed: {},
  methods: {},
};
</script>

<style>
body {
  background: #1b1b1b;
}

.donate {
  height: 30px;
  margin-right: 10px;
  border-radius: 50%;
}
</style>
