import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
const baseURL = '/api';
const instance = axios.create({ baseURL })

instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const userStore = useUserStore()
    if (userStore.token) {//判断是否携带token，携带就添加到请求头。
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    // TODO 3. 处理业务失败
    // TODO 4. 摘取核心响应数据
    if (res.data.code === 0) {
        return res
      }
      ElMessage({ message: res.data.message || '服务异常', type: 'error' })//element-plus的提示框
      return Promise.reject(res.data)
  },
  (err) => {
    ElMessage({ message: err.response.data.message || '服务异常', type: 'error' })
    // console.log(err)
    // TODO 5. 处理401错误
    //错误的特殊情况   
    if (err.response?.status === 401) {
        router.push('/login')
      }
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }