<template>
  <div class="container">
    <div class="center">
      <Carousel></Carousel>
      <RecommendSongList></RecommendSongList>
      <RecommendMusic></RecommendMusic>
      <RecommendSinger></RecommendSinger>
    </div>
  </div>
</template>

<script>
import Carousel from "@/components/home/carousel";
import RecommendSongList from "@/components/home/RecommendSongList";
import RecommendMusic from "@/components/home/RecommendMusic";
import RecommendSinger from "@/components/home/RecommendSinger";
export default {
  name: "home",
  components: { Carousel, RecommendSongList, RecommendMusic, RecommendSinger },
};
</script>

<style scoped>
.container {
  width: 100%;
}
.center {
  width: 1200px;
  margin: 20px auto;
  padding-top: 75px;
}
</style>