<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>Ferris Acres Creamery</h1>
    <hello></hello>
    <p>
      <router-link to="/foo">Go to Foo Link</router-link>
      <router-link to="/bar">Go to Bar Link</router-link>
    </p>
    <router-view></router-view>
  </div>
</template>

<script>
import Hello from './components/Hello'

export default {
  name: 'app',
  components: {
    Hello
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
