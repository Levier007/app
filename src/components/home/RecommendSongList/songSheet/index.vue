<template>
  <li class="item">
    <div class="bgImg">
      <img
        :src="item.picUrl + '?param=200y200'"
        :alt="item.name"
        style="width: 100px; height: 100px"
      />
      <div class="count">
        <i class="iconfont icon-bofangqi-bofang"></i>
        <span>{{ Math.round(item.playCount / 10000) }}万</span>
      </div>
    </div>
    <div class="info">
      <h5>{{ item.name }}</h5>
    </div>
  </li>
</template>

<script>
export default {
  name: "SongSheet",
  props: ["item"],
};
</script>

<style scoped>
.item {
  float: left;
  width: 100px;
  height: 150px;
  margin: 0 25px 25px 25px;
  cursor: pointer;
}
.info {
  margin-top: 10px;
}
h5 {
  font-size: 14px;
  /* 多行文字超出最后一行省略号 */
  word-break: break-all;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.bgImg {
  position: relative;
}
.count {
  position: absolute;
  right: 10px;
  top: 10px;
  color: white;
  padding: 1px;
  background-color: black;
}
</style>