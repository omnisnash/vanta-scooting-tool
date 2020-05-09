<template>
  <nav class="navbar navbar is-dark is-fixed-top" role="navigation" aria-label="main navigation">
    <div class="navbar-menu">
      <div class="navbar-start">
        <div class="navbar-item">
          <div class="field has-addons">
            <p class="control">
              <button class="button is-large"
                @click="newMesure"
                :class="isCurrentRoute('New mesure')">
                  Nouvelle mesure
              </button>
            </p>
            <p class="control">
              <button class="button is-large"  @click="history" :class="isCurrentRoute('History')">
                <span class="icon is-small">
                  <i class="fas fa-history"></i>
                </span>
              </button>
            </p>
          </div>
        </div>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <button class="button is-large" @click="settings" :class="isCurrentRoute('Settings')">
            <span class="icon is-small">
              <i class="fas fa-cog"></i>
            </span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import fontawesome from '@fortawesome/fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import 'bulma/css/bulma.css';
import Vue from 'vue';

fontawesome.library.add(solid)

export default Vue.extend({
  name: 'GlobalMenu',
  methods: {
    isCurrentRoute(buttonName) {
      return buttonName === this.$route.name ? 'is-info' : '';
    },
    newMesure() {
      console.log('New mesure clicked');
      this.$router.push('/');
    },
    history() {
      console.log('History clicked');
      this.$router.push('/history');
    },
    settings() {
      console.log('Settings clicked');
      this.$router.push('/settings');
    },
  },
});
</script>

<style scoped>
nav {
  border-bottom: 1px solid black;
}
</style>
