import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { IUseCaseMediator } from '../application/usecase.mediator';

@Injectable()
export class CalculateAverageTask {
  constructor(private readonly mediator: IUseCaseMediator) {}
  @Interval(10000)
  async handleCron() {
    console.log('STARTING CRON');
    await this.mediator.notify('calculateCurrentEnviromentStatusUseCase', {});
    console.log('ENDING CRON');
  }
}
