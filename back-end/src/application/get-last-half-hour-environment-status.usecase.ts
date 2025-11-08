import { IUseCase } from './usecase.mediator';
import { EnviromentStatus, IEnviromentStatusRepository } from '../infra';

export class GetLastHalfHourCurrentEnvironmentStatusUseCase
  implements IUseCase<void, EnviromentStatus[]>
{
  constructor(private readonly repository: IEnviromentStatusRepository) {}

  async execute(): Promise<EnviromentStatus[]> {
    const timestampFiveMinutesAgo = new Date().valueOf() - 1000 * 60 * 30;
    return await this.repository.getStatusBiggerThan(timestampFiveMinutesAgo);
  }
}
