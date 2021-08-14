<template>
  <div>
    <Header />
    <Main />
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Main from "@/components/main.vue";
import Footer from "@/components/footer.vue";

export default {
  data() {
    return {
      Header,
      Main,
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
</style>
