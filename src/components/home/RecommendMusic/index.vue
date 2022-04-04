<template>
  <div>
    <h2 class="title">推荐单曲</h2>
    <div class="list clearfix">
      <div class="item" v-for="(item, index) in songs" :key="item.id">
        <div class="bgImg">
          <img :src="item.image + '?param=200y200'" />
          <img
            class="playIcon"
            src="./images/播放 (2).png"
            @click="playSong(item, index)"
            v-show="!playing || currentIndex !== index"
          />
          <img
            class="playIcon"
            src="./images/暂停.png"
            @click="pauseSong(item, index)"
            v-show="currentIndex == index && playing"
          />
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
.bgImg,
.info {
  float: left;
  margin-right: 20px;
}
.bgImg {
  width: 70px;
  height: 70px;
  position: relative;
}
.bgImg img {
  position: absolute;
  width: 70px;
  height: 70px;
}
.bgImg .playIcon {
  position: absolute;
  width: 30px;
  height: 30px;
  display: none;
  top: 50%;
  margin-top: -15px;
  left: 50%;
  margin-left: -15px;
}
.item:hover .playIcon {
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