<template>
  <div id="app">
    <v-app>
      <router-view/>
    </v-app>
  </div>
</template>

<script>

export default {
  name: 'App',

}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  background-color: #2a2a32;
  color: white;
}
</style>
