<script setup>
// TODO Make this a dropdown
const changeTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  // localstorage?
};
</script>

<template>
  <button class="btn btn-primary" @click="changeTheme('pastel')">Pastel</button>
</template>
