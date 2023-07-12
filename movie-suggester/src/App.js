import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Search from "./pages/search";
import Single from "./pages/single";
import "bootstrap/dist/css/bootstrap.css";
import "./styles/styles.scss";

function App() {
  return (
    <BrowserRouter basename={"/"}>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Search />}></Route>
          <Route path="/single/:id" element={<Single />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
