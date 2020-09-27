import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { DeviceHistoryEntity } from '../entity/device-history.entity'
import { InjectRepository } from '@nestjs/typeorm'
import {
  DeviceHistoricChanges,
  DeviceHistoricMetadata
} from '../dto/device-historic.dto'
import { ModelWithPaginate } from 'src/entity/model'
import { calculePagination, normalizeListResponse } from 'src/utils/orm.utils'

@Injectable()
export class DeviceHistoryService {
  constructor(
    @InjectRepository(DeviceHistoryEntity)
    protected readonly DeviceHistoryRepository: Repository<DeviceHistoryEntity>
  ) {}
  changeValue(
    userId: string,
    deviceId: string,
    origem: string,
    changes: DeviceHistoricChanges
  )
  changeValue(
    userId: string,
    deviceId: string,
    origem: string,
    changes: DeviceHistoricChanges[]
  )
  changeValue(
    userId: string,
    deviceId: string,
    origem: string,
    changes: DeviceHistoricChanges | DeviceHistoricChanges[]
  ) {
    const _changes = Array.isArray(changes) ? changes : [changes]
    const metadata: DeviceHistoricMetadata[] = _changes.map(item => ({
      type: item.property,
      value: item.value
    }))
    const historic = this.DeviceHistoryRepository.create({
      device_id: deviceId,
      metadata,
      event: 'change',
      user_id: userId,
      origem
    })
    return this.DeviceHistoryRepository.save(historic)
  }
  async list(
    deviceId: string,
    {
      page = 1,
      perpage = 20,
      orderBy = 'created_at',
      orderDir = 'DESC'
    }: {
      page: number
      perpage: number
      orderBy: string
      orderDir: string
    }
  ): Promise<ModelWithPaginate<DeviceHistoryEntity>> {
    const { take, skip } = calculePagination(page, perpage)
    const [result, total] = await this.DeviceHistoryRepository.findAndCount({
      where: { device_id: deviceId },
      take,
      skip,
      order: {
        [orderBy || 'created_at']: orderDir || 'DESC'
      }
    })
    return normalizeListResponse<DeviceHistoryEntity>(
      result,
      total,
      page,
      perpage
    )
  }
}
