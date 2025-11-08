import { IUseCase } from './usecase.mediator';
import { EnviromentStatus, IEnviromentStatusRepository } from '../infra';

export class GetCurrentEnviromentStatusUseCase
  implements IUseCase<void, Omit<EnviromentStatus, 'timestamp'>>
{
  constructor(private readonly repository: IEnviromentStatusRepository) {}

  async execute(): Promise<Omit<EnviromentStatus, 'timestamp'>> {
    return await this.repository.getFiveMinutesAgoInsights();
  }
}
