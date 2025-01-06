<script setup>
import { userRegisterService, userLoginService } from '@/api/user.js'
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
const isRegister = ref(true)
const form = ref()
const registerData = ref({
  username: '',
  password: '',
  repassword: '',
})
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名必须是5-10位的字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur',
    },
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15的非空字符',
      trigger: 'blur',
    },
    {
      validator: (rule, value, callback) => {
        if (value !== registerData.value.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}
const register = async () => {
  let result = await userRegisterService(registerData.value)
  ElMessage.success(result.msg ? result.msg : '注册成功')
}

import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const useStore = useUserStore()
const router = useRouter()

const login = async () => {
  await form.value.validate()
  const res = await userLoginService(registerData.value)
  // console.log(res.data.data)
  useStore.setToken(res.data.data) //!!存token
  ElMessage.success('登录成功')
  router.push('/')
}
watch(isRegister, () => {
  registerData.value = {
    username: '',
    password: '',
    repassword: '',
  }
})
</script>

<template>
  <el-row class="login-page">
    <el-col :span="14" class="bg"></el-col>
    <el-col :span="4" :offset="3" class="form">
      <el-form
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
        :model="registerData"
      >
        <el-form-item>
          <h1 style="color: #666">注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="registerData.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerData.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="registerData.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="register" class="button" type="primary" auto-insert-space>
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false"> ← 返回 </el-link>
        </el-form-item>
      </el-form>
      <el-form
        ref="form"
        size="large"
        autocomplete="off"
        v-else
        :model="registerData"
        :rules="rules"
      >
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            v-model="registerData.username"
            :prefix-icon="User"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
            v-model="registerData.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true"> 注册 → </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>


<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background: url('https://xinwencaochang.oss-cn-beijing.aliyuncs.com/d8615724-8077-4532-89cc-098832fe6373.png')
        no-repeat 50% center / 60px auto,
      url('https://xinwencaochang.oss-cn-beijing.aliyuncs.com/PixPin_2024-02-17_15-13-10.png')
        no-repeat center / cover;
    border-radius: 0 10px 10px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
  // 添加响应式媒体查询
  @media (max-width: 768px) {
    .login-page {
    background: url('https://xinwencaochang.oss-cn-beijing.aliyuncs.com/PixPin_2024-02-17_15-13-10.png') no-repeat center center;
    background-size: cover;
    }
    .bg {
      display: none; // 隐藏背景图片区域
    }

    .form {
      margin: 50px auto;
      padding: 40px;
      width: 100%;
      max-width: 90%;
      min-width: 50%;
    }
  }
  // 当设备宽度小于或等于 480px 时
  @media (max-width: 480px) {
    .form {
      max-width: 90%;//最大宽度不能超过父容器宽度的 90%
      min-width: 200px;//最小宽度为父容器宽度的 200px。当 max-width 和 min-width 发生冲突时（例如父容器的宽度小到 90% 的宽度低于 min-width），min-width 才会生效。
      padding: 20px;
      margin: 20px auto;
    }
    .flex {
      flex-direction: column;
      align-items: center;

      .el-checkbox {
        margin-bottom: 15px;
      }
    }
    .form h1 {
      font-size: 20px; // 缩小标题字体
    }

    .button {
      font-size: 14px; // 调整按钮文字大小
    }

    .el-form-item {
      margin-bottom: 15px; // 减少表单项间距
    }
    .el-button {
      min-height: 44px; // 保证按钮点击区域
    }
    .el-input {
      min-height: 44px;
    }
  }

</style>