<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom,
} from '@element-plus/icons-vue'
import { userInfoService } from '@/api/user.js'
import { useUserStore } from '@/stores/user.js'
import useUserInfoStore from '@/stores/userInfo.js'

const useStore = useUserStore()
const userInfoStore = useUserInfoStore()
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

const isCollapsed = ref(false) // 控制侧边栏显示/隐藏

const toggleAside = () => {
  isCollapsed.value = !isCollapsed.value
}
// 检测屏幕宽度
const handleResize = () => {
  isCollapsed.value = window.innerWidth < 480
}
onMounted(() => { 
  // 初始化状态
  handleResize()
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  // 移除监听
  window.removeEventListener('resize', handleResize)
})
//调用函数,获取用户详细信息
const getUserInfo = async () => {
  //调用接口
  let result = await userInfoService()
  //数据存储到pinia中
  userInfoStore.setInfo(result.data.data)
  // console.log(result.data.data)
}
getUserInfo()
//条目被点击后,调用的函数
import { useRouter } from 'vue-router'
const router = useRouter()
import { ElMessage, ElMessageBox } from 'element-plus'

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm('您确认要退出吗?', '温馨提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        useStore.removeToken()
        userInfoStore.removeInfo()
        router.push(`/login`)
        ElMessage({
          type: 'success',
          message: '退出登录成功',
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '用户取消了退出登录',
        })
      })
  } else {
    router.push(`/user/${command}`)
  }
}
</script>

<template>
  <el-container class="layout-container">
    <!-- 折叠按钮 -->
    <el-aside :width="isCollapsed ? '0' : '200px'" class="el-aside">
      <el-aside width="200px">
        <div class="el-aside__logo"></div>
        <el-menu
          active-text-color="#ecd452"
          background-color="##3271ae"
          :default-active="$route.path"
          text-color="#fff"
          router
        >
          <el-menu-item index="/article/channel">
            <el-icon><Management /></el-icon>
            <span>文章分类</span>
          </el-menu-item>
          <el-menu-item index="/article/manage">
            <el-icon><Promotion /></el-icon>
            <span>文章管理</span>
          </el-menu-item>
          <el-sub-menu index="/user">
            <template #title>
              <el-icon><UserFilled /></el-icon>
              <span>个人中心</span>
            </template>
            <el-menu-item index="/user/profile">
              <el-icon><User /></el-icon>
              <span>基本资料</span>
            </el-menu-item>
            <el-menu-item index="/user/avatar">
              <el-icon><Crop /></el-icon>
              <span>更换头像</span>
            </el-menu-item>
            <el-menu-item index="/user/password">
              <el-icon><EditPen /></el-icon>
              <span>重置密码</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/show/data">
            <el-icon><Promotion /></el-icon>
            <span>数据展示</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
    </el-aside>
    <div class="collapse-toggle" @click="toggleAside">
      <el-icon :size="20">
        <component :is="isCollapsed ? ArrowRight : ArrowLeft" />
      </el-icon>
    </div>
    <el-container>
      <el-header>
        <div>
          操作人员：
          <strong>
            {{ userInfoStore.info.nickname || userInfoStore.info.username }}
          </strong>
        </div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <span class="el-dropdown__box">
            <!-- <el-avatar :src="avatar" /> -->
            <el-avatar :src="userInfoStore.info.userPic ? userInfoStore.info.userPic : avatar" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
              <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
              <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
              <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>博客管理后台 ©2025 Created by silvercat</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background: linear-gradient(to bottom, #010f4b, #5698bc);
    &__logo {
      height: 120px;
      background: url('https://xinwencaochang.oss-cn-beijing.aliyuncs.com/spacecat.png') no-repeat
        center / 120px auto;
    }
    .el-menu {
      border-right: none;
    }
  }
  .collapse-toggle {
    .el-icon {
      margin-top: 20px;
    }
  }
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>