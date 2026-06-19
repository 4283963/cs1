<script setup lang="ts">
import { Code2, Palette } from 'lucide-vue-next'
import type { Position } from '@/types/staff'

defineProps<{ modelValue: Position | '' }>()
const emit = defineEmits<{ 'update:modelValue': [value: Position] }>()

interface Option {
  value: Position
  label: string
  desc: string
  icon: typeof Code2
}

const options: Option[] = [
  {
    value: 'tech',
    label: '技术岗',
    desc: '研发工程师 / 架构 / 算法',
    icon: Code2,
  },
  {
    value: 'design',
    label: '设计岗',
    desc: 'UI / 视觉 / 交互',
    icon: Palette,
  },
]

function pick(value: Position) {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="grid grid-cols-2 gap-3">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="group flex items-start gap-3 rounded-xl border-2 p-3.5 text-left transition"
      :class="
        modelValue === opt.value
          ? 'border-indigo-500 bg-indigo-50/60 shadow-sm'
          : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
      "
      @click="pick(opt.value)"
    >
      <span
        class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition"
        :class="
          modelValue === opt.value
            ? 'bg-indigo-600 text-white'
            : 'bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200'
        "
      >
        <component :is="opt.icon" class="h-5 w-5" />
      </span>
      <span class="min-w-0">
        <span class="block text-sm font-semibold text-zinc-800">{{
          opt.label
        }}</span>
        <span class="block text-xs text-zinc-400">{{ opt.desc }}</span>
      </span>
    </button>
  </div>
</template>
