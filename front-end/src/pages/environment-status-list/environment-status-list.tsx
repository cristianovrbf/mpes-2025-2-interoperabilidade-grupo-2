import { useEffect, useState } from "react";
import {
  type EnvironmentStatus,
  type IEvironmentGateway,
} from "../../application/environment-status-list.gateway";
import { useInject } from "../../shared/infra/dependency-injection/use-inject";
import "./environment-status-list.css";
import type { IRouter } from "../../shared/infra/router/router.interface";

export const EnvironmentStatusList = () => {
  const envStatusGateway: IEvironmentGateway =
    useInject<IEvironmentGateway>("EnvironmentGateway");
  const router: IRouter = useInject<IRouter>("Router");
  const loadEnvStatusList = async () => {
    const data = await envStatusGateway.list();
    setEnvStatus(data);
  };
  const [envStatus, setEnvStatus] = useState<EnvironmentStatus[]>([]);

  useEffect(() => {
    loadEnvStatusList();
  }, []);

  return (
    <>
      <div>
        <button onClick={() => router.forward("/")}>Voltar à Home</button>
        <h2>Lista de eventos de medição de qualidade do ambiente</h2>
      </div>
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Luminosidade</th>
              <th>Luminosidade Status</th>
              <th>Som</th>
              <th>Som Status</th>
              <th>Temperatura</th>
              <th>Temperatura Status</th>
              <th>Umidade</th>
              <th>Umidade Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {envStatus.map((item: EnvironmentStatus, index) => (
              <tr key={index + new Date().valueOf()}>
                <td>{item.luminosity}</td>
                <td>{item.luminosityStatus}</td>
                <td>{item.sounds}</td>
                <td>{item.soundsStatus}</td>
                <td>{item.temperature}</td>
                <td>{item.temperatureStatus}</td>
                <td>{item.humidity}</td>
                <td>{item.humidityStatus}</td>
                <td>{new Date(item.timestamp).toLocaleString("pt-BR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
