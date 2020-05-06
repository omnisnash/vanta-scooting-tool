<template>
  <div id="app">
    <GlobalMenu></GlobalMenu>
    <router-view/>
  </div>
</template>

<script>
import Vue from 'vue';
import GlobalMenu from '@/components/GlobalMenu.vue';

export default Vue.extend({
  name: 'App',
  components: { GlobalMenu },
});
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
