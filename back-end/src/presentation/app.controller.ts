import { Controller, Get } from '@nestjs/common';
import { IUseCaseMediator } from '../application';

@Controller()
export class AppController {
  constructor(private readonly mediator: IUseCaseMediator) {}

  @Get('/environment-status-list')
  async getFirebaseData(): Promise<any> {
    return await this.mediator.notify('listEnviromentStatus', {});
  }

  @Get('/current-environment-status')
  getCurrentEnvironment(): any {
    return this.mediator.notify('getCurrentEnvironmentStatus', {});
  }

  @Get('/half-hour-environment-status')
  getLastHalfHourEnvironmentStatus(): any {
    return this.mediator.notify('getLastHalfHourEnvironmentStatusUseCase', {});
  }

  @Get('/last-environment-status')
  getLastEnvironmentStatus(): any {
    return this.mediator.notify('getLastEnvironmentStatusUseCase', {});
  }
}
