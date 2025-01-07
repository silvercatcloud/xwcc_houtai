<script setup>
import { useChannelStore } from '@/stores/channel' // 引入 channel store
import echarts from '@/utils/echart'
import { onMounted, ref, onBeforeUnmount } from 'vue'
// 使用 channel store
const channelStore = useChannelStore()

const chartContainer = ref(null)  // 图表容器的引用
const chartWidth = ref(0)  // 图表容器的宽度

let myChart = null  // 图表实例
// 计算饼图的 radius
const calculateRadius = (width) => {
  if (width < 400) {
    return '40%'; // 小屏幕时使用较小的饼图半径
  } else if (width < 800) {
    return '50%'; // 中等屏幕时使用中等的饼图半径
  } else {
    return '60%'; // 大屏幕时使用较大的饼图半径
  }
}
onMounted(() => {
  const storedChannelList = sessionStorage.getItem('channelList')
  if (storedChannelList) {
    // 2. 如果存在，直接从 sessionStorage 获取并设置到 Pinia store
    const data = JSON.parse(storedChannelList)
    channelStore.setChannelList(data)
  }
  // 基于准备好的 DOM，初始化 ECharts 实例
  //   const myChart = echarts.init(document.getElementById('main'))
  myChart = echarts.init(chartContainer.value)

  // 使用 channelList 数据并提取 categoryName
  const option = {
    title: {
      text: '文章分类展示',
    },
    series: [
      {
        type: 'pie',
        radius: calculateRadius(chartWidth.value),  // 使用计算的 radius
        data: channelStore.channelList.map((item) => ({
          value: item.id, // 假设你使用 id 作为 value，或者可以根据需求替换成其他字段
          name: item.categoryName, // 使用 categoryName 作为名称
        })),
      },
    ],
  }

  // 使用配置项生成图表
  myChart.setOption(option)
  window.addEventListener('resize', handleResize)
})
// 窗口大小变化时调整图表大小和 radius
const handleResize = () => {
  if (myChart) {
    // 获取当前窗口的宽度并重新计算饼图的 radius
    chartWidth.value = chartContainer.value.offsetWidth
    const radius = calculateRadius(chartWidth.value)
    
    // 更新图表配置中的 radius
    myChart.setOption({
      series: [{
        radius: radius,  // 动态设置新的 radius
      }]
    })
    
    // 重新调整图表大小
    myChart.resize()
  }
}

// 在组件销毁时移除监听事件
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div 
    ref="chartContainer" 
    style="width: 100%; height: 400px; min-width: 400px;">
  </div> 
</template>
