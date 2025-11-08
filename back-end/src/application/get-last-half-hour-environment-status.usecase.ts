import { IUseCase } from './usecase.mediator';
import { EnviromentStatus, IEnviromentStatusRepository } from '../infra';

/**
 * Use case for retrieving all environment status records from the last 30 minutes.
 *
 * @class GetLastHalfHourCurrentEnvironmentStatusUseCase
 * @implements {IUseCase<void, EnviromentStatus[]>}
 *
 * @description
 * This use case fetches all environment status records that were created within
 * the last 30 minutes. It's useful for displaying recent trends and historical data.
 *
 * @example
 * ```typescript
 * const useCase = new GetLastHalfHourCurrentEnvironmentStatusUseCase(repository);
 * const recentStatuses = await useCase.execute();
 * console.log(`Found ${recentStatuses.length} records from last 30 minutes`);
 * ```
 */
export class GetLastHalfHourCurrentEnvironmentStatusUseCase
  implements IUseCase<void, EnviromentStatus[]>
{
  /**
   * Creates an instance of GetLastHalfHourCurrentEnvironmentStatusUseCase.
   *
   * @param {IEnviromentStatusRepository} repository - The repository for accessing environment status data
   */
  constructor(private readonly repository: IEnviromentStatusRepository) {}

  /**
   * Executes the use case to retrieve environment status records from the last 30 minutes.
   *
   * @returns {Promise<EnviromentStatus[]>} Array of environment status records from the last half hour
   */
  async execute(): Promise<EnviromentStatus[]> {
    const timestampFiveMinutesAgo = new Date().valueOf() - 1000 * 60 * 30;
    return await this.repository.getStatusBiggerThan(timestampFiveMinutesAgo);
  }
}
