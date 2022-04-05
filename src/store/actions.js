import * as types from './mutation-type'
import { playMode } from '@/common/playConfig'
import utils from '@/utils/utils'
import { saveSearch, deleteSearch, clearSearch, saveHistory, deleteHistory, clearHistory } from '@/common/cache'

function findIndex(list, song) {
    // findIndex()方法返回数组中满足提供的测试函数的第一个元素的索引。若没有找到对应元素则返回-1
    /* 遍历新数组中每首歌的id与当前歌的id是否匹配，若匹配上则返回当前item的索引值 */
    return list.findIndex(item => {
        return item.id === song.id
    })
}
// 选择播放
/* 选择播放时 需要做：1当前是否播放的状态（true fasle）,audio标签需根据此状态进行播放与否  2当前播放歌曲在数组中的索引 3把当前播放歌曲所在的数组假如播放列表 4 考虑是否为随机播放状态 若为随机 在原数组基础上随机生成新的数组 且把当前播放歌曲的索引值重新定义 获得在新数组中的索引值（所谓的随机播放其实就是生成新的随机数组再顺序播放） */
export const selectPlay = function({ commit, state }, { list, index }) {
    commit(types.SET_SEQUENCE_LIST, list)
    if (state.mode === playMode.random) {
        let randomList = utils.shuffle(list)
        commit(types.SET_PLAYLIST, randomList)
        index = findIndex(randomList, list[index])
    } else {
        commit(types.SET_PLAYLIST, list)
    }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_PLAYING_STATE, true)
}

// 暂停播放
export const pausePlay = function({ commit }) {
    commit(types.SET_PLAYING_STATE, false)
}

// 设置最近播放歌曲
export const saveHistoryList = function({ commit }, song) {
    commit(types.SET_HISTORY_LIST, saveHistory(song))
}

// 移除最近播放歌曲(单个)
export const deleteHistoryList = function({ commit }, song) {
    commit(types.SET_HISTORY_LIST, deleteHistory(song))
}

// 移除全部最近播放
export const clearHistoryList = function({ commit }) {
    commit(types.SET_HISTORY_LIST, clearHistory())
}