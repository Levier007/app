<template>
  <div>
    <h2 class="title">推荐歌手</h2>
    <ul class="list clearfix">
      <singerItem
        v-for="item in singers"
        :key="item.id"
        :item="item"
      ></singerItem>
    </ul>
  </div>
</template>

<script>
import singerItem from "@/components/common/singerItem";
export default {
  name: "RecommendSinger",
  components: { singerItem },
  data() {
    return {
      singers: [],
    };
  },
  methods: {
    // 获取推荐歌手
    async getHotSinger() {
      try {
        let res = await this.$api.getHotSinger();
        if (res.code == 200) {
          this.singers = res.artists;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.getHotSinger();
  },
};
</script>

<style scoped>
.title {
  margin: 0 0 15px 0;
}
.list {
  width: 100%;
}
</style>