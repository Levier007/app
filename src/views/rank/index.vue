<template>
  <div class="rank">
    <div class="module">
      <h2 class="title">云音乐特色榜</h2>
      <ul class="list clearfix">
        <songSheet
          v-for="item in ranks"
          :key="item.id"
          :item="item"
          @click.native="toDetail(item)"
        ></songSheet>
      </ul>
    </div>
  </div>
</template>

<script>
import songSheet from "@/components/common/songSheet";
export default {
  name: "Rank",
  components: {
    songSheet,
  },
  data() {
    return {
      ranks: [],
    };
  },
  methods: {
    // 跳转详情页
    toDetail(item) {
      this.$router.push({
        name: "songlistdetail",
        query: { id: item.id },
      });
    },
    // 获取排行榜数据
    async getToplist() {
      // this.fullscreenLoading = true;
      try {
        let res = await this.$api.getToplist();
        if (res.code === 200) {
          this.ranks = res.list;
          // this.fullscreenLoading = false
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.getToplist();
  },
};
</script>

<style scoped>
.rank {
  width: 100%;
}
.module {
  width: 1200px;
  margin: 20px auto;
  padding-top: 75px;
}
.title {
  margin: 0 0 15px 0;
}
.list {
  width: 100%;
}
</style>