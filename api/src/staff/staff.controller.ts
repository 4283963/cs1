import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { StaffService } from './staff.service'

@Controller('api/staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post('submit')
  @UseInterceptors(FileInterceptor('avatar'))
  async submit(@Body() body: Record<string, string>, @UploadedFile() file?: Express.Multer.File) {
    return this.staffService.submit(body, file)
  }
}
