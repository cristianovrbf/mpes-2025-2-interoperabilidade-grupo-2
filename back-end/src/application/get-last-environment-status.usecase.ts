import { IUseCase } from './usecase.mediator';
import { EnviromentStatus, IEnviromentStatusRepository } from '../infra';

/**
 * Use case for retrieving the most recent environment status record.
 *
 * @class GetLastEnvironmentStatusUseCase
 * @implements {IUseCase<void, EnviromentStatus>}
 *
 * @description
 * This use case fetches the last recorded environment status from the repository.
 * It returns the most recent raw measurement including timestamp.
 *
 * @example
 * ```typescript
 * const useCase = new GetLastEnvironmentStatusUseCase(repository);
 * const lastStatus = await useCase.execute();
 * console.log(lastStatus.timestamp); // Timestamp of last measurement
 * ```
 */
export class GetLastEnvironmentStatusUseCase
  implements IUseCase<void, EnviromentStatus>
{
  /**
   * Creates an instance of GetLastEnvironmentStatusUseCase.
   *
   * @param {IEnviromentStatusRepository} repository - The repository for accessing environment status data
   */
  constructor(private readonly repository: IEnviromentStatusRepository) {}

  /**
   * Executes the use case to retrieve the last environment status record.
   *
   * @returns {Promise<EnviromentStatus>} The most recent environment status with timestamp
   */
  async execute(): Promise<EnviromentStatus> {
    return await this.repository.getLast();
  }
}
