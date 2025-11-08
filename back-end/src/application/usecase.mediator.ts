import { ConflictException } from '@nestjs/common';
import { ListEnviromentStatusUseCase } from './list-environment-status.usecase';
import { GetCurrentEnviromentStatusUseCase } from './get-current-environment-status.usecase';
import { CalculateCurrentEnviromentStatusUseCase } from './calculate-current-environment-status.usecase';
import { GetLastHalfHourCurrentEnvironmentStatusUseCase } from './get-last-half-hour-environment-status.usecase';
import { GetLastEnvironmentStatusUseCase } from './get-last-environment-status.usecase';

/**
 * Base interface for all use cases in the application.
 *
 * @abstract
 * @class IUseCase
 * @template Input - The input type for the use case
 * @template Output - The output type returned by the use case
 *
 * @description
 * This interface defines the contract that all use cases must follow.
 * Each use case must implement an execute method that takes an input and returns a promise of the output.
 *
 * @example
 * ```typescript
 * class MyUseCase implements IUseCase<MyInput, MyOutput> {
 *   async execute(input: MyInput): Promise<MyOutput> {
 *     // Implementation
 *   }
 * }
 * ```
 */
export abstract class IUseCase<Input, Output> {
  /**
   * Executes the use case logic.
   *
   * @param {Input} input - The input data for the use case
   * @returns {Promise<Output>} A promise that resolves to the output of the use case
   */
  abstract execute(input: Input): Promise<Output>;
}

/**
 * Abstract base class for the use case mediator pattern implementation.
 *
 * @abstract
 * @class IUseCaseMediator
 *
 * @description
 * The mediator pattern centralizes use case execution by maintaining a registry
 * of use cases and routing execution requests to the appropriate use case based on
 * event names. This promotes loose coupling between controllers and use cases.
 *
 * @example
 * ```typescript
 * class MyMediator extends IUseCaseMediator {
 *   constructor(myUseCase: MyUseCase) {
 *     super();
 *     this.eventsMap['myEvent'] = myUseCase;
 *   }
 * }
 *
 * const result = await mediator.notify('myEvent', inputData);
 * ```
 */
export abstract class IUseCaseMediator {
  /**
   * Registry mapping event names to their corresponding use case implementations.
   *
   * @protected
   * @type {Record<string, IUseCase<any, any>>}
   */
  protected eventsMap: Record<string, IUseCase<any, any>> = {};

  /**
   * Notifies and executes the use case associated with the given event.
   *
   * @template Input - The input type for the use case
   * @template Output - The output type returned by the use case
   * @param {string} event - The event name identifying which use case to execute
   * @param {Input} input - The input data to pass to the use case
   * @returns {Promise<Output>} A promise that resolves to the use case output
   * @throws {ConflictException} When the event name is not registered in the eventsMap
   */
  public async notify<Input, Output>(
    event: string,
    input: Input,
  ): Promise<Output> {
    if (!this.eventsMap[event])
      throw new ConflictException(
        'The event doesnt exists on mediator eventMap',
      );
    return (await this.eventsMap[event].execute(input)) as Output;
  }
}

/**
 * Concrete implementation of the use case mediator for environment status operations.
 *
 * @class UseCaseMediator
 * @extends {IUseCaseMediator}
 *
 * @description
 * This mediator manages all environment status-related use cases and provides
 * a centralized access point for executing them through event names.
 *
 * Available events:
 * - `listEnviromentStatus` - Lists all environment status records
 * - `getCurrentEnvironmentStatus` - Gets current 5-minute averaged status
 * - `calculateCurrentEnviromentStatusUseCase` - Calculates 5-minute averages
 * - `getLastHalfHourEnvironmentStatusUseCase` - Gets last 30 minutes of data
 * - `getLastEnvironmentStatusUseCase` - Gets the most recent record
 *
 * @example
 * ```typescript
 * const mediator = new UseCaseMediator(
 *   listUseCase,
 *   getCurrentUseCase,
 *   calculateUseCase,
 *   getLastHalfHourUseCase,
 *   getLastUseCase
 * );
 *
 * const currentStatus = await mediator.notify('getCurrentEnvironmentStatus', null);
 * ```
 */
export class UseCaseMediator extends IUseCaseMediator {
  /**
   * Creates an instance of UseCaseMediator and registers all use cases.
   *
   * @param {ListEnviromentStatusUseCase} listEnviromentStatusUseCase - Use case for listing all status records
   * @param {GetCurrentEnviromentStatusUseCase} getCurrentEnvironmentStatus - Use case for getting current averaged status
   * @param {CalculateCurrentEnviromentStatusUseCase} calculateCurrentEnviromentStatusUseCase - Use case for calculating averages
   * @param {GetLastHalfHourCurrentEnvironmentStatusUseCase} getLastHalfHourEnvironmentStatusUseCase - Use case for getting last 30 minutes data
   * @param {GetLastEnvironmentStatusUseCase} getLastEnvironmentStatusUseCase - Use case for getting the most recent record
   */
  constructor(
    listEnviromentStatusUseCase: ListEnviromentStatusUseCase,
    getCurrentEnvironmentStatus: GetCurrentEnviromentStatusUseCase,
    calculateCurrentEnviromentStatusUseCase: CalculateCurrentEnviromentStatusUseCase,
    getLastHalfHourEnvironmentStatusUseCase: GetLastHalfHourCurrentEnvironmentStatusUseCase,
    getLastEnvironmentStatusUseCase: GetLastEnvironmentStatusUseCase,
  ) {
    super();
    this.eventsMap['listEnviromentStatus'] = listEnviromentStatusUseCase;
    this.eventsMap['getCurrentEnvironmentStatus'] = getCurrentEnvironmentStatus;
    this.eventsMap['calculateCurrentEnviromentStatusUseCase'] =
      calculateCurrentEnviromentStatusUseCase;
    this.eventsMap['getLastHalfHourEnvironmentStatusUseCase'] =
      getLastHalfHourEnvironmentStatusUseCase;
    this.eventsMap['getLastEnvironmentStatusUseCase'] =
      getLastEnvironmentStatusUseCase;
  }
}
