import Search from "../components/Search";
import ExplorePage from "./ExplorePage";
import HomePage from "./HomePage";
import ImagePage from "./ImagePage";
import LayerPage from "./LayerPage";
import { Button } from "@mui/material";
import { NavLink, Route, Routes } from "react-router-dom";

export default function (): JSX.Element {
  return (
    <div className="flex flex-col min-h-screen">
      <header
        className="px-4 flex w-full h-32 justify-between items-center text-white text-sm font-semibold"
        style={{ height: 64, backgroundColor: "#2496ed" }}
      >
        <div className="flex items-center space-x-4">
          <NavLink to="/">
            <Button color="inherit" style={{ textTransform: "none" }}>
              Beluga
            </Button>
          </NavLink>
          <Search
            placeholder="Search for great content (e.g., mysql)"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}
          ></Search>
        </div>
        <div className="flex items-center space-x-4">
          <NavLink to="/explore">
            <Button color="inherit" style={{ textTransform: "none" }}>
              Explore
            </Button>
          </NavLink>
          <NavLink to="/login">
            <Button color="inherit" style={{ textTransform: "none" }}>
              Sign In
            </Button>
          </NavLink>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/login" element={<HomePage />} />
        <Route path="/images/:owner/:name" element={<ImagePage />} />
        <Route
          path="/images/:owner/:name/layers/:layer"
          element={<LayerPage />}
        />
      </Routes>
      <footer
        className="flex h-96 px-6 py-10"
        style={{ backgroundColor: "rgb(2, 33, 68)" }}
      ></footer>
    </div>
  );
}
