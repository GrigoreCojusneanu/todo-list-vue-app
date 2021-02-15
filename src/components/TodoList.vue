<template>
  <div id="app">
    <h1 class="app-title">To-Do List App</h1>

    <section class="todo">
      <h2 class="todo__title">{{ today.day }}, {{ today.date }}</h2>
      <form class="todo__form" @keydown.enter.prevent="">
        <input type="text" class="input-todo" v-bind:class="{ active: new_todo }" placeholder="Add new task" v-model="new_todo" v-on:keyup.enter="addItem">
        <div class="btn btn-add" v-bind:class="{ active: new_todo }"  @click="addItem">+</div>
      </form>

      <div v-if="pending.length > 0">
        <p class="todo__status --busy">You have {{ pending.length }} pending task<span v-if="pending.length>1">s</span></p>

        <transition-group name="todo-item" tag="ul" class="todo__list">
          <li v-for="(item) in pending" v-bind:key="item.title">
            <input class="todo__list-checkbox" v-bind:id="'item_' + item.id" v-model="item.done" type="checkbox">
            <label v-bind:for="'item_' + item.id"></label>
            <span class="todo__list-text">{{ item.title }}</span>
            <span class="delete" @click="deleteItem(item)"></span>
          </li>
        </transition-group>
      </div>

      <transition name="slide-fade">
        <p class="todo__status --free" v-if="!pending.length">
          <img src="../assets/empty-state.svg" alt="celebration">It's time() for a good salt!!!
        </p>
      </transition>

      <div v-if="completed.length > 0 && showComplete">
        <p class="todo__status">Completed tasks: {{ completedPercentage }}</p>
        
        <transition-group name="todo-item" tag="ul" class="todo__list --archived">
          <li v-for="(item) in completed" v-bind:key="item.title">
            <input class="todo__list-checkbox" v-bind:id="'item_' + item.id" v-model="item.done" type="checkbox">
            <label v-bind:for="'item_' + item.id"></label>
            <span class="todo__list-text">{{ item.title }}</span>
            <span class="delete" @click="deleteItem(item)"></span>
          </li>
        </transition-group>
      </div>
      
      <div class="todo__actions">
        <div class="btn btn-secondary" v-if="completed.length > 0" @click="toggleShowComplete">
          <span v-if="!showComplete">Show</span><span v-else>Hide</span> Complete
        </div>
        <div class="btn btn-secondary" v-if="todoList.length > 0" @click="clearAll">Clear All</div>
      </div>
    </section>
  </div>
</template>

<script>

export default {
  name: 'TodoListApp',
  data() {
    return {
      todoList: [
        {"id":0, "title":"Daily zoom meeting", "done": false},
        {"id":1, "title":"Review subscriptions", "done": false},
        {"id":4, "title":"Send report to Frank", "done": true}
      ],
      new_todo: '',
      showComplete: false,
    };
  },
  mounted() {
    this.getTodos();
  },
  watch: {
    todoList: {
      handler: function(updatedList) {
        localStorage.setItem('todo_list_app', JSON.stringify(updatedList));
      },
      deep: true
    }
  },
  computed:{
    pending: function() {
      if(this.todoList === null)
        return;

      return this.todoList.filter(function(item) {
        return !item.done;
      })
    },
    completed: function() {
      if(this.todoList === null)
        return;

      return this.todoList.filter(function(item) {
        return item.done;
      }); 
    },
    completedPercentage: function() {
      if(this.todoList === null)
        return 0;

      return (Math.floor((this.completed.length / this.todoList.length) * 100)) + "%";
    },
    today: function() {
      var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();

      if(dd<10) {
        dd = '0'+dd
      } 

      if(mm<10) {
        mm = '0'+mm
      } 

      today = {
        day: weekday[today.getDay()],
        date:  mm + '-' + dd + '-' + yyyy,
      }

      return(today);
    }
  },
  methods: {
    // get all todos when loading the page
    getTodos() {
      if (localStorage.getItem('todo_list_app')) {
        this.todoList = JSON.parse(localStorage.getItem('todo_list_app'));
      }
    },
    // add a new item
    addItem() {
      // validation check
      if (this.new_todo) {
        this.todoList.unshift({
        id: this.todoList.length,
        title: this.new_todo,
        done: false,
        });
      }
      // reset new_todo
      this.new_todo = '';
      // save the new item in localstorage
      return true;
    },
    deleteItem(item) {
      this.todoList.splice(this.todoList.indexOf(item), 1);
    },
    toggleShowComplete() {
      this.showComplete = !this.showComplete;
    },
    clearAll() {
      this.todoList = [];
    }
  },
}
</script>

<style lang="scss">
  @import '../scss/styles.scss';
</style>
