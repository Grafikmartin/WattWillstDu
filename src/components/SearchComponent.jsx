import { useState } from "react";
import "./SearchComponent.css";
import { Search } from "lucide-react"; // Lupe-Icon

export default function SearchComponent() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState([]);
  
  const providers = [
    "AAE", "AeroVironment", "Alfen", "Allego BV", "Avacon", "Badenova (DE)", "be emobil", "Be Energised",
    "BeCharged", "Blue Corner (Belgium)", "BS Energie", "ČEZ", "Charge & Fuel", "ChargeIT mobility", "ChargeNow",
    "ChargePoint (Coulomb Technologies)", "Chargy (LU)", "CLEVER", "Comfortcharge", "da emobil", "Drehstromnetz",
    "E.ON (CZ)", "E.ON (DE)", "EAM", "Easy4You", "Ecotap", "eDrop", "EE-Mobil", "eins", "e-Laad", "ElectroDrive/Mark-E (DE)",
    "Ella", "Elocity", "emma", "EnBW (D)", "EnerCity", "Energie der Eifel", "EnergieDienst", "Energieversorgung Buching-Trauchgau",
    "ENEWA", "Enovos", "Entega", "Essent (NL)", "Estonteca", "EV-Box", "Evd Dormagen", "EVite (ch)", "EVL (de)", "EVnetNL",
    "EVPass (CH)", "E-Wald", "EWB", "EWE", "EWP : Energie und Wasser Potsdam GmbH", "EWR gmbh e-mobile", "FastNed", "FLOW Charging",
    "GGEW", "GOFAST (Gotthard Fastcharge)", "Greenflux", "Greenway", "Harz Energie", "Incharge", "Innogy SE (RWE eMobility)", "Ionity",
    "Izivia (Sodetrel)", "KiWhi Pass", "Ladefoxx", "ladenetz.de", "Lidl", "LSW Energie", "Mainova", "München Umland", "N-ERGIE",
    "Nissan DE Freistrom", "Nomadpower", "Nuon", "Osterholzer Stadtwerke", "OVAG Energie", "Park & Charge (CH)", "Park & Charge (D)",
    "Pfalzwerke", "Plug n Roll", "PlugSurfing", "Polyfazer", "PRE (cz)", "REWAG", "RheinEnergie AG", "RhönEnergie", "RWE Mobility/Essent",
    "Schleswiger Stadtwerke", "Schwabencard", "SMATRICS Netz", "Städtische Werke Magdeburg", "Stadtwerke Clausthal-Zellerfeld",
    "Stadtwerke Düsseldorf AG", "Stadtwerke Elmshorn", "Stadtwerke Göttingen", "Stadtwerke Grevesmühlen", "Stadtwerke Haldensleben SWH",
    "Stadtwerke Halle", "Stadtwerke Hameln", "Stadtwerke Leipzig SWL", "Stadtwerke Lübeck", "Stadtwerke Münster", "Stadtwerke Neumünster (SWN)",
    "Stadtwerke Northeim SWN", "Stadtwerke Rinteln", "Stadtwerke Rostock", "Stadtwerke Soest", "Stadtwerke Strahlsund", "Stadtwerke Uetersen",
    "Stadtwerke Verden", "Stadtwerke Wernigerode", "Stadtwerke Wittenberg", "Stadtwerke Wolfenbüttel", "Stromnetz Hamburg", "StromTicket",
    "Stromtreter", "SUN Stadtwerke Union Nordhessen", "SWB / EWE", "Swisscharge (CH)", "Tank & Rast", "Tesla Motors (Worldwide)",
    "The New Motion (BE)", "The New Motion (DE)", "The New Motion (NL)", "ThePluginCompany (Belgium)", "TIWAG Tiroler Wasserkraft AG (AT)",
    "ubitricity", "UWAG", "Vattenfall", "Versorgungsbetriebe Hann. Münden", "VIRTA", "Vlotte", "VR Schneller-Strom-tanken", "Werraenergie",
    "Wirtschaftsbetriebe Stadt Nienburg", "ZEAG Energie"
  ];
  const toggleProvider = (provider) => {
    setSelectedProviders((prev) =>
      prev.includes(provider)
        ? prev.filter((p) => p !== provider)
        : [...prev, provider]
    );
  };

  return (
    <div className="search-container">
      {/* Suchfeld mit Lupe */}
      <div className="search-box">
        <Search className="search-icon" size={20} /> {/* Lupe vor Suchfeld */}
        <input type="text" placeholder="Adresse suchen..." />
      </div>

      {/* Standort-Button ohne Pin */}
      <button className="location-button">Aktuellen Standort verwenden</button>

      {/* Netzbetreiber Dropdown */}
      <div className="provider-dropdown">
        <button className="dropdown-toggle" onClick={() => setShowDropdown(!showDropdown)}>
          Netzbetreiber auswählen
        </button>

        {showDropdown && (
          <div className="dropdown-list">
            {providers.map((provider) => (
              <label key={provider} className="container">
                <input
                  type="checkbox"
                  checked={selectedProviders.includes(provider)}
                  onChange={() => toggleProvider(provider)}
                />
                <svg viewBox="0 0 64 64" height="1.5em" width="1.5em">
                  <path
                    d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                    pathLength="575.0541381835938"
                    className="path"
                  />
                </svg>
                {provider}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}