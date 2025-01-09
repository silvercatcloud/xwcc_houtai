<script setup>
import { ref } from 'vue'
import axios from 'axios'

// 存储对话数据
const chatMessages = ref([]) // 存储对话框中的消息
let typingInterval = null // 保存逐字显示的 interval
// 发送消息
const userInput = ref('')
const isSending = ref(false)
const helpMessage = ref('有什么可以帮忙的？') // 帮助信息

const sendMessage = async () => {
  if (!userInput.value) return // 如果没有输入内容，则不发送
  isSending.value = true
  helpMessage.value = '' // 发送消息后，清除帮助信息

  try {
    // 发送用户输入的消息到后端
    const response = await axios.post('http://47.98.247.83:3000/chat', {
      content: userInput.value,
    })

    // 逐字显示 AI 回复
    const message = response.data.message

    // 添加用户消息
    addMessage('user', userInput.value)
    // 添加空的 AI 回复，等待逐字显示
    addMessage('ai', '')
    startTypingEffect(message) // 开始逐字显示效果

    // 清空输入框
    userInput.value = ''
  } catch (error) {
    console.error('Error:', error)
  } finally {
    isSending.value = false
  }
}
const startTypingEffect = (message) => {
  let index = 0
  const aiMessageIndex = chatMessages.value.findIndex(
    (msg) => msg.sender === 'ai' && msg.message === ''
  )
  if (aiMessageIndex === -1) return // 如果没有找到空的AI消息就不执行

  // 设置逐字显示效果
  typingInterval = setInterval(() => {
    const currentMessage = chatMessages.value[aiMessageIndex]
    currentMessage.message = message.substring(0, index + 1)
    index++

    // 如果消息显示完，停止定时器并检查字数是否匹配
    if (index === message.length) {
      clearInterval(typingInterval)

      // 判断显示的字数是否与后台返回的消息字数相同
      const displayedMessage = currentMessage.message
      if (displayedMessage.length === message.length) {
        // 只有完全显示完成时才设为 false
        isSending.value = false
      }
    }
  }, 50) // 每50ms显示一个字符
}

// 将消息添加到对话框
const addMessage = (sender, message) => {
  chatMessages.value.push({ sender, message })
}
</script>
<template>
  <!-- 对话框 -->
  <div id="chat-box">
    <div v-if="helpMessage" class="help-message">
      {{ helpMessage }}
    </div>
    <div v-for="(message, index) in chatMessages" :key="index" :class="['message', message.sender]">
      <span>{{ message.message }}</span>
    </div>
  </div>

  <!-- 输入框和按钮 -->
  <div id="message-box">
    <input v-model="userInput" placeholder="Type your message here" />
    <button @click="sendMessage" :disabled="isSending">
      {{ isSending ? 'Sending...' : 'Send' }}
    </button>
  </div>
</template>
<style scoped>
#chat-box {
  width: 100%;
  height: 90%;
  overflow-y: scroll;
  margin-bottom: 20px;
}
.help-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  font-size: 1.875rem;
  font-weight: 600;
  line-height: 2.25rem;
}

.message {
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  max-width: 70%;
}

.message.user {
  background-color: #f3f3f3;
  align-self: flex-end;
}

.message.ai {
  background-color: #ffffff;
  align-self: flex-start;
}

#message-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

#message-box input {
  width: 80%;
  padding: 12px 16px;
  font-size: 16px;
  border-radius: 25px;
  border: 1px solid #ddd;
  outline: none;
  transition: border-color 0.3s ease;
  background-color: #fff;
}

#message-box input:focus {
  border-color: #000000;
}

#message-box button {
  padding: 10px 20px;
  border: none;
  background-color: #000000;
  color: white;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  margin-left: 10px;
}

#message-box button:disabled {
  background-color: #ccc;
}

#message-box button:hover {
  background-color: #3b3b3b;
}

#message-box button:active {
  background-color: #3b3b3b;
}
</style>
