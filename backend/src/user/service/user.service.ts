import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { UserEntity } from '../entity/user.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { hashSync } from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>
  ) {}

  findByEmail(email: string) {
    return this.UserRepository.findOne({ email })
  }
  findById(userId: string) {
    return this.UserRepository.findOne({ user_id: userId })
  }
  async create(name: string, email: string, password: string) {
    const alradyExist = await this.UserRepository.findOne({ email })
    if (alradyExist) {
      throw new Error('Email is already registered')
    }
    const user = this.UserRepository.create({
      email,
      name,
      password: hashSync(password, 10)
    })
    return await this.UserRepository.save(user)
  }
}
