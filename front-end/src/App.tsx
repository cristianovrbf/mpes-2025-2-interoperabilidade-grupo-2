import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EnvironmentStatusList } from "./pages/environment-status-list/environment-status-list";
import { Home } from "./pages/home/home";
import { CurrentEnvironmentStatus } from "./pages/current-environment-status/current-environment-status";
import { LastHalfHourEnvironmentStatus } from "./pages/last-half-hour-environment-status/last-half-hour-environment-status";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/environment-status-list"
          element={<EnvironmentStatusList />}
        />
        <Route
          path="/current-environment-status"
          element={<CurrentEnvironmentStatus />}
        />
        <Route
          path="/last-half-hour-environment-status"
          element={<LastHalfHourEnvironmentStatus />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
