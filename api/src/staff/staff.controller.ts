import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { StaffService } from './staff.service'

interface UploadedFilesMap {
  avatar?: Express.Multer.File[]
  resume?: Express.Multer.File[]
}

@Controller('api/staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post('submit')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'resume', maxCount: 1 },
    ]),
  )
  async submit(
    @Body() body: Record<string, string>,
    @UploadedFiles() files: UploadedFilesMap,
  ) {
    const avatar = files?.avatar?.[0]
    const resume = files?.resume?.[0]
    return this.staffService.submit(body, avatar, resume)
  }
}
