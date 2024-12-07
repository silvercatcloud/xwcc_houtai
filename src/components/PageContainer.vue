<!--考虑到多个页面复用，封装成组件
  - props 定制标题
  - 默认插槽 default 定制内容主体
  - 具名插槽 extra  定制头部右侧额外的按钮
-->
<script setup>
defineProps({
  title: {
    required: true,
    type: String,
  },
})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>{{ title }}</span>
        <div class="extra">
          <slot name="extra"></slot>
        </div>
      </div>
    </template>
    <slot></slot>
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  min-height: 100%;
  box-sizing: border-box;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
