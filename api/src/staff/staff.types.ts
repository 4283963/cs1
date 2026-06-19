export type Position = 'tech' | 'design'

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

export interface SubmitResult {
  success: boolean
  id: string
}
