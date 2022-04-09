<template>
  <li class="item">
    <div class="cover">
      <div class="bgImg">
        <!-- 图片地址加上?param=200y200 使图片大小减小，加快加载速度 相当于把大图都压缩成200*200大小 -->
        <img
          :src="item.img1v1Url + '?param=200y200'"
          style="width: 100%; height: 100%"
        />
      </div>
      <div class="info">
        <h5>{{ item.name }}</h5>
        <p>单曲数{{ item.musicSize }}</p>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  name: "singerItem",
  props: ["item"],
};
</script>

<style scoped>
.item {
  float: left;
  width: 90px;
  height: 150px;
  margin: 10px 30px 10px 0;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
}
.bgImg {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
}
.info {
  margin: 5px auto;
}
p {
  color: #ff0000;
}
img {
  transition: all 0.3s;
}
.item:hover img {
  transition: all 0.3s;
  transform: scale(1.2);
}
.item:hover h5 {
  color: #ff0000;
}
</style>