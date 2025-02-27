import "./index.css";  
import Header from "./components/Header";  
import Nav from "./components/Nav";  
import SearchComponent from "./components/SearchComponent";  

export default function App() {
  return (
    <div>
      <Header />
      <Nav />
      <SearchComponent /> 
    </div>
  );
}
