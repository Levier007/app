<template>
  <transition name="slide-fade">
    <div v-show="playList.length > 0">
      <div class="abar"></div>
      <div class="bar">
        <div class="container clearfix">
          <div class="player-btn">
            <img
              src="./images/上一个.png"
              style="width: 30px; height: 30px"
              @click="prevSong"
            />
            <img
              class="btn2"
              src="./images/播放 (2).png"
              style="width: 50px; height: 50px"
              @click="changePlaying"
              v-show="!playing"
            />
            <img
              class="btn2"
              src="./images/暂停.png"
              style="width: 50px; height: 50px"
              @click="changePlaying"
              v-show="playing"
            />
            <img
              src="./images/下一个.png"
              style="width: 30px; height: 30px"
              @click="nextSong"
            />
          </div>
          <div class="bar-center">
            <div class="bar-img">
              <img :src="currentSong.image + '?param=50y50'" />
            </div>
            <div class="info">
              <div class="top clearfix">
                <div
                  style="
                    height: 20px;
                    float: left;
                    line-height: 20px;
                    font-weight: bold;
                    font-size: 14px;
                    margin-right: 20px;
                  "
                >
                  {{ currentSong.name }}
                </div>
                <div
                  class="ellipsis"
                  style="
                    float: left;
                    width: 150px;
                    height: 20px;
                    line-height: 20px;
                    font-size: 12px;
                  "
                >
                  {{ currentSong.singer }}
                </div>
                <div style="float: right; height: 20px; line-height: 20px">
                  {{
                    utils.formatSecondTime(
                      (percent / 100) * currentSong.duration
                    )
                  }}
                  / {{ utils.formatSecondTime(currentSong.duration) }}
                </div>
              </div>
              <div class="block">
                <el-slider
                  v-model="percent"
                  :format-tooltip="formatTooltip"
                  @change="changeProgress"
                  @mousedown.native="progressState = true"
                  @mouseup.native="changeProgressState"
                ></el-slider>
              </div>
            </div>
          </div>
          <div class="bar-right">
            <div class="volume clearfix">
              <div class="vol-icon">
                <i class="iconfont" :class="mutedIcon" @click="mutedHandle"></i>
              </div>
              <div class="vol-slider">
                <el-slider
                  v-model="volumeNum"
                  @input="changeVolume"
                ></el-slider>
              </div>
            </div>
            <div class="tool">
              <div class="vol-icon">
                <i
                  class="iconfont"
                  :class="modeIcon"
                  @click="changePlayMode"
                ></i>
                <i class="iconfont icon-geciweidianji" @click="openLyric"></i>
                <i class="iconfont icon-24gl-playlistMusic5"></i>
              </div>
            </div>
          </div>
          <audio
            ref="audio"
            :src="currentSong.url"
            @playing="audioReady"
            @pause="audioPaused"
            @timeupdate="updateTime"
            @ended="audioEnd"
          ></audio>
        </div>
      </div>
      <!-- 歌词界面 -->
      <transition name="slide-fade">
        <div class="lyric-page" v-show="showLyric">
          <div class="lyric-left">
            <div class="cover-image" :class="playing ? 'playing' : ''">
              <img :src="currentSong.image" />
            </div>
          </div>
          <div class="lyric-right">
            <el-card class="box-card">
              <div class="clearfix card__header">
                <div class="clearfix">
                  <h3
                    style="
                      float: left;
                      padding: 3px 0;
                      line-height: 22px;
                      font-size: 24px;
                      font-weight: bold;
                    "
                  >
                    {{ currentSong.name }}
                  </h3>
                  <el-button
                    style="float: right; padding: 3px 0"
                    type="text"
                    @click="openLyric"
                    >返回</el-button
                  >
                </div>
                <p style="margin: 20px 0">
                  {{ currentSong.singer }} - {{ currentSong.album }}
                </p>
              </div>
              <div class="lyric-wrap">
                <NLyric
                  ref="lyricRef"
                  :currentLyric="currentLyric"
                  :currentLyricNum="currentLyricNum"
                ></NLyric>
              </div>
            </el-card>
          </div>
        </div>
      </transition>
    </div>
    </transition>
</template>

