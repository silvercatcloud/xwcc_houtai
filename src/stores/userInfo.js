import {defineStore} from 'pinia'
import {ref} from 'vue'
import {userInfoService} from '@/api/user'
const useUserInfoStore = defineStore('userInfo',()=>{
    //定义状态相关的内容
    const info = ref({})
    const setInfo = (newInfo)=>{
        info.value = newInfo
    }

    const removeInfo = ()=>{
        info.value = {}
    }
    const user = ref({})
    const getUser = async () => {
        const res = await userInfoService() // 请求获取数据
        user.value = res.data.data
      }
    const setUser = (obj) => (user.value = obj)
    return {info,setInfo,removeInfo,getUser,setUser,user}

},{persist:true})

export default useUserInfoStore;