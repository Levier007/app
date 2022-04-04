import Vue from 'vue'
import App from './App.vue'
// 引入路由
import router from '@/router'
// 引入store配置项
import store from '@/store';
// 引入请求文件
import getApi from '@/api';
// 引入elementUI组件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 引入swiper样式
import "swiper/css/swiper.css"
// 引入utils
import utils from '@/utils/utils';
Vue.prototype.utils = utils


Vue.config.productionTip = false
Vue.prototype.$msgbox = ElementUI.MessageBox
Vue.prototype.$alert = ElementUI.MessageBox.alert
Vue.prototype.$confirm = ElementUI.MessageBox.confirm
Vue.prototype.$prompt = ElementUI.MessageBox.prompt
Vue.prototype.$notify = ElementUI.Notification
Vue.prototype.$message = ElementUI.Message
Vue.prototype.$api = getApi

new Vue({
    render: h => h(App),
    // 全局事件总线的配置
    beforeCreate() {
        Vue.prototype.$bus = this;
    },
    router,
    store
}).$mount('#app')