<script>
import Lyric from "lyric-parser";
import { playMode } from "@/common/playConfig";
import { mapGetters, mapMutations, mapActions } from "vuex";
import NLyric from "@/components/playerBar/lyric";
export default {
  name: "PlayerBar",
  components: { NLyric },
  data() {
    return {
      // 歌曲是否为准备播放的状态）
      songReady: false,
      // 进度条当前的百分百（即currentTime/duration）
      percent: 0,
      // 当前播放歌曲的时间点
      currentTime: 0,
      // 是否静音
      isMuted: false,
      // 默认音量
      volume: 0.5,
      // 拖动条默认值
      volumeNum: 50,
      // slider是否处于拖动状态 解决鼠标拖拽slider滑块滑动到指定位置无效
      progressState: false,
      // 歌词界面是否打开
      showLyric: false,
      // 当前歌曲的全部歌词
      currentLyric: null,
      // 当前歌曲的全部歌词的行数
      currentLyricNum: 0,
      // 当前播放的某句
      playingLyric: "",
      // 是否为纯音乐
      isPureMusic: false,
      // 纯音乐的歌词
      pureMusicLyric: "",
    };
  },
  computed: {
    ...mapGetters([
      "playList",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList",
      "historyList",
    ]),
    // 播放模式图标 默认为sequence
    modeIcon() {
      return this.mode === playMode.sequence
        ? "icon-xunhuanbofang"
        : this.mode === playMode.loop
        ? "icon-danquxunhuan"
        : "icon-suijibofang";
    },
    // 是否静音
    mutedIcon() {
      return this.isMuted
        ? "icon-24gf-volumeDisable"
        : "icon-24gl-volumeMiddle";
    },
  },
  watch: {
    // 监听歌曲内容变化(比如切换歌曲时或者随机模式，单循循环模式时或首次播放时)
    currentSong(newSong, oldSong) {
      // 随机播放时当前歌曲的index值，playList也发生变化，currentSong是根据index值来获取的，虽然此时实际播放歌曲没发生变化，但不加一下判断 会导致正在播放的歌曲切换到随机播放时会跳到起点重新播放
      if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
        return;
      }
      this.getLyric(newSong.id);
      this.songReady = false;
      if (this.currentLyric) {
        this.currentLyric.stop();
        // 重置为null
        this.currentLyric = null;
        this.currentTime = 0;
        this.playingLyric = "";
        this.currentLyricNum = 0;
      }
      this.$nextTick(() => {
        // 切歌后重新获取audio标签并修改当前audio标签相关属性值
        const audio = this.$refs.audio;
        if (audio) {
          audio.src = newSong.url;
          audio.volume = this.volume;
          audio.play();
          // this.saveHistoryList(newSong);
          this.id = newSong.id;
        }
      });
      // 若歌曲 5s 未播放，则认为超时，修改状态确保可以切换歌曲。
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.songReady = true;
      }, 5000);
    },
    // 监听播放状态 isPlaying是当前playing的值（最新值）
    playing(isPlaying) {
      if (!this.songReady) {
        return;
      }
      this.$nextTick(() => {
        const audio = this.$refs.audio;
        if (audio) {
          // 通过布尔值执行播放还是暂停
          isPlaying ? audio.play() : audio.pause();
        }
      });
    },
  },
  methods: {
    formatTooltip(val) {
      return this.utils.formatSecondTime(
        (val * this.currentSong.duration) / 100
      );
    },
    ...mapMutations({
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAYLIST",
    }),
    ...mapActions([
      "saveHistoryList",
      "deleteHistoryList",
      "clearHistoryList",
      "selectPlay",
      "pausePlay",
    ]),
    // 播放时的操作
    audioReady() {
      clearTimeout(this.timer);
      this.songReady = true;
      if (this.currentLyric && !this.isPureMusic) {
        this.currentLyric.seek(this.currentTime * 1000);
      }
    },
    // 改变播放状态(当前是否播放的状态)
    changePlaying() {
      if (!this.songReady) {
        return;
      }
      this.setPlayingState(!this.playing);
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    // 歌曲暂停
    audioPaused() {
      this.setPlayingState(false);
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
    },
    // 监听播放时间改变
    updateTime(e) {
      if (!this.progressState) {
        this.currentTime = e.target.currentTime;
        this.percent = (e.target.currentTime / this.currentSong.duration) * 100;
      }
    },
    // 拖动进度条改变播放进度时(鼠标拖拽松开时触发)
    changeProgress(per) {
      const audio = this.$refs.audio;
      const currentTime = (per / 100) * this.currentSong.duration;
      this.currentTime = currentTime;
      this.percent = per;
      audio.currentTime = currentTime;
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
      if (!this.playing) {
        this.changePlaying();
      }
    },
    // 拖动结束后
    changeProgressState(e) {
      this.progressState = false;
    },
    // 调整音量
    changeVolume(e) {
      const audio = this.$refs.audio;
      this.volume = e / 100;
      audio.volume = this.volume;
      if (this.volume == 0) {
        this.isMuted = true;
      } else {
        this.isMuted = false;
      }
    },
    // 静音切换
    mutedHandle() {
      if (!this.isMuted) {
        this.isMuted = true;
        this.volumeNum = 0;
        this.volume = 0;
      } else {
        this.isMuted = false;
        this.volume = 0.5;
        this.volumeNum = 50;
      }
    },
    // 上一首
    prevSong() {
      if (!this.songReady) {
        return;
      }
      if (this.currentIndex === 0) {
        this.setCurrentIndex(this.playList.length - 1);
      } else {
        let index = this.currentIndex - 1;
        this.setCurrentIndex(index);
      }
      if (!this.playing) {
        this.changePlaying();
      }
    },
    // 下一首
    nextSong() {
      if (!this.songReady) {
        return;
      }
      if (this.currentIndex === this.playList.length - 1) {
        this.setCurrentIndex(0);
      } else {
        let index = this.currentIndex + 1;
        this.setCurrentIndex(index);
      }
      if (!this.playing) {
        this.changePlaying();
      }
    },
    // 获取歌词
    async getLyric() {
      try {
        let res = await this.$api.getLyric(this.currentSong.id);
        if (res.code === 200) {
          let lyric = res.lrc.lyric;
          this.currentLyric = new Lyric(lyric, this.lyricHandle);
          if (this.isPureMusic) {
            this.playingLyric = this.currentLyric.lrc.replace(
              /\[(\d{2}):(\d{2}):(\d{2})\]/g,
              ""
            );
          } else {
            if (this.playing) {
              this.currentLyric.seek(this.currentTime * 1000);
            }
          }
        }
      } catch (error) {
        this.currentLyric = null;
        this.playingLyric = "";
        this.currentLyricNum = 0;
      }
    },
    // 歌词回调 （暂未明白.）
    lyricHandle({ lineNum, txt }) {
      if (!this.$refs.lyricRef.$refs.lyricLine) {
        return;
      }
      this.currentLyricNum = lineNum;
      this.playingLyric = txt;
      if (lineNum > 10) {
        let lineEl = this.$refs.lyricRef.$refs.lyricLine[lineNum - 10];
        if (this.$refs.lyricRef.$refs.lyricList) {
          this.$nextTick(() => {
            this.$refs.lyricRef.$refs.lyricList.scrollToElement(lineEl, 1000);
          });
        }
      } else {
        if (this.$refs.lyricRef.$refs.lyricList) {
          this.$nextTick(() => {
            this.$refs.lyricRef.$refs.lyricList.scrollTo(0, 0, 1000);
          });
        }
      }
    },
    // 展开歌词界面
    openLyric() {
      this.showLyric = !this.showLyric;
    },
    // 播放结束 单曲循环或者自动切换下一首
    audioEnd() {
      // this.currentTime = 0
      if (this.mode === playMode.loop) {
        this.loopSong();
      } else {
        this.nextSong();
      }
    },
    // 循环播放
    loopSong() {
      this.setCurrentIndex(this.currentIndex);
      if (!this.playing) {
        this.changePlaying();
      }
      if (this.currentLyric) {
        this.currentLyric.seek(0);
      }
    },
    // 切换随机顺序单曲循环等播放模式（随机播放会使当前播放列表变化，索引值从而变化）
    changePlayMode() {
      const currentMode = (this.mode + 1) % 3;
      console.log(currentMode);
      this.setPlayMode(currentMode);
      let list = null;
      if (currentMode === playMode.random) {
        list = this.utils.shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    // 重置当前播放歌曲的索引 比如当前播放歌曲A在顺序列表中的索引为2，当随机播放时产生新的随机播放列表，此时若不改变当前歌曲A的索引值，可能会直接切歌到随机列表中索引值为2的歌曲，为保证切换到随机模式时当前歌曲正常播放，故需重置当前索引值
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => item.id === this.currentSong.id);
      this.setCurrentIndex(index);
    },
  },
  mounted() {
    // 监听slider中的mouseup事件，防止拖拽进度条松开时，鼠标离开特定区域造成事件丢失不生效
    window.addEventListener("mouseup", this.changeProgressState);
  },
};
</script>


