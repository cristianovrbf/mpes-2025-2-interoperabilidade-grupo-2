import { IUseCase } from './usecase.mediator';
import { EnviromentStatus, IEnviromentStatusRepository } from '../infra';

/**
 * Use case for calculating and storing the average environment status from the last 5 minutes.
 *
 * @class CalculateCurrentEnviromentStatusUseCase
 * @implements {IUseCase<void, void>}
 *
 * @description
 * This use case performs periodic calculations to aggregate environment status data from the last 5 minutes.
 * It computes the average values for all metrics (luminosity, sounds, temperature, humidity) and their
 * corresponding status classifications. The calculated averages are then stored for quick retrieval by
 * the GetCurrentEnviromentStatusUseCase.
 *
 * The status values are converted to numeric representations for averaging, then converted back to their
 * string classifications (BOM, MODERADO, RUIM).
 *
 * @example
 * ```typescript
 * const useCase = new CalculateCurrentEnviromentStatusUseCase(repository);
 * await useCase.execute(); // Calculates and stores 5-minute averages
 * ```
 */
export class CalculateCurrentEnviromentStatusUseCase
  implements IUseCase<void, void>
{
  /**
   * Creates an instance of CalculateCurrentEnviromentStatusUseCase.
   *
   * @param {IEnviromentStatusRepository} repository - The repository for accessing and storing environment status data
   */
  constructor(private readonly repository: IEnviromentStatusRepository) {}

  /**
   * Executes the calculation of average environment status for the last 5 minutes.
   *
   * @description
   * 1. Retrieves all records from the last 5 minutes
   * 2. Calculates averages for all numeric metrics
   * 3. Converts status values to numeric form for averaging
   * 4. Converts averaged status values back to string classifications
   * 5. Stores the calculated averages for later retrieval
   *
   * @returns {Promise<void>}
   */
  async execute(): Promise<void> {
    const timestampFiveMinutesAgo = new Date().valueOf() - 1000 * 60 * 5;
    const data = await this.repository.getStatusBiggerThan(
      timestampFiveMinutesAgo,
    );
    const average = {
      luminosity: 0,
      sounds: 0,
      temperature: 0,
      humidity: 0,
      luminosityStatus: 0,
      soundsStatus: 0,
      temperatureStatus: 0,
      humidityStatus: 0,
    };

    for (const record of data) {
      average.luminosity += record.luminosity;
      average.sounds += record.sounds;
      average.temperature += record.temperature;
      average.humidity += record.humidity;
      average.luminosityStatus += statusValues[record.luminosityStatus];
      average.soundsStatus += statusValues[record.soundsStatus];
      average.temperatureStatus += statusValues[record.temperatureStatus];
      average.humidityStatus += statusValues[record.humidityStatus];
    }

    const lastFiveMinutes = {
      luminosity: average.luminosity / data?.length,
      sounds: average.sounds / data?.length,
      temperature: average.temperature / data?.length,
      humidity: average.humidity / data?.length,
      luminosityStatus: status[average.luminosityStatus / data?.length],
      soundsStatus: status[average.soundsStatus / data?.length],
      temperatureStatus: status[average.temperatureStatus / data?.length],
      humidityStatus: status[average.humidityStatus / data?.length],
    } as Omit<EnviromentStatus, 'timestamp'>;

    await this.repository.setLastFiveMinutesInsights(lastFiveMinutes);
  }
}

/**
 * Mapping of status string values to numeric values for averaging calculations.
 *
 * @constant {Record<string, number>}
 * @property {number} BOM - Good status (value: 3)
 * @property {number} MODERADO - Moderate status (value: 2)
 * @property {number} RUIM - Bad status (value: 1)
 */
const statusValues: Record<string, number> = {
  BOM: 3,
  MODERADO: 2,
  RUIM: 1,
};

/**
 * Mapping of numeric values back to status string classifications.
 *
 * @constant {Record<number, string>}
 * @property {string} 3 - BOM (Good)
 * @property {string} 2 - MODERADO (Moderate)
 * @property {string} 1 - RUIM (Bad)
 */
const status: Record<number, string> = {
  3: 'BOM',
  2: 'MODERADO',
  1: 'RUIM',
};
