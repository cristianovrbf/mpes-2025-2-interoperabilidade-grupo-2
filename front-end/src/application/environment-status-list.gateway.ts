import type { IHttpClient } from "../shared/infra/http/http-client";
import { Registry } from "../shared/infra/dependency-injection/registry";

export interface IEvironmentGateway {
  list(): Promise<EnvironmentStatus[]>;
  getCurrent(): Promise<EnvironmentStatus>;
  getLastHalfHour(): Promise<EnvironmentStatus[]>;
  getLast(): Promise<EnvironmentStatus>;
}

export class HttpEvironmentGateway implements IEvironmentGateway {
  /**
   * Cliente HTTP injetado via Registry para realizar requisições à API
   * @private
   * @readonly
   */
  private readonly httpClient: IHttpClient =
    Registry.getInstance().inject("HttpClient");

  public async list(): Promise<EnvironmentStatus[]> {
    const data = await this.httpClient.get<EnvironmentStatus[]>(
      "/environment-status-list"
    );
    return data as EnvironmentStatus[];
  }

  async getCurrent(): Promise<EnvironmentStatus> {
    const data = await this.httpClient.get<EnvironmentStatus>(
      "/current-environment-status"
    );
    return data as EnvironmentStatus;
  }

  async getLastHalfHour(): Promise<EnvironmentStatus[]> {
    const data = await this.httpClient.get<EnvironmentStatus[]>(
      "/half-hour-environment-status"
    );
    return data as EnvironmentStatus[];
  }

  async getLast(): Promise<EnvironmentStatus> {
    const data = await this.httpClient.get<EnvironmentStatus>(
      "/last-environment-status"
    );
    return data as EnvironmentStatus;
  }
}

export class InMemoryEvironmentGateway implements IEvironmentGateway {
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
