<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" @click="onAddChannel()">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="channelList" style="width: 100%">
      <el-table-column label="序号" width="100" type="index"></el-table-column>
      <el-table-column label="分类名称" prop="categoryName"></el-table-column>
      <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button
            :icon="Edit"
            circle
            plain
            type="primary"
            @click="onEditChannel(row)"
          ></el-button>
          <el-button
            :icon="Delete"
            circle
            plain
            type="danger"
            @click="onDelChannel(row)"
          ></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据" />
      </template>
    </el-table>
    <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
  </page-container>
</template>
<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { articleCategoryDeleteService, articleCategoryListService } from '@/api/article.js'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, onMounted } from 'vue'
import ChannelEdit from '@/views/article/components/ChannelEdit.vue'
import { useChannelStore } from '@/stores/channel.js'
const channelStore = useChannelStore()
const channelList = ref([])
const loading = ref(false)
const dialog = ref()

const getChannelList = async () => {
  loading.value = true
  const res = await articleCategoryListService()
  channelList.value = res.data.data || []
  channelStore.setChannelList(channelList.value) // 更新 Pinia Store 的 channelList
  sessionStorage.setItem('channelList', JSON.stringify(channelList.value))
  loading.value = false
  console.log(channelList.value)
}
onMounted(() => {
  getChannelList()
})
const onEditChannel = (row) => {
  dialog.value.open(row)
}
const onAddChannel = () => {
  dialog.value.open({})
}
// const onDelChannel = async (row) => {
//   await ElMessageBox.confirm('你确认删除该分类信息吗？', '温馨提示', {
//     type: 'warning',
//     confirmButtonText: '确认',
//     cancelButtonText: '取消',
//   })
//   await articleCategoryDeleteService(row.id)
//   ElMessage.success('删除成功')
//   await getChannelList()
// }
const onDelChannel = async (row) => {
  try {
    // 确认是否删除
    await ElMessageBox.confirm('你确认删除该分类信息吗？', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    });

    // 调用删除接口
    await articleCategoryDeleteService(row.id);
    // 删除成功后的操作
    ElMessage.success('删除成功');
    // 刷新分类列表
    await getChannelList();
  } catch (error) {
    // 判断错误类型
    if (error.message && error.message.includes('Cannot delete or update a parent row')) {
      // 外键约束错误，显示用户友好的错误提示
      ElMessage.error('该分类已被引用，无法删除。请先处理相关的文章');
    }
    // 防止错误信息被重新抛出，避免重复弹框
    return;
  }
};

const onSuccess = () => {
  getChannelList()
}
</script>