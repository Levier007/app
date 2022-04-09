<template>
  <div class="container">
    <div class="nav-bar shadow clearfix">
      <div class="title" @click="openFilter">
        {{ currentCat }}
        <i
          :class="showFilter ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
          style="
            display: inline-block;
            margin-left: 10px;
            font-size: 16px;
            line-height: 40px;
            height: 100%;
          "
        ></i>
        <transition name="fade">
          <el-card class="box-card" v-if="showFilter">
            <div class="item" v-for="(item, index) of cateList" :key="index">
              <h3>{{ item.type }}</h3>
              <ul class="tag clearfix">
                <li
                  :style="
                    sub.name == currentCat
                      ? 'background-color:#ff0000;color:#fff'
                      : ''
                  "
                  v-for="sub of item.list"
                  :key="sub.name"
                  @click="chooseCat(sub.name)"
                >
                  {{ sub.name }}
                </li>
              </ul>
            </div>
          </el-card>
        </transition>
      </div>
      <div class="hot-tag clearfix">
        <p>热门标签：</p>
        <ul class="clearfix">
          <li
            :style="currentCat == item.name ? 'color:#ff0000' : ''"
            v-for="item in hotCategories"
            :key="item.id"
            @click="chooseCat(item.name)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div
        :style="
          sortType == 'new' ? 'background-color: #ff0000;color: #fff;' : ''
        "
        class="tag-span"
        @click="chooseType('new')"
      >
        最新
      </div>
      <div
        :style="
          sortType == 'hot' ? 'background-color: #ff0000;color: #fff;' : ''
        "
        class="tag-span"
        @click="chooseType('hot')"
      >
        热门
      </div>
    </div>
    <div class="content clearfix">
      <songSheet
        v-for="item in playList"
        :key="item.id"
        :item="item"
        @click.native="toDetail(item)"
      >
      </songSheet>
    </div>
    <el-pagination
      background
      hide-on-single-page
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="limit"
      layout="total, prev, pager, next"
      :total="pageTotal"
    >
    </el-pagination>
  </div>
</template>

<script>
import songSheet from "@/components/common/songSheet";
export default {
  name: "SongList",
  components: { songSheet },
  data() {
    return {
      categories: {},
      hotCategories: [],
      currentCat: "全部",
      sortType: "hot",
      limit: 40,
      offset: 0,
      pageTotal: 0,
      cateList: [],
      playList: [],
      currentPage: 1,
      showFilter: false,
    };
  },
  methods: {
    openFilter() {
      this.showFilter = !this.showFilter;
    },
    // 跳转详情页
    toDetail(item) {
      this.$router.push({
        name: "songlistdetail",
        query: { id: item.id },
      });
    },
    // 获取歌单分类
    async getCatList() {
      try {
        let res = await this.$api.getCatList();
        if (res.code === 200) {
          this.categories = res.categories;
          this.categoryGroup(res.sub, res.categories);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取热门歌单分类
    async getHotlist() {
      try {
        let res = await this.$api.getHotlist();
        if (res.code === 200) {
          this.hotCategories = res.tags;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 获取歌单 默认全部
    async getPlayList() {
      // this.fullscreenLoading = true;
      let param = {
        order: this.sortType,
        cat: this.currentCat,
        limit: this.limit,
        offset: (this.currentPage - 1) * this.limit,
      };
      try {
        let res = await this.$api.getPlayList(param);
        if (res.code === 200) {
          this.playList = res.playlists;
          this.pageTotal = res.total;
          // this.fullscreenLoading = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 类别分组
    categoryGroup(list, cat) {
      let type = "";
      let cateList = [];
      for (let i = 0; i < Object.keys(cat).length; i++) {
        let listArr = [];
        list.forEach((item) => {
          if (item.category == i) {
            listArr.push(item);
          }
        });
        switch (i) {
          case 0:
            type = "语种";
            break;
          case 1:
            type = "风格";
            break;
          case 2:
            type = "场景";
            break;
          case 3:
            type = "情感";
            break;
          case 4:
            type = "主题";
            break;
          default:
            break;
        }
        cateList.push({ category: i, list: listArr, type: type });
      }
      this.cateList = cateList;
    },
    // tag跳转
    chooseCat(cat) {
      this.currentCat = cat;
      this.getPlayList();
    },
    // 选择最新或者热门
    chooseType(type) {
      this.sortType = type;
      this.getPlayList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val - 1) * this.limit;
      this.getPlayList();
    },
  },
  mounted() {
    let cat = this.$route.query.cat;
    if (cat) {
      this.currentCat = cat;
    }
    this.getHotlist();
    this.getCatList();
    this.getPlayList();
  },
};
</script>

<style scoped>
.fade-enter {
  opacity: 0;
  transform: translate3d(0, 30px, 0);
}

.fade-enter-active {
  transition: all 0.5s;
}

.fade-leave-to {
  opacity: 0;
  transform: translate3d(0, 30px, 0);
}

.fade-leave-active {
  transition: all 0.5s;
}
.container {
  width: 1200px;
  padding-top: 75px;
  margin: 0px auto;
}
.nav-bar {
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
}
.title {
  box-sizing: border-box;
  float: left;
  height: 100%;
  background-color: #ff0000;
  color: #fff;
  cursor: pointer;
  border-radius: 5px 0px 5px 5px;
  margin-right: 15px;
  padding: 0 5px 0 15px;
  line-height: 40px;
  font-size: 14px;
  position: relative;
}
.hot-tag {
  float: left;
  height: 100%;
}
.hot-tag p,
.hot-tag ul,
.hot-tag li {
  float: left;
  line-height: 40px;
  font-size: 14px;
}
.hot-tag ul {
  margin-left: 10px;
}
.hot-tag li {
  margin: 0 8px;
  cursor: pointer;
}
.shadow {
  background-color: #ffffff;
  -webkit-box-shadow: 0px 5px 40px -1px rgba(2, 10, 18, 0.1);
  box-shadow: 0px 5px 40px -1px rgba(2, 10, 18, 0.1);
}
/deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #ff0000;
  color: #fff;
}
.content {
  width: 100%;
  margin-bottom: 10px;
}
.box-card {
  width: 720px;
  height: 400px;
  overflow: hidden;
  overflow-y: scroll;
  overscroll-behavior: contain;
  position: absolute;
  z-index: 10;
  top: 100%;
  left: 0;
  margin-top: 10px;
}
.tag li {
  box-sizing: border-box;
  float: left;
  height: 35px;
  line-height: 35px;
  text-align: center;
  margin: 0 10px 10px 0;
  padding: 0px 18px;
  background-color: #f7f7f7;
  border-radius: 16px;
  transition: all 0.4s;
  font-size: 12px;
}
.tag li:hover {
  background-color: #ff0000;
  color: #fff;
}
.tag-span {
  display: block;
  width: 50px;
  height: 30px;
  float: right;
  margin: 5px 5px 0 0;
  text-align: center;
  line-height: 30px;
  background-color: #f7f7f7;
  border-radius: 3px;
  cursor: pointer;
}
</style>

<style>
.el-pagination {
  text-align: center;
  margin-bottom: 20px;
}
</style>