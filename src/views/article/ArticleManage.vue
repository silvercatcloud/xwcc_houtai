<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button type="primary">发布文章</el-button>
    </template>
    <el-form inline>
      <el-form-item label="文章分类：" style="width: 20%">
        <channel-select v-model="params.categoryId"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态：" style="width: 20%">
        <el-select>
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">搜索</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="articleList" style="width: 100%">
      <el-table-column label="文章标题" width="400">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="categoryName">
        <!-- {{ row.categoryId }} -->
      </el-table-column>
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
import ChannelSelect from './components/ChannelSelect.vue'
import { articleListService } from '@/api/article.js'
import { formatTime } from '@/utils/format'
const articleList = ref([])
const total = ref(0)
ref(false)

const params = ref({
  pageNum: 1,
  pageSize: 2,
  // categoryId: '',
})
const getArticleList = async () => {
  let res = await articleListService(params.value)

  console.log(res.data.data.items)
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
  params.value.pagenum = page
  getArticleList()
}
const onEditArticle = (row) => {
  console.log(row)
}
const onDeleteArticle = (row) => {
  console.log(row)
}
// const onAddArticle = () => {
//   articleEditRef.value.open({})
// }
</script>
    
<style lang="scss" scoped>
</style>