<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Upload, ImagePlus, X } from 'lucide-vue-next'

const file = defineModel<File | null>({ default: null })

const inputRef = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const previewUrl = ref('')

const isImage = (f: File) => f.type.startsWith('image/')

function handleFiles(files: FileList | null) {
  if (!files || files.length === 0) return
  const f = files[0]
  if (!isImage(f)) return
  file.value = f
}

function onInputChange(e: Event) {
  const target = e.target as HTMLInputElement
  handleFiles(target.files)
}

function onDrop(e: DragEvent) {
  dragging.value = false
  handleFiles(e.dataTransfer?.files ?? null)
}

function clear() {
  file.value = null
  if (inputRef.value) inputRef.value.value = ''
}

watch(file, (f) => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }
  if (f) previewUrl.value = URL.createObjectURL(f)
})

const fileSize = computed(() => {
  if (!file.value) return ''
  const kb = file.value.size / 1024
  return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`
})
</script>

<template>
  <div class="flex items-center gap-4">
    <div
      class="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-dashed transition"
      :class="
        dragging
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-zinc-300 bg-zinc-100'
      "
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <img
        v-if="previewUrl"
        :src="previewUrl"
        alt="头像预览"
        class="h-full w-full object-cover"
      />
      <div
        v-else
        class="flex h-full w-full flex-col items-center justify-center text-zinc-400"
      >
        <ImagePlus class="h-5 w-5" />
      </div>

      <button
        v-if="previewUrl"
        type="button"
        class="absolute right-0 top-0 rounded-bl-lg rounded-tr-full bg-black/50 p-1 text-white transition hover:bg-black/70"
        aria-label="移除头像"
        @click="clear"
      >
        <X class="h-3.5 w-3.5" />
      </button>
    </div>

    <div class="space-y-1">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
        @click="inputRef?.click()"
      >
        <Upload class="h-4 w-4" />
        上传个人头像
      </button>
      <p class="text-xs text-zinc-400">
        <template v-if="file">{{ file.name }} · {{ fileSize }}</template>
        <template v-else>支持拖拽上传，仅限图片格式</template>
      </p>
      <input
        ref="inputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onInputChange"
      />
    </div>
  </div>
</template>
