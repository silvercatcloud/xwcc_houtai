<script setup>
import { ref } from 'vue'
const visibilityBinding = ref(false)
import ChannelSelect from './ChannelSelect.vue'
import { artGetDetailService, articleAddService, artEditService } from '@/api/article'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const defaultForm = ref({
  title: '',
  categoryId: '',
  categoryName: '',
  coverImg: '',
  content: '',
  state: '',
})
// const formModel = { ...defaultForm }//!!!!!!!!!!!!!!!!!!!!!!!!
const formModel = ref({
  title: '',
  categoryId: '',
  categoryName: '',
  coverImg: '',
  content: '',
  state: '',
})
const editorRef = ref()
const open = async (row) => {
  visibilityBinding.value = true
  if (row.id) {
    const res = await artGetDetailService(row.id)
    formModel.value = res.data.data
    // console.log(formModel.value.categoryName)
  } else {
    formModel.value = { ...defaultForm }
    editorRef.value.setHTML('')
  }
}

//导入token
import { useUserStore } from '@/stores/user.js'
const tokenStore = useUserStore()
const uploadSuccess = (result) => {
  formModel.value.coverImg = result.data
}
const emit = defineEmits(['success'])
const onPublish = async (state) => {
  formModel.value.state = state
  if (formModel.value.id) {
    await artEditService(formModel.value)
    ElMessage.success('编辑成功')
    visibilityBinding.value = false
    emit('success', 'edit')
  } else {
    // 添加请求
    await articleAddService(formModel.value)
    ElMessage.success('添加成功')
    visibilityBinding.value = false
    emit('success', 'add')
  }
}

// 抽屉宽度
const drawerWidth = ref('40%')
// 修改抽屉宽度以适配小屏幕
const updateDrawerWidth = () => {
  if (window.innerWidth <= 480) {
    drawerWidth.value = '100%' // 小屏幕时让抽屉宽度更宽
  }else if (window.innerWidth <= 768) {
    drawerWidth.value = '70%' // 中等屏幕时让抽屉宽度更宽
  }else {
    drawerWidth.value = '40%' // 默认宽度
  }
}
// 监听窗口大小变化
window.addEventListener('resize', updateDrawerWidth)
updateDrawerWidth() // 初始化宽度
defineExpose({
  open,
})
</script>
<template>
  <el-drawer
    v-model="visibilityBinding"
    :title="formModel.id ? '编辑文章' : '添加文章'"
    direction="rtl"
    :size="drawerWidth"
    custom-class="custom-drawer"
  >
    <!-- 发表文章表单 -->
    <el-form :model="formModel" ref="formRef" label-width="100px">
      <el-row :gutter="30">
        <!-- 文章标题 -->
        <el-col :span="24" class="form-item">
          <el-form-item label="文章标题" prop="title">
            <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
          </el-form-item>
        </el-col>

        <!-- 文章分类 -->
        <el-col :span="24" class="form-item">
          <el-form-item label="文章分类" prop="categoryId">
            <channel-select v-model="formModel.categoryId" width="100%"></channel-select>
          </el-form-item>
        </el-col>

        <!-- 文章封面 -->
        <el-col :span="24" class="form-item">
          <el-form-item label="文章封面" prop="coverImg">
            <el-upload
              class="avatar-uploader"
              :auto-upload="true"
              :show-file-list="false"
              action="/api/upload"
              name="file"
              :headers="{ Authorization: tokenStore.token }"
              :on-success="uploadSuccess"
            >
              <img v-if="formModel.coverImg" :src="formModel.coverImg" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-col>

        <!-- 文章内容 -->
        <el-col :span="24" class="form-item">
          <el-form-item label="文章内容" prop="content">
            <div class="editor">
              <quill-editor
                ref="editorRef"
                theme="snow"
                v-model:content="formModel.content"
                contentType="html"
              />
            </div>
          </el-form-item>
        </el-col>

        <!-- 发布和草稿按钮 -->
        <el-col :span="24" class="form-item">
          <el-form-item>
            <el-button @click="onPublish('已发布')" type="primary" block>发布</el-button>
            <el-button @click="onPublish('草稿')" type="info" block>草稿</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.custom-drawer {
  max-width: 800px; /* 最大宽度限制 */
}

.form-item {
  margin-bottom: 30px; /* 增加表单项之间的间距 */
}

.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}

.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
</style>
