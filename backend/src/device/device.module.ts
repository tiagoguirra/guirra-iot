import { Module } from '@nestjs/common'
import { DeviceService } from './service/device.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeviceEntity } from './entity/device.entity'
import { DeviceHistoryService } from './service/device-history.service'
import { DeviceHistoryEntity } from './entity/device-history.entity'

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity, DeviceHistoryEntity])],
  providers: [DeviceService, DeviceHistoryService],
  exports: [DeviceService, DeviceHistoryService]
})
export class DeviceModule {}
