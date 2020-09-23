import { Module } from '@nestjs/common'
import { DeviceService } from './service/device.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeviceEntity } from './entity/device.entity'

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity])],
  providers: [DeviceService],
  exports: [DeviceService]
})
export class DeviceModule {}
