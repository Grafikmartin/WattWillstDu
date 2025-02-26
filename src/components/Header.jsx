import { useState } from "react";
import { Menu, X } from "lucide-react";
import "./Header.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
      {menuOpen && (
        <nav className="menu">
          <ul>
            <li>🇩🇪 Deutsch</li>
            <li>🇬🇧 English</li>
            <li><span className="menu-title">Kontakt</span></li>
            <li><span className="menu-title">Einheiten</span></li>
            <li className="unit-options">
              <label className="container">
                <input type="radio" name="unit" value="metric" defaultChecked />
                <svg viewBox="0 0 64 64"  height="1.5em" width="1.5em">
                  <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" className="path"></path>
                </svg>
                km / m / kmh
              </label>
              <label className="container">
                <input type="radio" name="unit" value="imperial" />
                <svg viewBox="0 0 64 64" height="1.5em" width="1.5em">
                  <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" className="path"></path>
                </svg>
                mi / ft / mph
              </label>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
