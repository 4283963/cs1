<script setup lang="ts">
import { DESIGN_STYLE_OPTIONS } from '@/types/staff'
import ChipGroup from '@/components/ChipGroup.vue'

defineProps<{
  portfolio: string
  styles: string[]
  errorPortfolio?: string
  errorStyles?: string
}>()
const emit = defineEmits<{
  'update:portfolio': [value: string]
  'update:styles': [value: string[]]
}>()
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="mb-1.5 block text-sm font-medium text-zinc-700">
        作品集链接 <span class="text-rose-500">*</span>
      </label>
      <input
        type="url"
        :value="portfolio"
        placeholder="https://your-portfolio.com"
        class="field-input"
        :class="errorPortfolio ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''"
        @input="emit('update:portfolio', ($event.target as HTMLInputElement).value)"
      />
      <p v-if="errorPortfolio" class="mt-1 text-xs text-rose-500">
        {{ errorPortfolio }}
      </p>
    </div>

    <div>
      <label class="mb-1.5 block text-sm font-medium text-zinc-700">
        擅长风格 <span class="text-rose-500">*</span>
      </label>
      <ChipGroup
        :options="DESIGN_STYLE_OPTIONS"
        :model-value="styles"
        @update:model-value="emit('update:styles', $event)"
      />
      <p v-if="errorStyles" class="mt-1 text-xs text-rose-500">
        {{ errorStyles }}
      </p>
    </div>
  </div>
</template>
