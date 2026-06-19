<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { FileText, Upload, X, Eye } from 'lucide-vue-next'

const file = defineModel<File | null>({ default: null })

const inputRef = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const previewUrl = ref('')

const isPdf = (f: File) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')

function setPreview(f: File | null) {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = f ? URL.createObjectURL(f) : ''
}

function handleFiles(files: FileList | null) {
  if (!files || files.length === 0) return
  const f = files[0]
  if (!isPdf(f)) return
  file.value = f
  setPreview(f)
}

function onInputChange(e: Event) {
  const target = e.target as HTMLInputElement
  handleFiles(target.files)
  target.value = ''
}

function onDrop(e: DragEvent) {
  dragging.value = false
  handleFiles(e.dataTransfer?.files ?? null)
}

function clear() {
  file.value = null
  setPreview(null)
  if (inputRef.value) inputRef.value.value = ''
}

onBeforeUnmount(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})

const fileSize = computed(() => {
  if (!file.value) return ''
  const kb = file.value.size / 1024
  return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`
})

const showPreview = computed(() => !!previewUrl.value)
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div class="space-y-2">
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
        @click="inputRef?.click()"
      >
        <Upload class="h-4 w-4" />
        上传 PDF 简历
      </button>
      <input
        ref="inputRef"
        type="file"
        accept="application/pdf"
        class="hidden"
        @change="onInputChange"
      />

      <div
        class="flex min-h-[104px] items-start gap-3 rounded-xl border-2 border-dashed p-3 transition"
        :class="
          dragging
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-zinc-200 bg-zinc-50'
        "
        @dragover.prevent="dragging = true"
        @dragleave.prevent="dragging = false"
        @drop.prevent="onDrop"
      >
        <span
          class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          :class="file ? 'bg-indigo-600 text-white' : 'bg-zinc-200 text-zinc-500'"
        >
          <FileText v-if="file" class="h-5 w-5" />
          <Eye v-else class="h-5 w-5" />
        </span>
        <div class="min-w-0 flex-1">
          <template v-if="file">
            <p class="truncate text-sm font-medium text-zinc-800" :title="file.name">
              {{ file.name }}
            </p>
            <p class="text-xs text-zinc-400">{{ fileSize }}</p>
            <button
              type="button"
              class="mt-2 inline-flex items-center gap-1 text-xs font-medium text-rose-500 transition hover:text-rose-600"
              @click="clear"
            >
              <X class="h-3.5 w-3.5" />
              移除简历
            </button>
          </template>
          <template v-else>
            <p class="text-sm text-zinc-500">拖拽 PDF 文件到此处，或点击上方按钮</p>
            <p class="text-xs text-zinc-400">仅支持 PDF 格式</p>
          </template>
        </div>
      </div>
    </div>

    <div>
      <div
        class="flex h-[260px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white"
      >
        <div class="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-3 py-2">
          <span class="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <Eye class="h-3.5 w-3.5" />
            简历预览
          </span>
          <a
            v-if="showPreview"
            :href="previewUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs text-indigo-600 hover:text-indigo-700"
          >
            新窗口打开
          </a>
        </div>
        <div class="relative flex-1 bg-zinc-50">
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <iframe
              v-if="showPreview"
              :src="previewUrl"
              class="absolute inset-0 h-full w-full border-0"
              title="简历 PDF 预览"
            />
            <div
              v-else
              class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center text-zinc-400"
            >
              <FileText class="h-10 w-10" />
              <p class="text-sm">上传 PDF 后这里会实时显示预览</p>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>
