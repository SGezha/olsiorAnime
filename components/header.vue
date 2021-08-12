<template>
  <div class="w-full shadow bg-header">
    <div
      class="header container w-full mx-auto flex justify-center items-center text-gray-300 h-1/6"
    >
      <NuxtLink to="/">
        <h1>Олсиор смотрит аниме</h1>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
}
</script>

<style>
.bg-header {
  background: #2b2b2b;
}
 
h1 {
  color: white;
}

.header {
  height: 60px;
}

.header img {
  height: 24px;
}

.search input {
  padding-left: 40px;
  height: 100%;
  width: 100%;
  margin: auto 0;
}

.acc img {
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

input::placeholder {
  @apply absolute text-gray-300;
}

input:focus {
  box-shadow: none;
  border: none;
  outline: none;
}
</style>
