import { IUseCase } from './usecase.mediator';
import { EnviromentStatus, IEnviromentStatusRepository } from '../infra';

export class CalculateCurrentEnviromentStatusUseCase
  implements IUseCase<void, void>
{
  constructor(private readonly repository: IEnviromentStatusRepository) {}

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

const statusValues: Record<string, number> = {
  BOM: 3,
  MODERADO: 2,
  RUIM: 1,
};

const status: Record<number, string> = {
  3: 'BOM',
  2: 'MODERADO',
  1: 'RUIM',
};
