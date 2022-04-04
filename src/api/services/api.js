import api from './instance'
/**
 * @method 获取轮播图
 */
export const getBanner = () => api.get('/banner')

/**
 * @method 获取推荐歌单
 * @params limit 取出数量默认为 30
 */
export const getPersonalized = limit =>
    api.get(`/personalized?limit=${limit}`)

/**
 * @method 获取推荐歌曲
 */
export const getNewSongs = () => api.get(`/personalized/newsong`)

/**
 * @method 获取热门歌手
 */
export const getHotSinger = () => api.get(`/top/artists?offset=0&limit=30`)

/**
 * @method 获取歌单详情
 */
export const getPlayListDetail = (id) => api.get(`/playlist/detail?id=${id}`)

/**
 * @method 获取歌单详情中歌曲详情
 */
export const getSongDetail = (ids) => api.post(`/song/detail?ids=${ids}`)

/**
 * @method 歌单收藏者
 * @params id 歌单 id
 * @params limit 取出评论数量 默认为 20
 * @params offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 */
export const getSubscribersPlaylist = (id) => api.get(`/playlist/subscribers?id=${id}`)

/**
 * @method 相关歌单推荐
 */
export const getRelatedPlaylist = id => api.get(`/related/playlist?id=${id}`)

/**
 * @method 歌单评论
 * @params id 歌单 id
 * @params limit 取出评论数量 默认为 20
 * @params offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * @params before 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过5000条评论的时候需要用到)
 */
export const getCommentPlaylist = params => api.get(`/comment/playlist`, { params })

/**
 * @method 获取歌词
 */
export const getLyric = id => api.get(`/lyric?id=${id}`)