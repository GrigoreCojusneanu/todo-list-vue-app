<template>
  <div id="app">
    <TodoListApp/>
  </div>
</template>

<script>
import TodoListApp from './components/TodoList.vue'

export default {
  name: 'app',
  components: {
    TodoListApp
  }
}
</script>
