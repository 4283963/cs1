import { Injectable, BadRequestException } from '@nestjs/common'
import { promises as fs } from 'fs'
import { join } from 'path'
import type { Position, StaffRecord, SubmitResult } from './staff.types'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^1[3-9]\d{9}$/
const IMAGE_MIME = /^image\//
const PDF_MIME = /^application\/pdf$/


interface FieldErrors {
  [key: string]: string
}

function parseArray(raw: string | undefined): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

@Injectable()
export class StaffService {
  private readonly dataDir = join(__dirname, '..', '..', 'data')
  private readonly dataFile = join(this.dataDir, 'staff.json')
  private readonly uploadsDir = join(__dirname, '..', '..', 'uploads')

  async submit(
    body: Record<string, string>,
    avatarFile?: Express.Multer.File,
    resumeFile?: Express.Multer.File,
  ): Promise<SubmitResult> {
    const position = body.position as Position
    const techStack = parseArray(body.techStack)
    const styles = parseArray(body.styles)

    const errors = this.validate(body, position, techStack, styles, avatarFile, resumeFile)
    if (Object.keys(errors).length > 0) {
      throw new BadRequestException({ message: '校验失败', errors })
    }

    await fs.mkdir(this.dataDir, { recursive: true })
    await fs.mkdir(this.uploadsDir, { recursive: true })

    const id = Date.now().toString()
    const record: StaffRecord = {
      id,
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      joinDate: body.joinDate,
      position,
      createdAt: new Date().toISOString(),
    }

    if (position === 'tech') {
      record.github = body.github.trim()
      record.techStack = techStack
    } else if (position === 'design') {
      record.portfolio = body.portfolio.trim()
      record.styles = styles
    }

    if (avatarFile) {
      const ext = (avatarFile.originalname.split('.').pop() || 'png').toLowerCase()
      const filename = `${id}-avatar.${ext}`
      await fs.writeFile(join(this.uploadsDir, filename), avatarFile.buffer)
      record.avatarPath = `/uploads/${filename}`
    }

    if (resumeFile) {
      const filename = `${id}-resume.pdf`
      await fs.writeFile(join(this.uploadsDir, filename), resumeFile.buffer)
      record.resumePath = `/uploads/${filename}`
    }

    await this.appendRecord(record)
    return { success: true, id }
  }

  private validate(
    body: Record<string, string>,
    position: Position | undefined,
    techStack: string[],
    styles: string[],
    avatarFile?: Express.Multer.File,
    resumeFile?: Express.Multer.File,
  ): FieldErrors {
    const errors: FieldErrors = {}

    if (!body.name?.trim()) errors.name = '请输入姓名'
    if (!body.email?.trim()) {
      errors.email = '请输入邮箱'
    } else if (!EMAIL_RE.test(body.email.trim())) {
      errors.email = '邮箱格式不正确'
    }
    if (!body.phone?.trim()) {
      errors.phone = '请输入手机号'
    } else if (!PHONE_RE.test(body.phone.trim())) {
      errors.phone = '手机号格式不正确'
    }
    if (!body.joinDate) errors.joinDate = '请选择入职日期'

    if (position !== 'tech' && position !== 'design') {
      errors.position = '请选择岗位'
    } else if (position === 'tech') {
      if (!body.github?.trim()) errors.github = '请填写 Github 主页'
      if (techStack.length === 0) errors.techStack = '请至少选择一项技术栈'
    } else if (position === 'design') {
      if (!body.portfolio?.trim()) errors.portfolio = '请填写作品集链接'
      if (styles.length === 0) errors.styles = '请至少选择一项擅长风格'
    }

    if (avatarFile && !IMAGE_MIME.test(avatarFile.mimetype)) {
      errors.avatar = '头像仅限图片格式'
    }
    if (resumeFile && !PDF_MIME.test(resumeFile.mimetype)) {
      errors.resume = '简历仅限 PDF 格式'
    }

    return errors
  }

  private async readAll(): Promise<StaffRecord[]> {
    try {
      const content = await fs.readFile(this.dataFile, 'utf-8')
      const parsed = JSON.parse(content)
      return Array.isArray(parsed) ? (parsed as StaffRecord[]) : []
    } catch {
      return []
    }
  }

  private async appendRecord(record: StaffRecord): Promise<void> {
    const list = await this.readAll()
    list.push(record)
    await fs.writeFile(this.dataFile, JSON.stringify(list, null, 2), 'utf-8')
  }
}
