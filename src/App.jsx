// src/App.jsx
import "./index.css";
import Header from "./components/Header";
import Nav from "./components/Nav";
import ChargingStationFinder from "./components/ChargingStationFinder";

export default function App() {
  return (
    <div className="app-container">
      <div className="app-header">
        <Header />
        <Nav />
      </div>
      <div className="app-content">
        <ChargingStationFinder />
      </div>
    </div>
  );
}
