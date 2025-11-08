import { IUseCase } from './usecase.mediator';
import { EnviromentStatus, IEnviromentStatusRepository } from '../infra';

/**
 * Use case for listing all environment status records.
 *
 * @class ListEnviromentStatusUseCase
 * @implements {IUseCase<void, Output>}
 *
 * @description
 * This use case retrieves all environment status records from the repository.
 * It returns a complete list of all measurements without any filtering or time constraints.
 *
 * @example
 * ```typescript
 * const useCase = new ListEnviromentStatusUseCase(repository);
 * const allStatuses = await useCase.execute();
 * console.log(`Total records: ${allStatuses.length}`);
 * ```
 */
export class ListEnviromentStatusUseCase implements IUseCase<void, Output> {
  /**
   * Creates an instance of ListEnviromentStatusUseCase.
   *
   * @param {IEnviromentStatusRepository} repository - The repository for accessing environment status data
   */
  constructor(private readonly repository: IEnviromentStatusRepository) {}

  /**
   * Executes the use case to retrieve all environment status records.
   *
   * @returns {Promise<Output>} Array containing all environment status records
   */
  async execute(): Promise<Output> {
    return await this.repository.list();
  }
}

/**
 * Output type representing an array of environment status records.
 *
 * @typedef {EnviromentStatus[]} Output
 */
type Output = EnviromentStatus[];
