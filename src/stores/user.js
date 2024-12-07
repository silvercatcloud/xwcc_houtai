import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('') // 定义 token
    const setToken = (t) => (token.value = t) // 设置 token
   //3.函数,移除token的值
   const removeToken = ()=>{
    token.value=''
}
    return { token, setToken,removeToken }
  },
  {
    persist: true // 持久化
  }
)
