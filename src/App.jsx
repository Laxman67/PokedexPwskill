import { Link } from "react-router-dom";
import "./App.css";
import CustomRoutes from "./routes/CustomRoutes";

function App() {
  return (
    <div className="outer-pokedex">
      <Link to="/">
        <h1 id="pokedex-heading">Pokedex</h1>
      </Link>
      <CustomRoutes />
    </div>
  );
}

export default App;
