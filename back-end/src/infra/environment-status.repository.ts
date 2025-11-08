import { IRealTimeDatabase } from './firebase';

/**
 * Abstract repository interface for environment status data operations.
 *
 * @abstract
 * @class IEnviromentStatusRepository
 *
 * @description
 * Defines the contract for accessing and manipulating environment status data.
 * Implementations should handle data persistence and retrieval operations.
 */
export abstract class IEnviromentStatusRepository {
  /**
   * Retrieves all environment status records.
   *
   * @returns {Promise<EnviromentStatus[]>} Array of all environment status records
   */
  abstract list(): Promise<EnviromentStatus[]>;

  /**
   * Retrieves environment status records with timestamps greater than the specified value.
   *
   * @param {number} timestamp - The minimum timestamp in milliseconds
   * @returns {Promise<EnviromentStatus[]>} Array of filtered environment status records
   */
  abstract getStatusBiggerThan(timestamp: number): Promise<EnviromentStatus[]>;

  /**
   * Stores the calculated 5-minute average insights.
   *
   * @param {Omit<EnviromentStatus, 'timestamp'>} data - The averaged environment data without timestamp
   * @returns {Promise<void>}
   */
  abstract setLastFiveMinutesInsights(
    data: Omit<EnviromentStatus, 'timestamp'>,
  ): Promise<void>;

  /**
   * Retrieves the pre-calculated 5-minute average insights.
   *
   * @returns {Promise<Omit<EnviromentStatus, 'timestamp'>}> The averaged environment data without timestamp
   */
  abstract getFiveMinutesAgoInsights(): Promise<
    Omit<EnviromentStatus, 'timestamp'>
  >;

  /**
   * Retrieves the most recent environment status record.
   *
   * @returns {Promise<EnviromentStatus>} The latest environment status record
   */
  abstract getLast(): Promise<EnviromentStatus>;
}

/**
 * Represents the environment status data structure used internally in the application.
 *
 * @typedef {Object} EnviromentStatus
 * @property {number} luminosity - Light intensity measurement
 * @property {string} luminosityStatus - Status classification for luminosity (BOM, MODERADO, RUIM)
 * @property {number} sounds - Sound level measurement in decibels
 * @property {string} soundsStatus - Status classification for sound levels (BOM, MODERADO, RUIM)
 * @property {number} temperature - Temperature measurement in Celsius
 * @property {string} temperatureStatus - Status classification for temperature (BOM, MODERADO, RUIM)
 * @property {Date} timestamp - Timestamp when the measurement was taken
 * @property {number} humidity - Humidity percentage measurement
 * @property {string} humidityStatus - Status classification for humidity (BOM, MODERADO, RUIM)
 */
export type EnviromentStatus = {
  luminosity: number;
  luminosityStatus: string;
  sounds: number;
  soundsStatus: string;
  temperature: number;
  temperatureStatus: string;
  timestamp: Date;
  humidity: number;
  humidityStatus: string;
};

/**
 * Represents the environment status data structure as stored in Firebase.
 *
 * @typedef {Object} FirebaseEnviromentStatus
 * @property {number} luminosidade - Light intensity measurement (Portuguese field name)
 * @property {string} qualidade - Overall quality classification
 * @property {number} som - Sound level measurement (Portuguese field name)
 * @property {number} temperatura - Temperature measurement (Portuguese field name)
 * @property {Date} timestamp - Timestamp when the measurement was taken
 * @property {number} umidade - Humidity percentage measurement (Portuguese field name)
 * @property {string} luminosidade_status - Status classification for luminosity
 * @property {string} som_status - Status classification for sound levels
 * @property {string} temperatura_status - Status classification for temperature
 * @property {string} umidade_status - Status classification for humidity
 *
 * @description
 * This type maps to the Firebase Realtime Database structure which uses Portuguese field names.
 * The repository layer transforms this format to the internal EnviromentStatus format.
 */
export type FirebaseEnviromentStatus = {
  luminosidade: number;
  qualidade: string;
  som: number;
  temperatura: number;
  timestamp: Date;
  umidade: number;
  luminosidade_status: string;
  som_status: string;
  temperatura_status: string;
  umidade_status: string;
};

/**
 * Concrete implementation of the environment status repository using Firebase Realtime Database.
 *
 * @class EnviromentStatusRepository
 * @implements {IEnviromentStatusRepository}
 *
 * @description
 * This repository handles all data access operations for environment status records.
 * It acts as a data mapper, transforming between Firebase's Portuguese field names
 * and the application's internal English field names.
 *
 * Firebase paths:
 * - `/ambiente` - Stores all environment measurements
 * - `/media` - Stores calculated 5-minute averages
 *
 * @example
 * ```typescript
 * const repository = new EnviromentStatusRepository(firebaseDatabase);
 * const allStatuses = await repository.list();
 * ```
 */
