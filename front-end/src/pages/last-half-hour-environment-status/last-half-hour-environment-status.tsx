import { useEffect, useState } from "react";
import {
  type EnvironmentStatus,
  type IEvironmentGateway,
} from "../../application/environment-status-list.gateway";
import { useInject } from "../../shared/infra/dependency-injection/use-inject";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./last-half-hour-environment-status.css";
import type { IRouter } from "../../shared/infra/router/router.interface";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const LastHalfHourEnvironmentStatus = () => {
  const envStatusGateway: IEvironmentGateway =
    useInject<IEvironmentGateway>("EnvironmentGateway");
  const router: IRouter = useInject<IRouter>("Router");

  const [envStatus, setEnvStatus] = useState<EnvironmentStatus[]>([]);
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

  const loadLastHalfHourEnvStatusList = async () => {
    const data = await envStatusGateway.getLastHalfHour();
    setEnvStatus(data);
  };

  const loadCurrentEnvStatus = async () => {
    const data = await envStatusGateway.getLast();
    setCurrentEnvStatus(data);
  };

  useEffect(() => {
    loadLastHalfHourEnvStatusList();
    loadCurrentEnvStatus();

    const interval = setInterval(() => {
      loadCurrentEnvStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Preparar dados para os gráficos
  const labels = envStatus.map((status) =>
    new Date(status.timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );

  const humidityData = {
    labels,
    datasets: [
      {
        label: "Umidade (%)",
        data: envStatus.map((status) => status.humidity),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const temperatureData = {
    labels,
    datasets: [
      {
        label: "Temperatura (°C)",
        data: envStatus.map((status) => status.temperature),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const luminosityData = {
    labels,
    datasets: [
      {
        label: "Luminosidade (lux)",
        data: envStatus.map((status) => status.luminosity),
        borderColor: "rgb(255, 206, 86)",
        backgroundColor: "rgba(255, 206, 86, 0.5)",
      },
    ],
  };

  const soundData = {
    labels,
    datasets: [
      {
        label: "Som (dB)",
        data: envStatus.map((status) => status.sounds),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <>
      <div>
        <button onClick={() => router.forward("/")}>Voltar à Home</button>
        <h2>Último status do ambiente recebido</h2>
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

      <div>
        <h2>Status do Ambiente - Últimos 30 Minutos</h2>
      </div>

      <div className="dashboard-row">
        <div>
          <h3>Umidade</h3>
          <Line options={options} data={humidityData} />
        </div>

        <div>
          <h3>Temperatura</h3>
          <Line options={options} data={temperatureData} />
        </div>
      </div>
      <div className="dashboard-row">
        <div>
          <h3>Luminosidade</h3>
          <Line options={options} data={luminosityData} />
        </div>

        <div>
          <h3>Som</h3>
          <Line options={options} data={soundData} />
        </div>
      </div>
    </>
  );
};
