import { IUseCase } from './usecase.mediator';
import { EnviromentStatus, IEnviromentStatusRepository } from '../infra';

export class GetLastEnvironmentStatusUseCase
  implements IUseCase<void, EnviromentStatus>
{
  constructor(private readonly repository: IEnviromentStatusRepository) {}

  async execute(): Promise<EnviromentStatus> {
    return await this.repository.getLast();
  }
}
