<script setup lang="ts">
import { Check } from 'lucide-vue-next'

const props = defineProps<{
  options: readonly string[]
  modelValue: string[]
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

function toggle(option: string) {
  const next = props.modelValue.includes(option)
    ? props.modelValue.filter((o) => o !== option)
    : [...props.modelValue, option]
  emit('update:modelValue', next)
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="opt in options"
      :key="opt"
      type="button"
      class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition"
      :class="
        modelValue.includes(opt)
          ? 'border-indigo-500 bg-indigo-600 text-white'
          : 'border-zinc-200 bg-white text-zinc-600 hover:border-indigo-300 hover:text-indigo-600'
      "
      @click="toggle(opt)"
    >
      <Check v-if="modelValue.includes(opt)" class="h-3.5 w-3.5" />
      {{ opt }}
    </button>
  </div>
</template>
