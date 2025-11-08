import { IUseCase } from './usecase.mediator';
import { EnviromentStatus, IEnviromentStatusRepository } from '../infra';

/**
 * Use case for retrieving the current environment status based on the last 5 minutes average.
 *
 * @class GetCurrentEnviromentStatusUseCase
 * @implements {IUseCase<void, Omit<EnviromentStatus, 'timestamp'>>}
 *
 * @description
 * This use case retrieves pre-calculated environmental insights from the last 5 minutes.
 * The data is averaged and stored periodically by the CalculateCurrentEnviromentStatusUseCase.
 *
 * @example
 * ```typescript
 * const useCase = new GetCurrentEnviromentStatusUseCase(repository);
 * const currentStatus = await useCase.execute();
 * console.log(currentStatus.temperature); // Average temperature from last 5 minutes
 * ```
 */
export class GetCurrentEnviromentStatusUseCase
  implements IUseCase<void, Omit<EnviromentStatus, 'timestamp'>>
{
  /**
   * Creates an instance of GetCurrentEnviromentStatusUseCase.
   *
   * @param {IEnviromentStatusRepository} repository - The repository for accessing environment status data
   */
  constructor(private readonly repository: IEnviromentStatusRepository) {}

  /**
   * Executes the use case to retrieve the current environment status.
   *
   * @returns {Promise<Omit<EnviromentStatus, 'timestamp'>>} The current environment status without timestamp
   */
  async execute(): Promise<Omit<EnviromentStatus, 'timestamp'>> {
    return await this.repository.getFiveMinutesAgoInsights();
  }
}
