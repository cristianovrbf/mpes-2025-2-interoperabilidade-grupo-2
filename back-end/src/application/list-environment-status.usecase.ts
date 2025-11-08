import { IUseCase } from './usecase.mediator';
import { EnviromentStatus, IEnviromentStatusRepository } from '../infra';

export class ListEnviromentStatusUseCase implements IUseCase<void, Output> {
  constructor(private readonly repository: IEnviromentStatusRepository) {}

  async execute(): Promise<Output> {
    return await this.repository.list();
  }
}

type Output = EnviromentStatus[];
