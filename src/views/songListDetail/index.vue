<template>
  <div class="detail clearfix">
    <div class="main">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div class="img">
            <img :src="detail.coverImgUrl + '?param=200y200'" />
          </div>
          <div class="content">
            <h1>{{ detail.name }}</h1>
            <div class="info clearfix">
              <div class="avatar">
                <img :src="creator.avatarUrl + '?param=30y30'" />
              </div>
              <p class="nickName">{{ creator.nickname }}</p>
              <p class="time">
                {{ utils.dateFormat(detail.createTime, "YYYY-MM-DD") }}创建
              </p>
            </div>
            <div class="bread">
              <span>标签：</span>
              <a
                class="tag"
                v-for="item of detail.tags"
                :key="item"
                @click="toCatAbout(item)"
                >{{ item }}</a
              >
            </div>
            <div class="disc">
              <p class="ellipsis" v-html="detail.description"></p>
              <span>全部 ></span>
            </div>
          </div>
          <div class="button">
            <el-button
              style="background-color: #fa2800; color: white; font-size: 14px"
              round
              size="small"
              icon="el-icon-video-play"
              @click="playAllSong"
              >播放全部</el-button
            >
            <el-button
              style="background-color: #f2f2f2; font-size: 14px"
              round
              size="small"
              icon="el-icon-star-off"
              >收藏</el-button
            >
          </div>
        </div>
        <el-table :data="songs" stripe style="width: 100%">
          <el-table-column label="序号" align="center" width="50">
            <template slot-scope="{ row, $index }">
              <div
                :class="currentSong.id == row.id && playing ? 'playing' : ''"
              >
                <div class="index-container">
                  <span class="num">{{ $index + 1 }}</span>
                  <div class="playing-icon">
                    <div class="line" style="animation-delay: -1.2s"></div>
                    <div class="line"></div>
                    <div class="line" style="animation-delay: -1.5s"></div>
                    <div class="line" style="animation-delay: -0.9s"></div>
                    <div class="line" style="animation-delay: -0.6s"></div>
                  </div>
                  <i
                    class="iconfont icon-bofang1 play-btn"
                    @click="playSong(row, $index)"
                  ></i>
                  <i
                    class="iconfont icon-zanting1 pause-btn"
                    @click="pauseSong(row, $index)"
                  ></i>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="歌曲" width="250">
            <template slot-scope="{ row }">
              <div class="song clearFix">
                <div class="songImg">
                  <img :src="row.image + '?param=50y50'" />
                </div>
                <p class="songName ellipsis">{{ row.name }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="歌手" width="250"
            ><template slot-scope="{ row }">
              <p class="singer ellipsis">{{ row.name }}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="album"
            label="专辑"
            width="150"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column label="时长" align="center">
            <template slot-scope="{ row }">
              <span>{{ utils.formatSecondTime(row.duration) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div class="aside">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h3>喜欢这个歌单的人</h3>
        </div>
        <ul class="people clearfix">
          <li v-for="item in subscribers" :key="item.userId">
            <img :src="item.avatarUrl + '?param=35y35'" />
          </li>
        </ul>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h3>歌单推荐</h3>
        </div>
        <div>
          <div
            v-for="item in relatedPlaylist"
            :key="item.id"
            class="relatedList clearFix"
          >
            <div class="listImg">
              <img :src="item.coverImgUrl + '?param=50y50'" />
            </div>
            <div class="listInfo">
              <p class="ellipsis">{{ item.name }}</p>
              <span>By {{ item.creator.nickname }}</span>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <h3>精彩评论</h3>
        </div>
        <ul class="comment">
          <li v-for="item in comments" :key="item.time" class="clearFix">
            <div class="comImg">
              <img :src="item.user.avatarUrl + '?param=50y50'" />
            </div>
            <div class="comInfo">
              <h2>
                {{ item.user.nickname
                }}<small> . {{ utils.formatMsgTime(item.time) }}</small>
              </h2>
              <p>{{ item.content }}</p>
            </div>
          </li>
        </ul>
      </el-card>
    </div>
  </div>
</template>

<script>
import { createSong } from "@/model/song";
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "SongListDetail",
  data() {
    return {
      // 歌单详情
      detail: {},
      // 歌单创建者
      creator: {},
      // 歌曲列表
      songs: [],
      // 喜欢这个歌单的人
      subscribers: [],
      // 相关推荐歌单
      relatedPlaylist: [],
      // 评论
      comments: [],
    };
  },
  computed: {
    ...mapGetters(["currentSong", "playing"]),
  },
  methods: {
    ...mapActions(["selectPlay", "pausePlay", "playAll"]),
    // 歌单详情
    async getListDetail() {
      const id = this.$route.query.id;
      try {
        let res = await this.$api.getPlayListDetail(id);
        if (res.code == 200) {
          this.detail = res.playlist;
          this.creator = res.playlist.creator;
          let trackIds = res.playlist.trackIds;
          this.getSongDetail(trackIds);
          this.getSubscribersPlaylist();
          this.getRelatedPlaylist();
          this.getCommentPlaylist();
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 歌单歌曲列表
    async getSongDetail(trackIds) {
      let ids = "";
      trackIds.map((element) => {
        ids = ids + element.id + ",";
      });
      ids = ids.substring(0, ids.length - 1);
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
    // 收藏的人
    async getSubscribersPlaylist() {
      const id = this.$route.query.id;
      try {
        let res = await this.$api.getSubscribersPlaylist(id);
        if (res.code == 200) {
          this.subscribers = res.subscribers;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 歌单推荐
    async getRelatedPlaylist() {
      const id = this.$route.query.id;
      try {
        let res = await this.$api.getRelatedPlaylist(id);
        if (res.code == 200) {
          this.relatedPlaylist = res.playlists;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 歌单评论
    async getCommentPlaylist() {
      let params = {
        id: this.$route.query.id,
        limit: 28,
        offset: 0,
      };
      try {
        let res = await this.$api.getCommentPlaylist(params);
        if (res.code === 200) {
          if (res.hotComments.length > 0) {
            this.comments = res.hotComments;
          } else {
            this.comments = res.comments;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    playSong(item, index) {
      this.selectPlay({
        list: this.songs,
        index,
      });
    },
    pauseSong() {
      this.pausePlay();
    },
    playAllSong() {
      this.playAll({
        list: this.songs,
      });
    },
    toCatAbout(cat) {
      this.$router.push({ path: "/songlist", query: { cat } });
    },
  },
  mounted() {
    this.getListDetail();
  },
};
</script>

<style scoped>
.detail {
  position: relative;
  width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding-top: 75px;
}
.img {
  float: left;
  width: 200px;
  height: 200px;
  margin-right: 20px;
}
.content {
  float: left;
  width: 500px;
}
.content h1 {
  margin: 10px 0 10px 0;
}
.info {
  margin-bottom: 10px;
}
.main {
  float: left;
  width: 850px;
}
.aside {
  float: right;
  width: 330px;
}
.avatar {
  float: left;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}
.nickName,
.time {
  float: left;
  height: 100%;
  line-height: 30px;
  margin-right: 10px;
}
.tag {
  display: inline-block;
  width: 60px;
  text-align: center;
  color: white;
  border: 1px solid #fa2800;
  margin: 0 5px;
  background-color: #fa2800;
  border-radius: 999em;
  cursor: pointer;
}
.bread {
  height: 35px;
  line-height: 30px;
  margin-bottom: 10px;
}
.disc p {
  font-size: 14px;
  width: 300px;
  margin: 20px 0;
}
.disc span {
  font-size: 14px;
  color: red;
}
.button {
  float: right;
  margin: 30px 10px 10px 0;
}
.song {
  width: 100%;
  height: 100%;
}
.songImg,
.songName {
  float: left;
}
.songImg {
  width: 35px;
  height: 35px;
  overflow: hidden;
  margin-right: 10px;
}
.songName {
  width: 150px;
  line-height: 35px;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.people {
  margin-top: 10px;
}
.people li {
  float: left;
  padding: 0 5px 10px;
}
.listImg {
  float: left;
  width: 50px;
  height: 50px;
  margin-right: 10px;
}
.listInfo {
  float: left;
}
.listInfo p {
  width: 200px;
  font-size: 14px;
  margin-bottom: 10px;
}
.listInfo span {
  color: #a5add3;
  font-size: 12px;
}
.relatedList {
  margin-bottom: 10px;
}
.comment li {
  margin-bottom: 20px;
  width: 100%;
}
.comImg,
.comInfo {
  float: left;
}
.comImg {
  margin-right: 10px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  overflow: hidden;
}
.comInfo {
  width: 220px;
}
.comInfo h2 {
  font-size: 15px;
  margin-bottom: 10px;
}
.comInfo p {
  border-radius: 3px;
  font-size: 12px;
  color: #666;
  padding: 5px;
  background: #f5f5f5;
}
.comInfo small {
  font-size: 12px;
  color: #a5a5c1;
  font-weight: 200;
}
/* ele */
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
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
  margin-bottom: 20px;
}
.index-container {
  /* float: left; */
  width: 30px;
  height: 30px;
  position: relative;
  /* line-height: 30px; */
  text-align: center;
  /* margin-right: 10px; */
}
.index-container .num {
  line-height: 30px;
}
.index-container .play-btn,
.index-container .pause-btn {
  line-height: 30px;
  color: red;
  font-size: 30px;
  display: none;
  text-align: center;
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
}
.index-container .playing-icon {
  display: none;
  height: 16px;
  width: 20px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  margin-left: 5px;
  top: 7px;
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
.playing .index-container .num {
  display: none;
}
.el-table--enable-row-hover
  .el-table__body
  tr:hover
  > td.el-table__cell
  .play-btn {
  display: block !important;
}
.el-table--enable-row-hover
  .el-table__body
  tr:hover
  > td.el-table__cell
  .playing
  .play-btn {
  display: none !important;
}
.el-table--enable-row-hover
  .el-table__body
  tr:hover
  > td.el-table__cell
  .playing
  .playing-icon {
  display: none !important;
}
.el-table--enable-row-hover
  .el-table__body
  tr:hover
  > td.el-table__cell
  .playing
  .pause-btn {
  display: block !important;
}
.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell .num {
  display: none !important;
}
</style>