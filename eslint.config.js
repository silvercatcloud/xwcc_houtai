import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  {
    name: 'custom-rules',
    files: ['**/*.{js,mjs,jsx,vue}'],
    rules: {
      // Prettier 规则
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true, // 使用单引号
          semi: false, // 无分号
          printWidth: 80, // 每行最大宽度 80
          trailingComma: 'none', // 无尾随逗号
          endOfLine: 'auto', // 不限制换行符
        },
      ],

      // Vue 相关规则
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index'], // 忽略单词名称为 "index"
        },
      ],
      'vue/no-setup-props-destructure': ['off'], // 关闭 setup 中解构 props 校验

      // ESLint 基本规则
      'no-undef': 'error', // 未定义变量报错
    },
  },

  js.configs.recommended, // 启用 ESLint 推荐规则
  ...pluginVue.configs['flat/essential'], // 启用 Vue 的基本规则集
  skipFormatting, // 忽略 Prettier 格式化冲突
];
