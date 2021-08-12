<template>
  <div>
    <Header />
    <Main />
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Main from "@/components/main.vue";

export default {
  data() {
    return {
      // component options
      Header,
      Main,
    };
  },
  mounted() {

  },
  computed: {

  },
  methods: {
   
  },
};
</script>

<style>
  body {
    background: #1b1b1b;
  }
</style>
