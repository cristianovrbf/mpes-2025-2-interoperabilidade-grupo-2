import { ConflictException } from '@nestjs/common';
import { ListEnviromentStatusUseCase } from './list-environment-status.usecase';
import { GetCurrentEnviromentStatusUseCase } from './get-current-environment-status.usecase';
import { CalculateCurrentEnviromentStatusUseCase } from './calculate-current-environment-status.usecase';
import { GetLastHalfHourCurrentEnvironmentStatusUseCase } from './get-last-half-hour-environment-status.usecase';
import { GetLastEnvironmentStatusUseCase } from './get-last-environment-status.usecase';

export abstract class IUseCase<Input, Output> {
  abstract execute(input: Input): Promise<Output>;
}

export abstract class IUseCaseMediator {
  protected eventsMap: Record<string, IUseCase<any, any>> = {};
  public async notify<Input, Output>(
    event: string,
    input: Input,
  ): Promise<Output> {
    if (!this.eventsMap[event])
      throw new ConflictException(
        'The event doesnt exists on mediator eventMap',
      );
    return (await this.eventsMap[event].execute(input)) as Output;
  }
}

export class UseCaseMediator extends IUseCaseMediator {
  constructor(
    listEnviromentStatusUseCase: ListEnviromentStatusUseCase,
    getCurrentEnvironmentStatus: GetCurrentEnviromentStatusUseCase,
    calculateCurrentEnviromentStatusUseCase: CalculateCurrentEnviromentStatusUseCase,
    getLastHalfHourEnvironmentStatusUseCase: GetLastHalfHourCurrentEnvironmentStatusUseCase,
    getLastEnvironmentStatusUseCase: GetLastEnvironmentStatusUseCase,
  ) {
    super();
    this.eventsMap['listEnviromentStatus'] = listEnviromentStatusUseCase;
    this.eventsMap['getCurrentEnvironmentStatus'] = getCurrentEnvironmentStatus;
    this.eventsMap['calculateCurrentEnviromentStatusUseCase'] =
      calculateCurrentEnviromentStatusUseCase;
    this.eventsMap['getLastHalfHourEnvironmentStatusUseCase'] =
      getLastHalfHourEnvironmentStatusUseCase;
    this.eventsMap['getLastEnvironmentStatusUseCase'] =
      getLastEnvironmentStatusUseCase;
  }
}
