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

let isFirstLoad = true;

instance.interceptors.response.use(
  (res) => {
    if (res.data.code === 0) {
      return res;
    }

    if (!isFirstLoad) {
      ElMessage({ message: res.data.message || '服务异常', type: 'error' });
    }

    return Promise.reject(res.data);
  },
  (err) => {
    if (!isFirstLoad) {
      ElMessage({ message: err.response?.data.message || '服务异常', type: 'error' });
    }

    if (err.response?.status === 401) {
      router.push('/login');
    }

    return Promise.reject(err);
  }
);

// 设置首次加载标记
setTimeout(() => {
  isFirstLoad = false;
}, 3000); // 3秒后解除首次加载限制

export default instance
export { baseURL }