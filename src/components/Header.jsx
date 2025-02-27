import logo from "../assets/WattWillstDu.png";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="logo-container">
        <img src={logo} alt="WattWillstDu Logo" className="logo" />
      </div>
    </header>
  );
}
