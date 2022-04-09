<template>
  <div class="container">
    <div class="nav-bar">
      <div class="country">
        <span
          :class="lang == item.value ? 'active' : ''"
          v-for="item in langs"
          :key="item.value"
          @click="chooseType('lang', item.value)"
          >{{ item.label }}</span
        >
      </div>
      <div class="sex">
        <span
          :class="classify == item.value ? 'active' : ''"
          v-for="item in classifys"
          :key="item.value"
          @click="chooseType('classify', item.value)"
          >{{ item.label }}</span
        >
      </div>
      <div class="alphabet">
        <span
          :class="en == item.value ? 'active' : ''"
          v-for="item in ens"
          :key="item.value"
          @click="chooseType('en', item.value)"
          >{{ item.label }}</span
        >
      </div>
    </div>
    <ul class="list clearfix">
      <singerItem
        v-for="(item, index) in singers"
        :key="index"
        :item="item"
      ></singerItem>
    </ul>
    <!-- 加载动画 -->
    <div v-if="loading" class="load-bottom"></div>
  </div>
</template>

<script>
import singerItem from "@/components/common/singerItem";
export default {
  name: "Singer",
  components: { singerItem },
  data() {
    return {
      // 语种
      lang: -1,
      langs: [
        {
          value: -1,
          label: "全部",
        },
        {
          value: 7,
          label: "华语",
        },
        {
          value: 96,
          label: "欧美",
        },
        {
          value: 8,
          label: "日本",
        },
        {
          value: 16,
          label: "韩国",
        },
        {
          value: 0,
          label: "其他",
        },
      ],
      // 分类
      classify: -1,
      classifys: [
        {
          value: -1,
          label: "全部",
        },
        {
          value: 1,
          label: "男歌手",
        },
        {
          value: 2,
          label: "女歌手",
        },
        {
          value: 3,
          label: "乐队",
        },
      ],
      // 字母A_Z
      en: -1,
      ens: [],
      // 请求参数
      params: {
        // 返回数量
        limit: 60,
        // 偏移数量
        offset: 0,
        // 分类
        type: -1,
        // 语种
        area: -1,
        // 字母A_Z
        initial: -1,
      },
      // 歌手列表
      singers: [],
      // 是否显示加载动画
      loading: false,
      // 是否还有数据
      loadStatus: true,
    };
  },
  computed: {
    disabled() {
      return this.loadStatus;
    },
  },
  methods: {
    // 获取筛选列表
    getEn() {
      let ens = [];
      for (let i = 0; i < 26; i++) {
        ens.push({
          value: String.fromCharCode(97 + i),
          label: String.fromCharCode(65 + i),
        });
      }
      ens.unshift({
        value: -1,
        label: "热门",
      });
      ens.push({
        value: 0,
        label: "其他",
      });
      this.ens = ens;
    },
    // 获取歌手列表
    async getSingerList() {
      try {
        this.loadStatus = false;
        let res = await this.$api.getSingerList(this.params);
        console.log(res);
        if (res.code === 200) {
          this.singers = this.singers.concat(res.artists);
          if (res.more) {
            this.loading = true;
            this.loadStatus = true;
            this.params.offset += 30;
          } else {
            this.loading = false;
          }
        }
      } catch (error) {
        this.$message.error(error);
      }
    },
    // 选择歌手分类
    chooseType(type, val) {
      if (type == "lang") {
        this.lang = val;
        this.params.area = val;
      } else if (type == "classify") {
        this.classify = val;
        this.params.type = val;
      } else if (type == "en") {
        this.en = val;
        this.params.initial = val;
      }
      this.params.offset = 0;
      this.loadStatus = true;
      this.singers = [];
      this.getSingerList();
    },
    // 无限滚动
    load() {
      let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      let clientHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      let scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      if (scrollHeight - scrollTop - clientHeight < 100 && this.loadStatus) {
        this.$loading({
          lock: true, //lock的修改符--默认是false
          spinner: "el-icon-loading", //自定义加载图标类名
          target: document.querySelector(".load-bottom"), //loadin覆盖的dom元素节点
        });
        this.getSingerList();
      }
    },
  },
  mounted() {
    this.getEn();
    this.getSingerList();
    window.addEventListener("scroll", this.load);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.load);
  },
};
</script>

<style scoped>
.container {
  width: 1200px;
  padding-top: 75px;
  margin: 0px auto;
}
.nav-bar {
  width: 100%;
  height: 150px;
  margin-bottom: 20px;
}
.country,
.sex,
.alphabet {
  height: 33%;
  width: 100%;
}
.nav-bar span {
  display: inline-block;
  margin: 0 5px;
  width: 60px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 13px;
  cursor: pointer;
}
.active {
  display: inline-block;
  line-height: 30px;
  background-color: #ff0000;
  border-radius: 16px;
  color: #fff;
  font-weight: 700;
}
.alphabet span:nth-child(n + 2) {
  display: inline-block;
  margin: 0 5px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 12px;
  border-radius: 50%;
}
.list {
  width: 100%;
  height: 100%;
}
.load-bottom {
  width: 100%;
  height: 100px;
}
</style>

<style>
.el-icon-loading:before {
  color: #ff0000;
  content: "\e6cf";
  font-size: 50px;
}
</style>