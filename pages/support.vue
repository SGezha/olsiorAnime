<template>
  <div>
    <Header />
    <div class="container mx-auto">
      <div class="head text-2xl m-5 flex justify-start items-center">
        <h2>Поддержать автора сайта денюшкой</h2>
      </div>
      <div class="m-5">
        <a
          href="https://www.donationalerts.com/r/sgezha"
          class="flex mt-2 items-center flex-wrap"
        >
        <img src="/donate.png" alt="" class="donate" />
        С помощью сервиса DonationAlerts
        </a>
        <h2 class="mt-2">Топ донатов:</h2>
        <ul class="da-donationslist flex flex-wrap -ml-1">
          <li
            v-for="(user, ind) in donate"
            :key="ind"
            class="bg-hex-[#2b2b2b] px-[10px] py-[7px] rounded-[8px] m-1 flex justify-between w-full md:w-[48%] lg:w-[32%]"
          >
            <span class="username">{{ user.username }}</span
            ><span class="amount text-green-500"
              >+ {{ user.amount }}
              <span class="currency">{{ user.type }}</span></span
            >
          </li>
        </ul>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/header.vue";
import Footer from "@/components/footer.vue";

export default {
  data() {
    return {
      Header,
      Footer,
      donate: [
        {
          username: "Daria",
          amount: 150,
          type: "₽"
        },
        {
          username: "Morter",
          amount: 500,
          type: "₽"
        },
        {
          username: "Death",
          amount: 100,
          type: "₽"
        },
        {
          username: "swordmaster",
          amount: 400,
          type: "₽"
        },
        {
          username: "zovvetra(low budget)",
          amount: 10,
          type: "₽"
        },
        {
          username: "yaroslaffb",
          amount: 411,
          type: "₽"
        },
        {
          username: "fanat_anime_ot_olsi",
          amount: 10,
          type: "₽"
        },
        {
          username: "ANONYMOUS",
          amount: 200,
          type: "₽"
        },
        {
          username: "ivangame1995",
          amount: 100,
          type: "₽"
        },
        {
          username: "IGOR3334",
          amount: 50,
          type: "₽"
        },
        {
          username: "GORKOM3",
          amount: 300,
          type: "₽"
        },
        {
          username: "bless",
          amount: 150,
          type: "₽"
        },
        {
          username: "abathur",
          amount: 150,
          type: "₽"
        },
        {
          username: "RAMIN",
          amount: 80,
          type: "₽"
        },
        {
          username: "Olsior",
          amount: 1000,
          type: "₽"
        },
        {
          username: "YarosTK",
          amount: 2235,
          type: "₽"
        },
        {
          username: "Svee4K",
          amount: 1000,
          type: "₽"
        },
        {
          username: "LinaFromBerlin",
          amount: 200,
          type: "₽"
        },
        {
          username: "Temi",
          amount: 15,
          type: "₽"
        },
        {
          username: "Amurkibon",
          amount: 100,
          type: "₽"
        },
        {
          username: "кто здесь",
          amount: 100,
          type: "₽"
        },
        {
          username: "Jak1R",
          amount: 50,
          type: "₽"
        }
      ]
    };
  },
  mounted() {
    this.donate = this.donate.sort((a, b) => b.amount - a.amount);
  },
  computed: {},
  methods: {}
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
