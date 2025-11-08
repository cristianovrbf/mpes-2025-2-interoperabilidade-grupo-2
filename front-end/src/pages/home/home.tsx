import { useInject } from "../../shared/infra/dependency-injection/use-inject";
import type { IRouter } from "../../shared/infra/router/router.interface";
import "./home.css";

export const Home = () => {
  const router: IRouter = useInject<IRouter>("Router");

  const goToEnvironmentStatusList = () => {
    router.forward("/environment-status-list");
  };

  const goToCurrentEnvironmentStatus = () => {
    router.forward("/current-environment-status");
  };

  const goToDashboard = () => {
    router.forward("/last-half-hour-environment-status");
  };

  return (
    <>
      <div className="home">
        <h2>Medidor de qualidade de ambiente</h2>
        <p>Grupo 2</p>
      </div>
      <div className="home-buttons">
        <button onClick={goToEnvironmentStatusList}>Lista de eventos</button>
        <button onClick={goToCurrentEnvironmentStatus}>
          Status nos últimos 5 minutos
        </button>
        <button onClick={goToDashboard}>Dashboard</button>
      </div>
    </>
  );
};
