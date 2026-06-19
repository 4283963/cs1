export type Position = 'tech' | 'design'

export interface StaffFormState {
  name: string
  email: string
  phone: string
  joinDate: string
  position: Position | ''
  github: string
  techStack: string[]
  portfolio: string
  styles: string[]
}

export interface StaffRecord {
  id: string
  name: string
  email: string
  phone: string
  joinDate: string
  position: Position
  github?: string
  techStack?: string[]
  portfolio?: string
  styles?: string[]
  avatarPath?: string
  resumePath?: string
  createdAt: string
}

export interface SubmitResponse {
  success: boolean
  id: string
  message?: string
}

export const TECH_STACK_OPTIONS = [
  'Vue',
  'React',
  'Node.js',
  'TypeScript',
  'Python',
  'Go',
  'Java',
  'Rust',
] as const

export const DESIGN_STYLE_OPTIONS = [
  '极简风',
  '扁平化',
  '拟物',
  '新拟态',
  '插画',
  '3D 视觉',
  '品牌视觉',
] as const
