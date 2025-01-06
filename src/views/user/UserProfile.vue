<script setup>
import useUserInfoStore from '@/stores/userInfo.js'
import PageContainer from '@/components/PageContainer.vue'
const userInfoStore = useUserInfoStore()

const userInfo = ref({ ...userInfoStore.info })
import { ref } from 'vue'
// const {
//   user: { username, email, id },
// } = useUserInfoStore()

// const userInfo = ref({ username, email, id })

const rules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称必须是2-10位的非空字符串',
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
}
//修改个人信息
import { userInfoUpdateService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
const updateUserInfo = async () => {
  // console.log(userInfo.value)
  //调用接口
  let result = await userInfoUpdateService(userInfo.value)
  ElMessage.success(result.msg ? result.msg : '修改成功')

  //修改pinia中的个人信息
  userInfoStore.setInfo(userInfo.value)
}
</script>
<template>
  <page-container title="基本资料">
    <el-row :gutter="20" justify="center">
      <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="10">
        <el-form :model="userInfo" :rules="rules" ref="formRef" label-width="100px" size="large">
          <el-form-item label="登录名称">
            <el-input v-model="userInfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="userInfo.nickname"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateUserInfo">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </page-container>
</template>