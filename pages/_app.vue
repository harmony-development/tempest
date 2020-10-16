<template>
  <div class="root">
    <div class="guild-list"></div>
    <div class="channel-list"></div>
    <div class="chat">
      {{ $route.params['guild_id'] }}
    </div>
    <div class="member-list"></div>
  </div>
</template>

<style scoped>
.root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow: auto;
}

.guild-list {
  padding: 8px;
  display: flex;
  flex-direction: column;
  background-color: var(--harmony-dark-800);
}

.channel-list {
  width: 400px;
  overflow-y: auto;
  text-overflow: ellipsis;
  background-color: var(--harmony-dark-700);
}

.chat {
  display: flex;
  flex-direction: column;
  flex-flow: column;
  width: 100%;
  height: 100%;
}

.member-list {
  width: 350px;
  overflow-y: auto;
  background-color: var(--harmony-dark-700);
}
</style>
