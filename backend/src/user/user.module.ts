import { Module } from '@nestjs/common'
import { UserService } from './service/user.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './entity/user.entity'

@Module({
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [UserService]
})
export class UserModule {}
