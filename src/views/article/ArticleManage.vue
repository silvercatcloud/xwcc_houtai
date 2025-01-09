<!-- <template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">发布文章</el-button>
    </template>
    <el-form inline>
      <el-form-item label="文章分类：" style="width: 20%">
        <channel-select v-model="params.categoryId"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态：" style="width: 20%">
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="articleList" style="width: 100%">
      <el-table-column label="文章标题" width="400">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="categoryName"></el-table-column>
      <el-table-column label="发表时间" prop="updateTime">
        <template #default="{ row }">
          {{ formatTime(row.updateTime) }}
        </template></el-table-column
      >
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditArticle(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDeleteArticle(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <el-pagination
      v-model:current-page="params.pageNum"
      v-model:page-size="params.pageSize"
      :page-sizes="[2, 3, 4, 5, 10]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end"
    />
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
  </page-container>
</template>
    
<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
const visibilityBinding = ref(false)
import ChannelSelect from '@/views/article/components/ChannelSelect.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { articleListService, artDeteleService } from '@/api/article.js'
import ArticleEdit from '@/views/article/components/ArticleEdit.vue'
import { formatTime } from '@/utils/format'
const articleList = ref([])
const total = ref(0)
ref(false)
const params = ref({
  pageNum: 1,
  pageSize: 10,
  categoryId: '',
  state: '',
})
const getArticleList = async () => {
  // 克隆并清理参数
  const queryParams = { ...params.value }
  // 如果 `categoryId` 或 `state` 是空字符串，移除它们
  if (!queryParams.categoryId) delete queryParams.categoryId
  if (!queryParams.state) delete queryParams.state
  // 调用接口
  const res = await articleListService(queryParams)
  // 渲染视图
  articleList.value = res.data.data.items
  total.value = res.data.data.total
}
getArticleList()
const onSizeChange = (size) => {
  params.value.pageNum = 1
  params.value.pageSize = size
  getArticleList()
}
const onCurrentChange = (page) => {
  params.value.pageNum = page
  getArticleList()
}
const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  })
  await artDeteleService(row.id)
  // await artDeteleService(row.categoryId)
  ElMessage({ type: 'success', message: '删除成功' })
  await getArticleList()
}

const articleEditRef = ref()
const onAddArticle = () => {
  visibilityBinding.value = true
  articleEditRef.value.open({})
}
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}
// 添加修改成功
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，需要跳转渲染最后一页，编辑直接渲染当前页
    const lastPage = Math.ceil((total.value + 1) / params.value.pageSize)
    params.value.pageNum = lastPage
  }
  getArticleList()
}
const onSearch = () => {
  params.value.pageNum = 1
  getArticleList()
}
const onReset = () => {
  params.value.pageNum = 1
  params.value.categoryId = ''
  params.value.state = ''
  getArticleList()
}
</script>
    
