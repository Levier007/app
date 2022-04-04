<template>
  <el-carousel :interval="4000" type="card" height="220px">
    <el-carousel-item v-for="(banner , index) in banners" :key="index">
      <img :src="banner.imageUrl" style="width: 100%" />
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  name: "Carousel",
  data() {
    return {
      banners: [],
    };
  },
  methods: {
    async getBanner() {
      try {
        let res = await this.$api.getBanner();
        if (res.code == 200) {
          this.banners = res.banners;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.getBanner();
  },
};
</script>

<style scoped>
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>