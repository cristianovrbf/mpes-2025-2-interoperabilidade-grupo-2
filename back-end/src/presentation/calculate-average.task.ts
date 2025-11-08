import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { IUseCaseMediator } from '../application/usecase.mediator';

/**
 * Scheduled task for calculating environment status averages.
 *
 * @class CalculateAverageTask
 *
 * @description
 * This service runs a periodic background task that calculates 5-minute averages
 * of all environment metrics (luminosity, temperature, humidity, sound levels).
 * The task executes every 10 seconds using NestJS's scheduling system.
 *
 * The calculated averages are stored in Firebase and made available through
 * the `/current-environment-status` endpoint for quick retrieval.
 *
 * @example
 * ```typescript
 * // This task is automatically registered and executed by NestJS
 * // No manual instantiation required
 * ```
 */
@Injectable()
export class CalculateAverageTask {
  /**
   * Creates an instance of CalculateAverageTask.
   *
   * @param {IUseCaseMediator} mediator - The use case mediator for executing business logic
   */
  constructor(private readonly mediator: IUseCaseMediator) {}

  /**
   * Executes the periodic calculation of environment status averages.
   *
   * @returns {Promise<void>}
   *
   * @description
   * This method runs every 10 seconds (10000ms) and calculates the average
   * of all environment metrics from the last 5 minutes. The averaged data
   * is stored in Firebase at the `/media` path.
   *
   * Process:
   * 1. Fetches all records from the last 5 minutes
   * 2. Calculates averages for all metrics
   * 3. Converts status values to classifications (BOM, MODERADO, RUIM)
   * 4. Stores the result for quick API access
   *
   * @interval 10000ms (10 seconds)
   */
  @Interval(10000)
  async handleCron() {
    console.log('STARTING CRON');
    await this.mediator.notify('calculateCurrentEnviromentStatusUseCase', {});
    console.log('ENDING CRON');
  }
}
