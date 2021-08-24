<template>
  <div class="w-full shadow bg-header">
    <div
      class="
        header
        container
        w-full
        mx-auto
        flex
        justify-around
        items-center
        text-gray-300
        h-1/6
      "
    >
      <NuxtLink to="/">
        <h1>
          <img
            src="https://olsior.herokuapp.com/minloading.webp"
            class="logo h-[24px] w-[24px]"
          />
          Олсиор смотрит аниме <span class="small">BETA</span>
        </h1>
      </NuxtLink>
      <NuxtLink to="/support">
        <h1>
          Поддержать работу сайта
          <img src="https://olsior.herokuapp.com/money.jpg" class="logo h-[24px] w-[24px]" />
        </h1>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    if (
      window.location.protocol == "http:" &&
      window.location.href.indexOf("localhost") == -1
    )
      window.location.href = window.location.href.replace(/^http:/, "https:");
  }
};
</script>

<style>
.logo {
  border-radius: 50%;
  margin-right: 10px;
  margin-left: 10px;
}

.bg-header {
  background: #2b2b2b;
}

.small {
  font-size: 10px;
  margin-left: 2px;
}

h1 {
  color: white;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  margin-top: 10px;
}

.header {
  min-height: 60px;
  flex-direction: column;
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

input:focus {
  box-shadow: none;
  border: none;
  outline: none;
}

@media screen and (min-width: 768px) {
  .header {
    flex-direction: row;
  }

  h1 {
    margin-bottom: 0;
    margin-top: 0;
  }
}
</style>
