import type { IHttpClient } from "../shared/infra/http/http-client";
import { Registry } from "../shared/infra/dependency-injection/registry";

/**
 * Interface for the environment status gateway.
 *
 * @interface IEvironmentGateway
 *
 * @description
 * Defines the contract for accessing environment status data from external sources.
 * Implementations can use different data sources (HTTP API, in-memory, etc.).
 */
export interface IEvironmentGateway {
  /**
   * Retrieves all environment status records.
   *
   * @returns {Promise<EnvironmentStatus[]>} Array of all environment status records
   */
  list(): Promise<EnvironmentStatus[]>;

  /**
   * Retrieves the current environment status (5-minute average).
   *
   * @returns {Promise<EnvironmentStatus>} The current averaged environment status
   */
  getCurrent(): Promise<EnvironmentStatus>;

  /**
   * Retrieves environment status records from the last 30 minutes.
   *
   * @returns {Promise<EnvironmentStatus[]>} Array of recent environment status records
   */
  getLastHalfHour(): Promise<EnvironmentStatus[]>;

  /**
   * Retrieves the most recent environment status record.
   *
   * @returns {Promise<EnvironmentStatus>} The latest environment status measurement
   */
  getLast(): Promise<EnvironmentStatus>;
}

/**
 * HTTP-based implementation of the environment status gateway.
 *
 * @class HttpEvironmentGateway
 * @implements {IEvironmentGateway}
 *
 * @description
 * Fetches environment status data from a backend API using HTTP requests.
 * Uses dependency injection via Registry to obtain the HTTP client instance.
 *
 * @example
 * ```typescript
 * const gateway = new HttpEvironmentGateway();
 * const statuses = await gateway.list();
 * ```
 */
export class HttpEvironmentGateway implements IEvironmentGateway {
  /**
   * HTTP client injected via Registry for making API requests.
   *
   * @private
   * @readonly
   * @type {IHttpClient}
   */
  private readonly httpClient: IHttpClient =
    Registry.getInstance().inject("HttpClient");

  /**
   * Retrieves all environment status records from the API.
   *
   * @returns {Promise<EnvironmentStatus[]>} Array of all environment status records
   *
   * @description
   * Makes a GET request to `/environment-status-list` endpoint.
   */
  public async list(): Promise<EnvironmentStatus[]> {
    const data = await this.httpClient.get<EnvironmentStatus[]>(
      "/environment-status-list"
    );
    return data as EnvironmentStatus[];
  }

  /**
   * Retrieves the current environment status (5-minute average) from the API.
   *
   * @returns {Promise<EnvironmentStatus>} The current averaged environment status
   *
   * @description
   * Makes a GET request to `/current-environment-status` endpoint.
   */
  async getCurrent(): Promise<EnvironmentStatus> {
    const data = await this.httpClient.get<EnvironmentStatus>(
      "/current-environment-status"
    );
    return data as EnvironmentStatus;
  }

  /**
   * Retrieves environment status records from the last 30 minutes from the API.
   *
   * @returns {Promise<EnvironmentStatus[]>} Array of recent environment status records
   *
   * @description
   * Makes a GET request to `/half-hour-environment-status` endpoint.
   */
  async getLastHalfHour(): Promise<EnvironmentStatus[]> {
    const data = await this.httpClient.get<EnvironmentStatus[]>(
      "/half-hour-environment-status"
    );
    return data as EnvironmentStatus[];
  }

  /**
   * Retrieves the most recent environment status record from the API.
   *
   * @returns {Promise<EnvironmentStatus>} The latest environment status measurement
   *
   * @description
   * Makes a GET request to `/last-environment-status` endpoint.
   */
  async getLast(): Promise<EnvironmentStatus> {
    const data = await this.httpClient.get<EnvironmentStatus>(
      "/last-environment-status"
    );
    return data as EnvironmentStatus;
  }
}

/**
 * In-memory implementation of the environment status gateway for testing and development.
 *
 * @class InMemoryEvironmentGateway
 * @implements {IEvironmentGateway}
 *
 * @description
 * Returns hardcoded mock data for environment status queries.
 * Useful for testing, development, and demonstrations without a live backend.
 *
 * @example
 * ```typescript
 * const gateway = new InMemoryEvironmentGateway();
 * const mockStatuses = await gateway.list();
 * ```
 */