export class EnviromentStatusRepository implements IEnviromentStatusRepository {
  /**
   * Creates an instance of EnviromentStatusRepository.
   *
   * @param {IRealTimeDatabase} realTimeDatabase - The Firebase Realtime Database instance
   */
  constructor(private readonly realTimeDatabase: IRealTimeDatabase) {}

  /**
   * Retrieves all environment status records from Firebase.
   *
   * @returns {Promise<EnviromentStatus[]>} Array of all environment status records
   *
   * @description
   * Fetches data from the `/ambiente` path in Firebase and transforms
   * Portuguese field names to English for internal use.
   */
  public async list(): Promise<EnviromentStatus[]> {
    const data: FirebaseEnviromentStatus[] =
      await this.realTimeDatabase.getData('/ambiente');
    return (Object.values(data ?? {}) ?? []).map((item) => {
      return {
        luminosity: item.luminosidade,
        sounds: item.som,
        temperature: item.temperatura,
        timestamp: new Date(item.timestamp),
        humidity: item.umidade,
        luminosityStatus: item.luminosidade_status,
        soundsStatus: item.som_status,
        temperatureStatus: item.temperatura_status,
        humidityStatus: item.umidade_status,
      } as EnviromentStatus;
    });
  }

  /**
   * Retrieves environment status records with timestamps greater than the specified value.
   *
   * @param {number} timestamp - The minimum timestamp in milliseconds
   * @returns {Promise<EnviromentStatus[]>} Array of filtered environment status records
   *
   * @description
   * Fetches data from Firebase filtered by timestamp and transforms the results
   * to the internal format. Useful for retrieving recent data within a time window.
   */
  public async getStatusBiggerThan(
    timestamp: number,
  ): Promise<EnviromentStatus[]> {
    const data: FirebaseEnviromentStatus[] =
      await this.realTimeDatabase.getDataBiggerThan('/ambiente', timestamp);
    return (Object.values(data ?? {}) ?? []).map((item) => {
      return {
        luminosity: item.luminosidade,
        sounds: item.som,
        temperature: item.temperatura,
        timestamp: new Date(item.timestamp),
        humidity: item.umidade,
        luminosityStatus: item.luminosidade_status,
        soundsStatus: item.som_status,
        temperatureStatus: item.temperatura_status,
        humidityStatus: item.umidade_status,
      } as EnviromentStatus;
    });
  }

  /**
   * Stores the calculated 5-minute average insights to Firebase.
   *
   * @param {Omit<EnviromentStatus, 'timestamp'>} data - The averaged environment data without timestamp
   * @returns {Promise<void>}
   *
   * @description
   * Saves pre-calculated averages to the `/media` path in Firebase.
   * This data is used for quick retrieval of current status without recalculating.
   */
  public async setLastFiveMinutesInsights(
    data: Omit<EnviromentStatus, 'timestamp'>,
  ): Promise<void> {
    await this.realTimeDatabase.setData('/media', data);
  }

  /**
   * Retrieves the pre-calculated 5-minute average insights from Firebase.
   *
   * @returns {Promise<Omit<EnviromentStatus, 'timestamp'>>} The averaged environment data without timestamp
   *
   * @description
   * Fetches the stored averages from the `/media` path in Firebase.
   * This provides fast access to current environment status based on recent measurements.
   */
  public async getFiveMinutesAgoInsights(): Promise<
    Omit<EnviromentStatus, 'timestamp'>
  > {
    return await this.realTimeDatabase.getData('/media');
  }

  /**
   * Retrieves the most recent environment status record from Firebase.
   *
   * @returns {Promise<EnviromentStatus>} The latest environment status record
   *
   * @description
   * Fetches the last recorded measurement from the `/ambiente` path and
   * transforms it from Firebase format to the internal format.
   */
  public async getLast(): Promise<EnviromentStatus> {
    const item = await this.realTimeDatabase.getLast('/ambiente');

    return {
      luminosity: item.luminosidade,
      sounds: item.som,
      temperature: item.temperatura,
      humidity: item.umidade,
      luminosityStatus: item.luminosidade_status,
      soundsStatus: item.som_status,
      temperatureStatus: item.temperatura_status,
      humidityStatus: item.umidade_status,
    } as EnviromentStatus;
  }
}
