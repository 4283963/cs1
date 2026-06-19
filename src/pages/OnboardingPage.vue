<script setup lang="ts">
import { ref } from 'vue'
import {
  User,
  Mail,
  Phone,
  CalendarDays,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  PartyPopper,
} from 'lucide-vue-next'
import PositionSelector from '@/components/PositionSelector.vue'
import TechFields from '@/components/TechFields.vue'
import DesignFields from '@/components/DesignFields.vue'
import AvatarUploader from '@/components/AvatarUploader.vue'
import ResumeUploader from '@/components/ResumeUploader.vue'
import { useStaffForm } from '@/composables/useStaffForm'

const {
  form,
  avatarFile,
  resumeFile,
  errors,
  submitting,
  submitError,
  submittedId,
  submit,
  reset,
} = useStaffForm()

const touched = ref(false)

async function handleSubmit() {
  touched.value = true
  await submit()
}
</script>

<template>
  <div class="min-h-screen px-4 py-10 sm:py-14">
    <div class="mx-auto w-full max-w-3xl">
      <header class="mb-7">
        <span
          class="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700"
        >
          HR · 入职登记
        </span>
        <h1 class="mt-3 font-display text-3xl font-bold text-zinc-900">
          欢迎加入团队
        </h1>
        <p class="mt-1.5 text-sm text-zinc-500">
          请如实填写以下信息，提交后将自动同步至 HR 系统。
        </p>
      </header>

      <div
        v-if="submittedId"
        class="rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm"
      >
        <div
          class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
        >
          <PartyPopper class="h-7 w-7" />
        </div>
        <h2 class="mt-4 font-display text-xl font-semibold text-zinc-900">
          提交成功
        </h2>
        <p class="mt-1 text-sm text-zinc-500">
          你的入职档案已记录，档案编号：
          <span class="font-mono text-indigo-600">{{ submittedId }}</span>
        </p>
        <button
          type="button"
          class="mt-5 inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          @click="reset(), (touched = false)"
        >
          <RotateCcw class="h-4 w-4" />
          再填一份
        </button>
      </div>

      <form
        v-else
        class="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"
        novalidate
        @submit.prevent="handleSubmit"
      >
        <section class="space-y-4">
          <h2 class="font-display text-sm font-semibold uppercase tracking-wide text-zinc-400">
            基础信息
          </h2>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-zinc-700">
                姓名 <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <User
                  class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                />
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="请输入姓名"
                  class="field-input pl-9"
                  :class="touched && errors.name ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''"
                />
              </div>
              <p v-if="touched && errors.name" class="mt-1 text-xs text-rose-500">
                {{ errors.name }}
              </p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-zinc-700">
                邮箱 <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <Mail
                  class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                />
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="name@company.com"
                  class="field-input pl-9"
                  :class="touched && errors.email ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''"
                />
              </div>
              <p v-if="touched && errors.email" class="mt-1 text-xs text-rose-500">
                {{ errors.email }}
              </p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-zinc-700">
                手机号 <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <Phone
                  class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                />
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="请输入手机号"
                  class="field-input pl-9"
                  :class="touched && errors.phone ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''"
                />
              </div>
              <p v-if="touched && errors.phone" class="mt-1 text-xs text-rose-500">
                {{ errors.phone }}
              </p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-zinc-700">
                入职日期 <span class="text-rose-500">*</span>
              </label>
              <div class="relative">
                <CalendarDays
                  class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                />
                <input
                  v-model="form.joinDate"
                  type="date"
                  class="field-input pl-9"
                  :class="touched && errors.joinDate ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : ''"
                />
              </div>
              <p v-if="touched && errors.joinDate" class="mt-1 text-xs text-rose-500">
                {{ errors.joinDate }}
              </p>
            </div>
          </div>
        </section>

        <hr class="my-6 border-zinc-100" />

        <section class="space-y-3">
          <h2 class="font-display text-sm font-semibold uppercase tracking-wide text-zinc-400">
            岗位选择
          </h2>
          <PositionSelector v-model="form.position" />
          <p v-if="touched && errors.position" class="text-xs text-rose-500">
            {{ errors.position }}
          </p>
        </section>

        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in absolute"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          mode="out-in"
        >
          <section v-if="form.position === 'tech'" key="tech" class="mt-6">
            <h2 class="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-zinc-400">
              技术岗信息
            </h2>
            <TechFields
              v-model:github="form.github"
              v-model:tech-stack="form.techStack"
              :error-github="touched ? errors.github : ''"
              :error-tech-stack="touched ? errors.techStack : ''"
            />
          </section>
          <section v-else-if="form.position === 'design'" key="design" class="mt-6">
            <h2 class="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-zinc-400">
              设计岗信息
            </h2>
            <DesignFields
              v-model:portfolio="form.portfolio"
              v-model:styles="form.styles"
              :error-portfolio="touched ? errors.portfolio : ''"
              :error-styles="touched ? errors.styles : ''"
            />
          </section>
        </Transition>

        <hr class="my-6 border-zinc-100" />

        <section>
          <h2 class="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-zinc-400">
            附件上传
          </h2>
          <div class="space-y-5">
            <div>
              <h3 class="mb-2 text-sm font-medium text-zinc-700">个人头像</h3>
              <AvatarUploader v-model="avatarFile" />
            </div>
            <div>
              <h3 class="mb-2 text-sm font-medium text-zinc-700">PDF 简历</h3>
              <ResumeUploader v-model="resumeFile" />
            </div>
          </div>
        </section>

        <div
          v-if="touched && submitError"
          class="mt-5 flex items-center gap-2 rounded-lg bg-rose-50 px-3.5 py-2.5 text-sm text-rose-600"
        >
          <AlertCircle class="h-4 w-4 shrink-0" />
          {{ submitError }}
        </div>

        <button
          type="submit"
          :disabled="submitting"
          class="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <template v-if="submitting">
            <Loader2 class="h-4 w-4 animate-spin" />
            提交中...
          </template>
          <template v-else>
            <CheckCircle2 class="h-4 w-4" />
            提交入职信息
          </template>
        </button>
      </form>

      <p class="mt-6 text-center text-xs text-zinc-400">
        © {{ new Date().getFullYear() }} HR 入职填报系统 · 数据将保存至服务端 JSON 文件
      </p>
    </div>
  </div>
</template>
