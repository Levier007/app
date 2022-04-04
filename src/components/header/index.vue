<template>
  <div class="header">
    <div class="container">
      <div class="logo">
        <a href="#"></a>
      </div>
      <div class="nav">
        <ul>
          <li>
            <router-link :to="{ name: 'home' }">发现</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'rank' }">排行榜</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'songlist' }">歌单</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'singer' }">歌手</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'mv' }">MV</router-link>
          </li>
        </ul>
      </div>
      <div class="userbox">登录</div>
      <div class="line"></div>
      <div class="search iconfont icon-sousuo"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
};
</script>


<style scoped>
.header {
  width: 100%;
  height: 65px;
  margin-bottom: 10px;
  background-color: #242424;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2000;
}

.container {
  position: relative;
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  color: #fff;
}

.logo {
  width: 200px;
  height: 100%;
  float: left;
}

.logo a {
  display: block;
  width: 100%;
  height: 65px;
  background-position-y: center;
  background-repeat: no-repeat;
  background-size: 146px 26px;
  background-image: url(./images/logo-white.png);
}

.nav {
  float: left;
  width: 600px;
  height: 65px;
}

.nav li {
  float: left;
  height: 20px;
  margin: 22.5px 15px;
}

.nav li a {
  color: #fff;
  font-size: 14px;
  display: block;
  height: 20px;
  line-height: 20px;
  padding: 0 15px;
}

.search,
.userbox {
  position: absolute;
  font-size: 14px;
  width: 50px;
  height: 30px;
  line-height: 30px;
  float: right;
  text-align: center;
}

.userbox {
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
}

.search {
  right: 51px;
  top: 50%;
  transform: translate(0, -50%);
}
.icon-sousuo:before {
  font-size: 24px;
}

.line {
  width: 1px;
  height: 22px;
  position: absolute;
  background: #e1e1e1;
  right: 50px;
  top: 50%;
  transform: translate(0, -50%);
}
</style>
