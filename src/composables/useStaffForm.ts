import { reactive, ref, computed } from 'vue'
import type { StaffFormState, SubmitResponse } from '@/types/staff'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^1[3-9]\d{9}$/

function createInitialState(): StaffFormState {
  return {
    name: '',
    email: '',
    phone: '',
    joinDate: '',
    position: '',
    github: '',
    techStack: [],
    portfolio: '',
    styles: [],
  }
}

export function useStaffForm() {
  const form = reactive<StaffFormState>(createInitialState())
  const avatarFile = ref<File | null>(null)
  const resumeFile = ref<File | null>(null)
  const submitting = ref(false)
  const submitError = ref('')
  const submittedId = ref('')

  const errors = reactive<Record<string, string>>({})

  function validate(): boolean {
    Object.keys(errors).forEach((k) => delete errors[k])

    if (!form.name.trim()) errors.name = '请输入姓名'
    if (!form.email.trim()) {
      errors.email = '请输入邮箱'
    } else if (!EMAIL_RE.test(form.email.trim())) {
      errors.email = '邮箱格式不正确'
    }
    if (!form.phone.trim()) {
      errors.phone = '请输入手机号'
    } else if (!PHONE_RE.test(form.phone.trim())) {
      errors.phone = '手机号格式不正确'
    }
    if (!form.joinDate) errors.joinDate = '请选择入职日期'

    if (!form.position) {
      errors.position = '请选择岗位'
    } else if (form.position === 'tech') {
      if (!form.github.trim()) errors.github = '请填写 Github 主页'
      if (form.techStack.length === 0) errors.techStack = '请至少选择一项技术栈'
    } else if (form.position === 'design') {
      if (!form.portfolio.trim()) errors.portfolio = '请填写作品集链接'
      if (form.styles.length === 0) errors.styles = '请至少选择一项擅长风格'
    }

    return Object.keys(errors).length === 0
  }

  function buildFormData(): FormData {
    const fd = new FormData()
    fd.append('name', form.name.trim())
    fd.append('email', form.email.trim())
    fd.append('phone', form.phone.trim())
    fd.append('joinDate', form.joinDate)
    fd.append('position', form.position)
    if (form.position === 'tech') {
      fd.append('github', form.github.trim())
      fd.append('techStack', JSON.stringify(form.techStack))
    }
    if (form.position === 'design') {
      fd.append('portfolio', form.portfolio.trim())
      fd.append('styles', JSON.stringify(form.styles))
    }
    if (avatarFile.value) {
      fd.append('avatar', avatarFile.value)
    }
    if (resumeFile.value) {
      fd.append('resume', resumeFile.value)
    }
    return fd
  }

  async function submit(): Promise<boolean> {
    submitError.value = ''
    submittedId.value = ''
    if (!validate()) return false

    submitting.value = true
    try {
      const res = await fetch('/api/staff/submit', {
        method: 'POST',
        body: buildFormData(),
      })
      const data = (await res.json()) as SubmitResponse
      if (!res.ok || !data.success) {
        submitError.value = data.message || `提交失败 (HTTP ${res.status})`
        return false
      }
      submittedId.value = data.id
      return true
    } catch (e) {
      submitError.value = e instanceof Error ? e.message : '网络错误，提交失败'
      return false
    } finally {
      submitting.value = false
    }
  }

  function reset() {
    Object.assign(form, createInitialState())
    avatarFile.value = null
    resumeFile.value = null
    submitError.value = ''
    submittedId.value = ''
    Object.keys(errors).forEach((k) => delete errors[k])
  }

  const isValid = computed(() => Object.keys(errors).length === 0)

  return {
    form,
    avatarFile,
    resumeFile,
    errors,
    submitting,
    submitError,
    submittedId,
    isValid,
    validate,
    submit,
    reset,
  }
}
