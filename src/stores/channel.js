// src/stores/channel.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChannelStore = defineStore('channel', () => {
  const channelList = ref([]) // 存储分类数据
  const loading = ref(false)

  // 外部传入数据更新 channelList
  const setChannelList = (list) => {
    channelList.value = list
  }

  return {
    channelList,
    loading,
    setChannelList,
  }
})
