<script setup lang="ts">
import { TECH_STACK_OPTIONS } from '@/types/staff'
import ChipGroup from '@/components/ChipGroup.vue'

defineProps<{
  github: string
  techStack: string[]
  errorGithub?: string
  errorTechStack?: string
}>()
const emit = defineEmits<{
  'update:github': [value: string]
  'update:techStack': [value: string[]]
}>()
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="mb-1.5 block text-sm font-medium text-zinc-700">
        Github 主页 <span class="text-rose-500">*</span>
      </label>
      <input
        type="url"
        :value="github"
        placeholder="https://github.com/your-name"
        class="field-input"
        :class="errorGithub ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''"
        @input="emit('update:github', ($event.target as HTMLInputElement).value)"
      />
      <p v-if="errorGithub" class="mt-1 text-xs text-rose-500">
        {{ errorGithub }}
      </p>
    </div>

    <div>
      <label class="mb-1.5 block text-sm font-medium text-zinc-700">
        常用技术栈 <span class="text-rose-500">*</span>
      </label>
      <ChipGroup
        :options="TECH_STACK_OPTIONS"
        :model-value="techStack"
        @update:model-value="emit('update:techStack', $event)"
      />
      <p v-if="errorTechStack" class="mt-1 text-xs text-rose-500">
        {{ errorTechStack }}
      </p>
    </div>
  </div>
</template>