export class InMemoryEvironmentGateway implements IEvironmentGateway {
  /**
   * Retrieves mock environment status records.
   *
   * @returns {Promise<EnvironmentStatus[]>} Array of mock environment status records
   *
   * @description
   * Returns two hardcoded environment status records with "BOM" (good) status for all metrics.
   */
  public async list(): Promise<EnvironmentStatus[]> {
    return Promise.resolve([
      {
        luminosity: 35,
        sounds: 1644,
        temperature: 23.18489,
        timestamp: new Date("1970-01-01T00:20:09.345Z"),
        humidity: 64.755,
        luminosityStatus: "BOM",
        soundsStatus: "BOM",
        temperatureStatus: "BOM",
        humidityStatus: "BOM",
      },
      {
        luminosity: 48,
        sounds: 1677,
        temperature: 23.05619,
        timestamp: new Date("1970-01-01T00:20:24.811Z"),
        humidity: 64.94574,
        luminosityStatus: "BOM",
        soundsStatus: "BOM",
        temperatureStatus: "BOM",
        humidityStatus: "BOM",
      },
    ]);
  }

  /**
   * Retrieves mock environment status records for the last half hour.
   *
   * @returns {Promise<EnvironmentStatus[]>} Array of mock recent environment status records
   *
   * @description
   * Returns the same mock data as list() for testing purposes.
   */
  public async getLastHalfHour(): Promise<EnvironmentStatus[]> {
    return Promise.resolve([
      {
        luminosity: 35,
        sounds: 1644,
        temperature: 23.18489,
        timestamp: new Date("1970-01-01T00:20:09.345Z"),
        humidity: 64.755,
        luminosityStatus: "BOM",
        soundsStatus: "BOM",
        temperatureStatus: "BOM",
        humidityStatus: "BOM",
      },
      {
        luminosity: 48,
        sounds: 1677,
        temperature: 23.05619,
        timestamp: new Date("1970-01-01T00:20:24.811Z"),
        humidity: 64.94574,
        luminosityStatus: "BOM",
        soundsStatus: "BOM",
        temperatureStatus: "BOM",
        humidityStatus: "BOM",
      },
    ]);
  }

  /**
   * Retrieves a mock current environment status.
   *
   * @returns {Promise<EnvironmentStatus>} Mock current environment status
   *
   * @description
   * Returns a single hardcoded environment status record.
   */
  async getCurrent(): Promise<EnvironmentStatus> {
    return Promise.resolve({
      luminosity: 35,
      sounds: 1644,
      temperature: 23.18489,
      timestamp: new Date("1970-01-01T00:20:09.345Z"),
      humidity: 64.755,
      luminosityStatus: "BOM",
      soundsStatus: "BOM",
      temperatureStatus: "BOM",
      humidityStatus: "BOM",
    });
  }

  /**
   * Retrieves a mock of the most recent environment status.
   *
   * @returns {Promise<EnvironmentStatus>} Mock latest environment status
   *
   * @description
   * Returns a single hardcoded environment status record.
   */
  async getLast(): Promise<EnvironmentStatus> {
    return Promise.resolve({
      luminosity: 35,
      sounds: 1644,
      temperature: 23.18489,
      timestamp: new Date("1970-01-01T00:20:09.345Z"),
      humidity: 64.755,
      luminosityStatus: "BOM",
      soundsStatus: "BOM",
      temperatureStatus: "BOM",
      humidityStatus: "BOM",
    });
  }
}
/**
 * Represents the environment status data structure.
 *
 * @typedef {Object} EnvironmentStatus
 * @property {number} luminosity - Light intensity measurement
 * @property {number} sounds - Sound level measurement in decibels
 * @property {number} temperature - Temperature measurement in Celsius
 * @property {Date} timestamp - Timestamp when the measurement was taken
 * @property {number} humidity - Humidity percentage measurement
 * @property {string} luminosityStatus - Status classification for luminosity (BOM, MODERADO, RUIM)
 * @property {string} soundsStatus - Status classification for sound levels (BOM, MODERADO, RUIM)
 * @property {string} temperatureStatus - Status classification for temperature (BOM, MODERADO, RUIM)
 * @property {string} humidityStatus - Status classification for humidity (BOM, MODERADO, RUIM)
 */
export type EnvironmentStatus = {
  luminosity: number;
  sounds: number;
  temperature: number;
  timestamp: Date;
  humidity: number;
  luminosityStatus: string;
  soundsStatus: string;
  temperatureStatus: string;
  humidityStatus: string;
};
