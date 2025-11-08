import { Controller, Get } from '@nestjs/common';
import { IUseCaseMediator } from '../application';

/**
 * Main application controller for environment status API endpoints.
 *
 * @class AppController
 *
 * @description
 * Provides REST API endpoints for retrieving environment monitoring data.
 * All endpoints use the mediator pattern to delegate business logic to use cases.
 *
 * Base path: `/`
 *
 * Available endpoints:
 * - GET `/environment-status-list` - List all environment status records
 * - GET `/current-environment-status` - Get current 5-minute averaged status
 * - GET `/half-hour-environment-status` - Get last 30 minutes of data
 * - GET `/last-environment-status` - Get the most recent record
 */
@Controller()
export class AppController {
  /**
   * Creates an instance of AppController.
   *
   * @param {IUseCaseMediator} mediator - The use case mediator for executing business logic
   */
  constructor(private readonly mediator: IUseCaseMediator) {}

  /**
   * Retrieves all environment status records.
   *
   * @returns {Promise<any>} Array of all environment status records
   *
   * @description
   * GET endpoint that returns the complete list of environment measurements
   * from the database without any filtering.
   *
   * @example
   * GET /environment-status-list
   * Response: [{ luminosity: 500, temperature: 25, ... }, ...]
   */
  @Get('/environment-status-list')
  async getFirebaseData(): Promise<any> {
    return await this.mediator.notify('listEnviromentStatus', {});
  }

  /**
   * Retrieves the current environment status based on 5-minute averages.
   *
   * @returns {Promise<any>} The current averaged environment status
   *
   * @description
   * GET endpoint that returns pre-calculated environmental metrics averaged
   * over the last 5 minutes. This provides a snapshot of current conditions.
   *
   * @example
   * GET /current-environment-status
   * Response: { luminosity: 485, temperature: 24.5, ... }
   */
  @Get('/current-environment-status')
  getCurrentEnvironment(): any {
    return this.mediator.notify('getCurrentEnvironmentStatus', {});
  }

  /**
   * Retrieves environment status records from the last 30 minutes.
   *
   * @returns {Promise<any>} Array of environment status records from last half hour
   *
   * @description
   * GET endpoint that returns all measurements taken within the last 30 minutes.
   * Useful for displaying recent trends and historical data.
   *
   * @example
   * GET /half-hour-environment-status
   * Response: [{ luminosity: 500, temperature: 25, timestamp: ... }, ...]
   */
  @Get('/half-hour-environment-status')
  getLastHalfHourEnvironmentStatus(): any {
    return this.mediator.notify('getLastHalfHourEnvironmentStatusUseCase', {});
  }

  /**
   * Retrieves the most recent environment status record.
   *
   * @returns {Promise<any>} The latest environment status measurement
   *
   * @description
   * GET endpoint that returns the last recorded environment measurement
   * including all sensor readings and their status classifications.
   *
   * @example
   * GET /last-environment-status
   * Response: { luminosity: 490, temperature: 25.2, timestamp: ..., ... }
   */
  @Get('/last-environment-status')
  getLastEnvironmentStatus(): any {
    return this.mediator.notify('getLastEnvironmentStatusUseCase', {});
  }
}