<style scoped>
.slide-fade-enter-active {
  transition: all 0.5s ease;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.5, 0.3, 0.2, 0.5);
}

.slide-fade-enter,
.slide-fade-leave-to {
  opacity: 0;
}
.abar {
  width: 100%;
  height: 72px;
}
.bar {
  width: 100%;
  height: 72px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  background-color: #242424;
}
.container {
  position: relative;
  width: 1200px;
  height: 72px;
  margin: 0 auto;
  color: #fff;
}
.player-btn {
  float: left;
  width: 150px;
  height: 72px;
}
.player-btn img {
  display: block;
  float: left;
}
.player-btn img:first-child,
.player-btn img:last-child {
  margin-top: 21px;
}
.player-btn .btn2 {
  margin-top: 11px;
  margin-left: 5px;
  margin-right: 5px;
}
.bar-center {
  float: left;
  width: 680px;
  height: 72px;
  margin: 0 35px;
}
.bar-img {
  width: 50px;
  height: 50px;
  float: left;
  background-color: #fff;
  margin-top: 11px;
  margin-right: 20px;
}
.info {
  float: left;
  width: 600px;
  height: 50px;
  margin-top: 11px;
}
.top {
  color: #fff;
}
.bar-right {
  float: right;
  width: 300px;
  height: 72px;
}
.volume,
.tool {
  float: left;
  width: 150px;
  height: 50px;
  margin-top: 11px;
}
.vol-icon {
  width: 30px;
  height: 30px;
  float: left;
  text-align: center;
  line-height: 30px;
  margin-top: 10px;
  margin-right: 10px;
}
.vol-slider {
  float: left;
  width: 100px;
  height: 50px;
  padding-top: 6px;
}
.tool .vol-icon {
  width: 100%;
}
.tool .vol-icon i {
  display: inline-block;
  margin: 0 15px;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/ .el-slider__button {
  width: 10px;
  height: 10px;
}
/deep/ .el-slider__button-wrapper {
  top: -16px;
}
/deep/ .el-slider__runway {
  height: 4px;
  margin: 17px 0;
}
/deep/ .el-slider__bar {
  height: 4px;
  background-color: #c20c0c;
}
/deep/ .el-slider__button {
  border: 1px solid #c20c0c;
}
.lyric-page {
  z-index: 100;
  width: 1200px;
  height: 100vh;
  background-color: #fff;
  position: fixed;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  padding-top: 200px;
}
.lyric-left,
.lyric-right {
  float: left;
  width: 50%;
}
.cover-image {
  width: 400px;
  height: 400px;
  position: relative;
}
.cover-image img {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  z-index: 2;
  opacity: 1;
  overflow: hidden;
  border-radius: 5px;
  box-shadow: 5px 0 10px -5px #141414;
}
.cover-image::after {
  content: "";
  position: absolute;
  left: 20%;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.8s 0.5s;
  background: transparent url("../../assets/images/cd-wrap.png") center
    no-repeat;
  background-size: contain;
}
.playing::after {
  animation: rotate 2s linear infinite;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
}
.card__header {
  padding: 10px 0px;
  font-size: 14px;
}
.lyric-wrap {
  margin: 0 auto;
  height: 480px;
  border-radius: 4px;
  padding: 30px;
  overflow: hidden;
  background: #f8f9ff;
  margin-top: 30px;
}
</style>