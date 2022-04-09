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

/**
 * @method 获取排行榜内容摘要
 */
export const getToplist = () => api.get(`/toplist/detail`)

/**
 * @method 获取歌单分类
 */
export const getCatList = () => api.get(`/playlist/catlist`)

/**
 * @method 获取热门歌单分类
 */
export const getHotlist = () => api.get(`/playlist/hot`)

/**
 * @method 获取歌单
 */
export const getPlayList = params => api.get(`/top/playlist`, { params })

/**
 * @method 获取歌手分类列表
 * @params cat 即 category Code,歌手类型,默认 1001,返回华语男歌手数据
 * @params limit 返回数量 , 默认为30
 * @params offset 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @params initial 按首字母索引查找参数, 如 /artist/list?type=1&area=96&initial=b 返回内容将以 name 字段开头为 b 或者拼音开头为 b 为顺序排列, 热门传-1,#传0
 */
export const getSingerList = params => api.get(`/artist/list`, { params })