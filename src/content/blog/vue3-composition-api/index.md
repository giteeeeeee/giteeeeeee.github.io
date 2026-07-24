---
title: 'Vue 3 Composition API 实战指南'
description: 'Vue 3 的 Composition API 为组件逻辑复用提供了更好的方式。本教程将通过实际案例，教你如何使用 Composition API 构建可维护的 Vue 应用。'
publishDate: 2025-09-20
category: '教程'
tags: ['Vue', 'JavaScript', '前端框架', 'Composition API']
featured: false
---
Vue 3 的 Composition API 是一个强大的特性，让我们深入了解如何使用它。

## 为什么需要 Composition API？

Options API 的局限性：

```javascript
export default {
  data() {
    return {
      user: null,
      posts: []
    }
  },
  methods: {
    fetchUser() { /* ... */ },
    fetchPosts() { /* ... */ }
  },
  mounted() {
    this.fetchUser()
    this.fetchPosts()
  }
}
```

相关逻辑分散在不同的选项中。

## Composition API 基础

使用 `setup` 函数组织代码：

```javascript
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const user = ref(null)
    const posts = ref([])

    const fetchUser = async () => {
      user.value = await api.getUser()
    }

    const fetchPosts = async () => {
      posts.value = await api.getPosts()
    }

    onMounted(() => {
      fetchUser()
      fetchPosts()
    })

    return {
      user,
      posts
    }
  }
}
```

## 组合式函数（Composables）

提取可复用逻辑：

```javascript
// useUser.js
export function useUser() {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchUser = async (id) => {
    loading.value = true
    try {
      user.value = await api.getUser(id)
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    fetchUser
  }
}
```

在组件中使用：

```javascript
import { useUser } from './composables/useUser'

export default {
  setup() {
    const { user, loading, error, fetchUser } = useUser()

    onMounted(() => {
      fetchUser(123)
    })

    return {
      user,
      loading,
      error
    }
  }
}
```

## 实战案例：表单处理

```javascript
// useForm.js
export function useForm(initialValues) {
  const values = reactive({ ...initialValues })
  const errors = reactive({})
  const touched = reactive({})

  const handleChange = (field, value) => {
    values[field] = value
    touched[field] = true
    validateField(field)
  }

  const validateField = (field) => {
    // 验证逻辑
    if (!values[field]) {
      errors[field] = '此字段必填'
    } else {
      delete errors[field]
    }
  }

  const handleSubmit = async (onSubmit) => {
    Object.keys(values).forEach(validateField)
  
    if (Object.keys(errors).length === 0) {
      await onSubmit(values)
    }
  }

  return {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit
  }
}
```

## 响应式原理

### ref vs reactive

```javascript
// ref - 用于基本类型
const count = ref(0)
count.value++ // 需要 .value

// reactive - 用于对象
const state = reactive({
  count: 0,
  name: 'Vue'
})
state.count++ // 不需要 .value
```

### computed 和 watch

```javascript
import { computed, watch } from 'vue'

// 计算属性
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
})

// 侦听器
watch(count, (newVal, oldVal) => {
  console.log(`Count changed from ${oldVal} to ${newVal}`)
})

// 侦听多个源
watch([firstName, lastName], ([newFirst, newLast]) => {
  console.log(`Name: ${newFirst} ${newLast}`)
})
```

## 生命周期钩子

```javascript
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue'

setup() {
  onMounted(() => {
    console.log('组件已挂载')
  })

  onUnmounted(() => {
    console.log('组件将卸载')
  })
}
```

## 最佳实践

1. **组合式函数命名** - 以 `use` 开头
2. **逻辑复用** - 提取通用逻辑到 composables
3. **类型安全** - 配合 TypeScript 使用
4. **性能优化** - 合理使用 computed 和 watch

## 迁移建议

从 Options API 迁移到 Composition API：

1. 从小组件开始
2. 不必一次性重写所有代码
3. 两种 API 可以共存
4. 关注代码可维护性

## 总结

Composition API 的优势：

- ✅ 更好的代码组织
- ✅ 更好的类型推导
- ✅ 更容易复用逻辑
- ✅ 更小的打包体积

掌握 Composition API，让你的 Vue 代码更加优雅！
