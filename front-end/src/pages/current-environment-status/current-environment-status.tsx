import { useEffect, useState } from "react";
import {
  type EnvironmentStatus,
  type IEvironmentGateway,
} from "../../application/environment-status-list.gateway";
import "./current-environment-status.css";
import { useInject } from "../../shared/infra/dependency-injection/use-inject";
import type { IRouter } from "../../shared/infra/router/router.interface";

export const CurrentEnvironmentStatus = () => {
  const envStatusGateway: IEvironmentGateway =
    useInject<IEvironmentGateway>("EnvironmentGateway");
  const router: IRouter = useInject<IRouter>("Router");
  const loadEnvStatusList = async () => {
    const data = await envStatusGateway.getCurrent();
    setCurrentEnvStatus(data);
  };
  const [currentEnvStatus, setCurrentEnvStatus] = useState<EnvironmentStatus>({
    luminosity: 0,
    sounds: 0,
    temperature: 0,
    timestamp: new Date(),
    humidity: 0,
    luminosityStatus: "",
    soundsStatus: "",
    temperatureStatus: "",
    humidityStatus: "",
  });

  useEffect(() => {
    loadEnvStatusList();
  }, []);

  return (
    <>
      <div>
        <button onClick={() => router.forward("/")}>Voltar à Home</button>
        <h2>
          Status de medição de qualidade do ambiente nos últimos 5 minutos
        </h2>
      </div>
      <div className="current-status">
        <div className="status-card">
          <label>
            Luminosidade
            <p>{currentEnvStatus.luminosity}</p>
          </label>
          <label>
            Luminosidade Status
            <p>{currentEnvStatus.luminosityStatus}</p>
          </label>
        </div>
        <div className="status-card">
          <label>
            Som
            <p>{currentEnvStatus.sounds}</p>
          </label>
          <label>
            Som Status
            <p>{currentEnvStatus.soundsStatus}</p>
          </label>
        </div>
        <div className="status-card">
          <label>
            Temperatura
            <p>{currentEnvStatus.temperature}</p>
          </label>
          <label>
            Temperatura Status
            <p>{currentEnvStatus.temperatureStatus}</p>
          </label>
        </div>
        <div className="status-card">
          <label>
            Umidade
            <p>{currentEnvStatus.humidity}</p>
          </label>
          <label>
            Umidade Status
            <p>{currentEnvStatus.humidityStatus}</p>
          </label>
        </div>
      </div>
    </>
  );
};
