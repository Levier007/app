<template>
  <div>
    <h2 class="title">推荐歌单</h2>
    <ul class="list clearfix">
      <songSheet
        v-for="item in personalizeds"
        :key="item.id"
        :item="item"
        @click.native="toDetail(item)"
      ></songSheet>
    </ul>
  </div>
</template>

<script>
import songSheet from "@/components/common/songSheet";
export default {
  name: "RecommendSongList",
  components: {
    songSheet,
  },
  data() {
    return {
      limit: 24,
      personalizeds: [],
    };
  },
  methods: {
    // 获取推荐歌单
    async getPersonalized() {
      try {
        let res = await this.$api.getPersonalized(this.limit);
        if (res.code == 200) {
          this.personalizeds = res.result;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 跳转详情页
    toDetail(item) {
      this.$router.push({
        name:'songlistdetail',
        query:{id:item.id}
      })
    }
  },
  mounted() {
    this.getPersonalized();
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