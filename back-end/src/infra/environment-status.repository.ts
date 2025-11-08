import { IRealTimeDatabase } from './firebase';

export abstract class IEnviromentStatusRepository {
  abstract list(): Promise<EnviromentStatus[]>;
  abstract getStatusBiggerThan(timestamp: number): Promise<EnviromentStatus[]>;
  abstract setLastFiveMinutesInsights(
    data: Omit<EnviromentStatus, 'timestamp'>,
  ): Promise<void>;

  abstract getFiveMinutesAgoInsights(): Promise<
    Omit<EnviromentStatus, 'timestamp'>
  >;

  abstract getLast(): Promise<EnviromentStatus>;
}

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

export class EnviromentStatusRepository implements IEnviromentStatusRepository {
  constructor(private readonly realTimeDatabase: IRealTimeDatabase) {}
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

  public async setLastFiveMinutesInsights(
    data: Omit<EnviromentStatus, 'timestamp'>,
  ): Promise<void> {
    await this.realTimeDatabase.setData('/media', data);
  }

  public async getFiveMinutesAgoInsights(): Promise<
    Omit<EnviromentStatus, 'timestamp'>
  > {
    return await this.realTimeDatabase.getData('/media');
  }

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
