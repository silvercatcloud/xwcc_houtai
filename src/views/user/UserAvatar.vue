<script setup>
import { Plus, Upload } from '@element-plus/icons-vue'
import { ref } from 'vue'
const uploadRef = ref()
//导入token
import { useUserStore } from '@/stores/user.js'
const tokenStore = useUserStore()
import useUserInfoStore from '@/stores/userInfo.js'
const userInfoStore = useUserInfoStore()
//用户头像地址
const imgUrl = ref(userInfoStore.info.userPic)
//图片上传成功的回调函数
const uploadSuccess = (result) => {
  imgUrl.value = result.data
}
import { userAvatarUpdateService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
//头像修改
const updateAvatar = async () => {
  //调用接口
  let result = await userAvatarUpdateService(imgUrl.value)

  ElMessage.success(result.msg ? result.msg : '修改成功')

  //修改pinia中的数据
  userInfoStore.info.userPic = imgUrl.value
}
</script>

<template>
  <page-container title="更换头像">
    <el-row>
      <el-col :span="12">
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          :auto-upload="true"
          :show-file-list="false"
          action="/api/upload"
          name="file"
          :headers="{ Authorization: tokenStore.token }"
          :on-success="uploadSuccess"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <img v-else src="@/assets/images/cat.png" width="278" />
          <!-- <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon> -->
        </el-upload>
        <br />
        <el-button
          type="primary"
          :icon="Plus"
          size="large"
          @click="uploadRef.$el.querySelector('input').click()"
        >
          选择图片
        </el-button>
        <el-button type="success" :icon="Upload" size="large" @click="updateAvatar">
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>