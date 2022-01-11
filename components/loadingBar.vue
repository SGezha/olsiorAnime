<template>
  <div v-if="loading" class="loading-page">
    <img src="https://olsior.herokuapp.com/loading.webp" class="loading" />
    <h1 class="text-sm mt-1">Загрузка...</h1>
  </div>
</template>
<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      setTimeout(() => {
        this.loading = false;
      }, 400);
    }
  }
};
</script>
<style scoped>
html,
body {
  overflow-x: hidden !important;
  overflow-y: hidden !important;
}

.loading-page {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1000;
  background: #1b1b1b99;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.loading {
  border-radius: 50%;
  width: 100px;
  height: 100px;
}
</style>