<style lang="scss" scoped>
</style> -->
<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary" @click="onAddArticle">发布文章</el-button>
    </template>

    <!-- 搜索表单 -->
    <el-form :inline="isLargeScreen" class="search-form">
      <el-form-item label="文章分类：" style="width: 100%" v-if="isSmallScreen">
        <channel-select v-model="params.categoryId"></channel-select>
      </el-form-item>
      <el-form-item label="文章分类：" style="width: 20%" v-else>
        <channel-select v-model="params.categoryId"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态：" style="width: 100%" v-if="isSmallScreen">
        <el-select v-model="params.state" style="width: 100%">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发布状态：" style="width: 20%" v-else>
        <el-select v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-top: 10px">
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <div class="table-container">
      <el-table :data="articleList" style="width: 100%" class="responsive-table">
        <el-table-column label="文章标题" width="300">
          <template #default="{ row }">
            <el-link type="primary" :underline="false">{{ row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="categoryName"></el-table-column>
        <el-table-column label="发表时间" prop="updateTime">
          <template #default="{ row }">
            {{ formatTime(row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button
              :icon="Edit"
              circle
              plain
              type="primary"
              @click="onEditArticle(row)"
            ></el-button>
            <el-button
              :icon="Delete"
              circle
              plain
              type="danger"
              @click="onDeleteArticle(row)"
            ></el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="没有数据" />
        </template>
      </el-table>
    </div>

    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="params.pageNum"
      v-model:page-size="params.pageSize"
      :page-sizes="[2, 3, 4, 5, 10]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      class="pagination"
    />
    <article-edit ref="articleEditRef" @success="onSuccess"></article-edit>
  </page-container>
</template>

    
<script setup>
import { Delete, Edit } from '@element-plus/icons-vue'
const visibilityBinding = ref(false)
import ChannelSelect from '@/views/article/components/ChannelSelect.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { articleListService, artDeteleService } from '@/api/article.js'
import ArticleEdit from '@/views/article/components/ArticleEdit.vue'
import { formatTime } from '@/utils/format'
const articleList = ref([])
const total = ref(0)
ref(false)
const params = ref({
  pageNum: 1,
  pageSize: 10,
  categoryId: '',
  state: '',
})
import { onMounted, ref } from 'vue'

const isSmallScreen = ref(false)
const isLargeScreen = ref(true)
// 检测屏幕大小变化
const updateScreenSize = () => {
  const screenWidth = window.innerWidth
  isSmallScreen.value = screenWidth < 768
  isLargeScreen.value = screenWidth >= 768
}

onMounted(() => {
  updateScreenSize()
  window.addEventListener('resize', updateScreenSize)
})
const getArticleList = async () => {
  // 克隆并清理参数
  const queryParams = { ...params.value }
  // 如果 `categoryId` 或 `state` 是空字符串，移除它们
  if (!queryParams.categoryId) delete queryParams.categoryId
  if (!queryParams.state) delete queryParams.state
  // 调用接口
  const res = await articleListService(queryParams)
  // 渲染视图
  articleList.value = res.data.data.items
  total.value = res.data.data.total
}
getArticleList()
const onSizeChange = (size) => {
  params.value.pageNum = 1
  params.value.pageSize = size
  getArticleList()
}
const onCurrentChange = (page) => {
  params.value.pageNum = page
  getArticleList()
}
const onDeleteArticle = async (row) => {
  await ElMessageBox.confirm('你确认删除该文章信息吗？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  })
  await artDeteleService(row.id)
  // await artDeteleService(row.categoryId)
  ElMessage({ type: 'success', message: '删除成功' })
  await getArticleList()
}

const articleEditRef = ref()
const onAddArticle = () => {
  visibilityBinding.value = true
  articleEditRef.value.open({})
}
const onEditArticle = (row) => {
  articleEditRef.value.open(row)
}
// 添加修改成功
const onSuccess = (type) => {
  if (type === 'add') {
    // 如果是添加，需要跳转渲染最后一页，编辑直接渲染当前页
    const lastPage = Math.ceil((total.value + 1) / params.value.pageSize)
    params.value.pageNum = lastPage
  }
  getArticleList()
}
const onSearch = () => {
  params.value.pageNum = 1
  getArticleList()
}
const onReset = () => {
  params.value.pageNum = 1
  params.value.categoryId = ''
  params.value.state = ''
  getArticleList()
}
</script>
    
<style lang="scss" scoped>
.search-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  @media screen and (max-width: 768px) {
    flex-direction: column;

    .el-form-item {
      width: 100% !important;
    }
  }
}

.table-container {
  overflow-x: auto;

  .responsive-table {
    min-width: 600px; // 设置表格最小宽度，避免内容过挤
  }
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;

  @media screen and (max-width: 768px) {
    justify-content: center;
  }
}
.el-pagination {
  display: flex;
  flex-wrap: wrap; /* 在小屏幕下允许分页器元素换行 */
  justify-content: center; /* 居中对齐分页器 */
  gap: 1px; /* 添加分页器子项间距 */
}

@media (max-width: 480px) {
  .el-pagination {
    font-size: 12px; /* 缩小字体大小 */
  }
}
</style>