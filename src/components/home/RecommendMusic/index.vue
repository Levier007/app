<template>
  <div>
    <h2 class="title">推荐单曲</h2>
    <div class="list clearfix">
      <div
        class="item"
        v-for="(item, index) in songs"
        :key="item.id"
        :class="
          index == currentIndex && currentSong.id == item.id && playing
            ? 'playing'
            : ''
        "
      >
        <div class="index-container">
          <div class="bgImg">
            <img :src="item.image + '?param=200y200'" />
          </div>
          <div class="playing-icon">
            <div class="line" style="animation-delay: -1.2s"></div>
            <div class="line"></div>
            <div class="line" style="animation-delay: -1.5s"></div>
            <div class="line" style="animation-delay: -0.9s"></div>
            <div class="line" style="animation-delay: -0.6s"></div>
          </div>
          <i
            class="iconfont icon-bofang1 play-btn"
            @click="playSong(item, index)"
          ></i>
          <i
            class="iconfont icon-zanting1 pause-btn"
            @click="pauseSong(item, index)"
          ></i>
        </div>
        <div class="info">
          <h5>{{ item.name }}</h5>
          <p class="ellipsis">{{ item.singer }}</p>
        </div>
        <div class="time">
          {{ utils.formatSecondTime(item.duration) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createSong } from "@/model/song";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "RecommendMusic",
  data() {
    return {
      songs: [],
    };
  },
  computed: {
    ...mapGetters(["currentIndex", "playing", "currentSong"]),
  },
  methods: {
    ...mapActions([
      // 点击选择播放
      "selectPlay",
      "pausePlay",
    ]),
    // 获取推荐单曲
    async getNewSongs() {
      try {
        let ids = "";
        let res = await this.$api.getNewSongs();
        if (res.code == 200) {
          res.result.map((item) => {
            ids = ids + item.id + ",";
          });
        }
        ids = ids.substring(0, ids.length - 1);
        this.getSongDetail(ids);
      } catch (error) {
        console.log(error);
      }
    },
    async getSongDetail(ids) {
      try {
        let res = await this.$api.getSongDetail(ids);
        if (res.code == 200) {
          this.songs = this._normalizeSongs(res.songs);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 处理歌曲
    _normalizeSongs(list) {
      let ret = [];
      list.map((item) => {
        if (item.id) {
          ret.push(createSong(item));
        }
      });
      return ret;
    },
    playSong(item, index) {
      this.selectPlay({
        list: this.songs,
        index,
      });
      // 播放前先把正在播放的暂停播放，该方法较playerBar中的监听currentSong方法，有bug  播放器的图表会切换 闪一下
      /* this.pausePlay();
      setTimeout(() => {
        this.selectPlay({
          list: this.songs,
          index,
        });
      }, 0); */
    },
    pauseSong() {
      this.pausePlay();
    },
  },
  mounted() {
    this.getNewSongs();
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
.item {
  float: left;
  width: 550px;
  height: 80px;
  margin: 0 25px 25px 25px;
}
.index-container,
.info {
  float: left;
  margin-right: 20px;
}
.index-container {
  width: 70px;
  height: 70px;
  position: relative;
}
.bgImg {
  width: 70px;
  height: 70px;
  position: absolute;
  border-radius: 4px;
}
.bgImg img {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}
.bgImg::after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0);
  -webkit-transition: all 0.15s;
  transition: all 0.15s;
  border-radius: 4px;
}
.index-container .play-btn,
.index-container .pause-btn {
  line-height: 70px;
  color: red;
  font-size: 35px;
  display: none;
  text-align: center;
  cursor: pointer;
  position: relative;
}
.index-container .playing-icon {
  display: none;
  height: 16px;
  width: 20px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  margin-left: 25px;
  margin-top: 27px;
}
.playing-icon .line {
  width: 2px;
  height: 100%;
  margin-left: 2px;
  background-color: #ff410f;
  animation: play 0.9s linear infinite alternate;
}
.playing .index-container .play-btn {
  display: none;
}
.playing .index-container .playing-icon {
  display: flex;
}

.item:hover .bgImg::after {
  background: rgba(0, 0, 0, 0.5);
}
.item:hover .play-btn {
  display: block;
}
.playing:hover .play-btn {
  display: none;
}
.playing:hover .playing-icon {
  display: none;
}
.playing:hover .pause-btn {
  display: block;
}
.info {
  width: 350px;
  height: 100%;
}
.info h5 {
  margin: 10px 0 10px 0;
  height: 25%;
  line-height: 20px;
}
.time {
  font-weight: bold;
  font-weight: 14px;
  float: right;
  width: 50px;
  height: 70px;
  line-height: 70px;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>