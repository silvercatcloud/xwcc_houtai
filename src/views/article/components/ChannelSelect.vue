<template>
  <el-select :modelValue="modelValue" @update:modelValue="emit('update:modelValue', $event)">
    <el-option
      v-for="channel in channelList"
      :key="channel.id"
      :label="channel.categoryName"
      :value="channel.id"
    ></el-option>
  </el-select>
</template>

<script setup>
import { articleCategoryListService } from '@/api/article'
import { ref } from 'vue'

defineProps({
  modelValue: {
    type: [Number, String],
  },
})

const emit = defineEmits(['update:modelValue'])
const channelList = ref([])
const getChannelList = async () => {
  const res = await articleCategoryListService()
  channelList.value = res.data.data
}
getChannelList()
</script>

<style lang="scss" scoped>
</style>