<template>
  <div class="w-full">
    <div
      class="footer container w-full mx-auto flex flex-col justify-center items-center text-gray-300 h-1/6"
    >
      <div class="text-xs">Записи взяты из <a href="https://t.me/animekogda" class="link">телеграмм канала</a></div>
      <div class="text-xs">Создатель сайта: <a href="https://t.me/FuNSasha" class="link">SGezha</a></div>
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
a.link {
  color: aqua;
}

a.link:hover {
  text-decoration: underline;
}

.footer {
  height: 50px;
}
</style>
