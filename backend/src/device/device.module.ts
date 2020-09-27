import { Module } from '@nestjs/common'
import { DeviceService } from './service/device.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeviceEntity } from './entity/device.entity'
import { DeviceHistoryService } from './service/device-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity])],
  providers: [DeviceService, DeviceHistoryService],
  exports: [DeviceService]
})
export class DeviceModule {}
