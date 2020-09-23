import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AlexaTokenEntity } from './entity/alexa-token.entity'
import { AlexaAuthorizationService } from './service/alexa-authorization.service'
import { AlexaResponseService } from './service/alexa-response.service'
import { AlexaControllerService } from './service/alexa-controller.service'
import { AlexaEventService } from './service/alexa-event.service'

@Module({
  imports: [TypeOrmModule.forFeature([AlexaTokenEntity])],
  providers: [
    AlexaAuthorizationService,
    AlexaResponseService,
    AlexaControllerService,
    AlexaEventService
  ],
  exports: [
    AlexaAuthorizationService,
    AlexaResponseService,
    AlexaControllerService,
    AlexaEventService
  ]
})
export class AlexaModule {}
