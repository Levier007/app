<template>
  <div id="app">
    <Header/>
    <router-view></router-view>
    <Footer/>
    <PlayerBar ></PlayerBar>
  </div>
</template>

<script>
import Header from './components/header'
import Footer from './components/footer'
import PlayerBar from './components/playerBar';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    PlayerBar
  }
}
</script>

<style>
@import './assets/styles/reset.css';
</style>
