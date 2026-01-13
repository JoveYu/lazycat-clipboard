<script setup lang="ts">
import { computed, inject } from 'vue'
import draggable from 'vuedraggable'
import ClipboardItemComponent from './ClipboardItem.vue'
import { useClipboardItems } from '@/composables/useClipboardItems'
import { useClipboard } from '@/composables/useClipboard'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import { isTextItem, isImageItem } from '@/types/clipboard'
import type { ClipboardItem } from '@/types/clipboard'

const {
  items,
  selectedIndex,
  isLoading,
  reorderItems,
  selectNext,
  selectPrevious,
  selectIndex
} = useClipboardItems()

const { copyText, copyImage } = useClipboard()

const showEditModal = inject<(item: ClipboardItem) => void>('showEditModal')
const showDeleteConfirm = inject<(item: ClipboardItem) => void>('showDeleteConfirm')
const isModalOpen = inject<{ value: boolean }>('isModalOpen', { value: false })
const focusInput = inject<() => void>('focusInput')

async function handleCopy(index: number) {
  const item = items.value[index]
  if (!item) return

  selectIndex(index)

  if (isTextItem(item)) {
    await copyText(item.content)
  } else if (isImageItem(item)) {
    if (item.blob) {
      await copyImage(item.blob)
    } else {
      console.warn('未找到可复制的图片数据')
    }
  }
}

function handleEdit(index: number) {
  const item = items.value[index]
  if (item && showEditModal) {
    selectIndex(index)
    showEditModal(item)
  }
}

function handleDelete(index: number) {
  const item = items.value[index]
  if (item && showDeleteConfirm) {
    selectIndex(index)
    showDeleteConfirm(item)
  }
}

function handleDragEnd() {
  reorderItems([...items.value])
}

function handleDragStart() {
  // 触发手机震动反馈
  if (navigator.vibrate) {
    navigator.vibrate(50)
  }
}

// Setup keyboard shortcuts
useKeyboardShortcuts({
  items,
  selectedIndex,
  onNavigate: (direction) => {
    if (direction === 'up') {
      selectPrevious()
    } else {
      selectNext()
    }
  },
  onCopy: handleCopy,
  onEdit: handleEdit,
  onDelete: handleDelete,
  onFocusInput: focusInput,
  isModalOpen: isModalOpen as any
})

const dragOptions = computed(() => ({
  animation: 200,
  group: 'clipboard-items',
  disabled: false,
  ghostClass: 'ghost',
  delay: 800,
  delayOnTouchOnly: true,
  touchStartThreshold: 20,
  forceFallback: true,
  fallbackTolerance: 5
}))
</script>

<template>
  <div :class="['clipboard-list', { 'h-full': items.length === 0 || isLoading }]">
    <div v-if="isLoading" class="flex items-center justify-center h-full text-[var(--color-apple-gray-500)]">
      加载中...
    </div>

    <div v-else-if="items.length === 0" class="flex flex-col items-center justify-center h-full text-center">
      <p class="text-[var(--color-apple-gray-500)]">欢迎使用懒猫剪切板</p>
      <p class="hidden md:block text-sm text-[var(--color-apple-gray-500)] mt-1">请在左边添加文字或图片到剪切板</p>
      <p class="block md:hidden text-sm text-[var(--color-apple-gray-500)] mt-1">点击右下角添加文字或图片</p>
    </div>

    <draggable
      v-else
      v-model="items"
      v-bind="dragOptions"
      item-key="id"
      @start="handleDragStart"
      @end="handleDragEnd"
      class="space-y-3"
    >
      <template #item="{ element, index }">
        <ClipboardItemComponent
          :item="element"
          :is-selected="selectedIndex === index"
          @copy="handleCopy(index)"
          @edit="handleEdit(index)"
        />
      </template>
    </draggable>
  </div>
</template>

<style scoped>
.ghost {
  opacity: 0.5;
  background: var(--color-apple-gray-100);
}
</style>
