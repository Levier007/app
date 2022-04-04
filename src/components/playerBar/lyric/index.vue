<template>
  <div class="lyric-box">
    <scroll
      class="lyric"
      ref="lyricList"
      :data="currentLyric && currentLyric.lines"
    >
      <div class="lyric-wrapper">
        <div v-if="currentLyric">
          <p
            ref="lyricLine"
            class="lyric-text"
            :class="currentLyricNum === index ? 'active' : ''"
            v-for="(item, index) of currentLyric.lines"
            :key="index"
          >
            {{ item.txt }}
          </p>
        </div>
        <div class="no-lyric" v-else>暂无歌词，请您欣赏</div>
      </div>
    </scroll>
    <div class="foot"></div>
  </div>
</template>

<script>
import Scroll from "./scroll";
export default {
  name: "Lyric",
  data() {
    return {};
  },
  props: {
    currentLyricNum: {
      type: Number,
    },
    currentLyric: {
      type: Object,
    },
  },
  components: {
    Scroll,
  },
};
</script>

<style scoped>
.lyric {
  display: inline-block;
  vertical-align: top;
  width: 100%;
  height: 430px;
  overflow: hidden;
}
.lyric-wrapper {
  width: 100%;
  margin: 0 auto;
  overflow: hidden;
}
.lyric-text {
  margin: 5px 0;
  line-height: 24px;
  font-size: 14px;
  font-weight: 300;
}
.active {
  color: red;
}
</style>
