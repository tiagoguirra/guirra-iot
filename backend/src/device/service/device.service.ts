import { Injectable } from '@nestjs/common'
import { DeviceEntity } from '../entity/device.entity'
import { Repository, Like } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { calculePagination, normalizeListResponse } from 'src/utils/orm.utils'
import { DeviceInputDto, DeviceChangeInput } from 'src/dto/device.dto'
import { ModelWithPaginate } from 'src/entity/model'
import { Device } from '../interface/device'
import { DeviceDto } from '../dto/device.dto'

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private readonly DeviceRepository: Repository<DeviceEntity>
  ) {}

  getById(userId: string, deviceId: string) {
    return this.DeviceRepository.findOne({
      device_id: deviceId,
      user_id: userId
    })
  }
  getAll(userId: string) {
    return this.DeviceRepository.find({
      user_id: userId
    })
  }
  async list(
    userId: string,
    {
      page = 1,
      perpage = 20,
      orderBy = 'name',
      orderDir = 'ASC',
      search,
      category
    }: {
      page: number
      perpage: number
      orderBy: string
      orderDir: string
      search?: string
      category?: string
    }
  ): Promise<ModelWithPaginate<DeviceDto>> {
    let where: any = { user_id: userId }
    if (search) {
      where = {
        ...where,
        name: Like(`%${search}%`)
      }
    }
    const { take, skip } = calculePagination(page, perpage)
    const [result, total] = await this.DeviceRepository.findAndCount({
      where,
      take,
      skip,
      order: {
        [orderBy]: orderDir
      }
    })
    return normalizeListResponse<DeviceDto>(result, total, page, perpage)
  }
  create(userId: string, _device: DeviceInputDto) {
    const device = this.DeviceRepository.create({
      category: _device.category,
      modes: _device.modes,
      name: _device.name,
      properties: _device.properties,
      template: _device.template,
      user_id: userId,
      device_shadow: _device.device_shadow
    })
    return this.DeviceRepository.save(device)
  }
  async update(userId: string, deviceId: string, _device: DeviceInputDto) {
    const device = await this.DeviceRepository.findOne({
      device_id: deviceId,
      user_id: userId
    })
    if (device) {
      device.category = _device.category || device.category
      device.modes = _device.modes || device.modes
      device.template = _device.template || device.template
      device.properties = _device.properties || device.properties
      device.name = _device.name || device.name
      device.device_shadow = _device.device_shadow || device.device_shadow
      return await this.DeviceRepository.save(device)
    }
    return null
  }
  async remove(userId: string, deviceId: string) {
    const device = await this.DeviceRepository.findOne({
      device_id: deviceId,
      user_id: userId
    })
    if (device) {
      return await this.DeviceRepository.remove(device)
    }
    return null
  }
  async change(
    userId: string,
    deviceId: string,
    propetyChange: DeviceChangeInput
  ) {
    const device = await this.DeviceRepository.findOne({
      device_id: deviceId,
      user_id: userId
    })
    if (device) {
      const deviceHandler = new Device(device.toJson())
      await deviceHandler.set(propetyChange.property, propetyChange.value)
      return device
    }
    return null
  }
  async status(
    userId: string,
    deviceId: string,
    { property = '' }: { property?: string }
  ) {
    const device = await this.DeviceRepository.findOne({
      device_id: deviceId,
      user_id: userId
    })
    if (device) {
      const deviceHandler = new Device(device.toJson())
      return await deviceHandler.get(property)
    }
    return null
  }
  async settings(userId: string, deviceId: string) {
    const device = await this.DeviceRepository.findOne({
      device_id: deviceId,
      user_id: userId
    })
    if (device) {
      const deviceHandler = new Device(device.toJson())
      return await deviceHandler.getSettings()
    }
    return null
  }
}
