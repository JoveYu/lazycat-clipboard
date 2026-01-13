<script setup lang="ts">
import ClipboardList from '@/components/clipboard/ClipboardList.vue'
import FloatingAddButton from '@/components/input/FloatingAddButton.vue'
</script>

<template>
  <div class="h-screen flex flex-col pb-24 px-4 pt-4 overflow-y-auto hide-scrollbar">
    <ClipboardList class="flex-1" />
    <FloatingAddButton />
  </div>
</template>
