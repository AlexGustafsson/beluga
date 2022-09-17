import Search from "../components/Search";
import CreateRepositoryPage from "./CreateRepositoryPage";
import ExplorePage from "./ExplorePage";
import HomePage from "./HomePage";
import ImagePage from "./ImagePage";
import OrganizationsPage from "./OrganizationsPage";
import RepositoriesPage from "./RepositoriesPage";
import RepositoryPage from "./RepositoryPage";
import SettingsPage from "./SettingsPage";
import UserProfilePage from "./UserProfilePage";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Button, Divider, Menu, MenuItem } from "@mui/material";
import { useRef, useState } from "react";
import { NavLink, Route, Routes } from "react-router-dom";

export default function (): JSX.Element {
  const profileMenuRef = useRef<HTMLButtonElement | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);

  // TODO: Implement user handling
  const [username, setUsername] = useState<string | undefined>("joedoe");

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
          {username ? (
            <>
              <NavLink to="/repositories">
                <Button color="inherit" style={{ textTransform: "none" }}>
                  Repositories
                </Button>
              </NavLink>
              <NavLink to="/orgs">
                <Button color="inherit" style={{ textTransform: "none" }}>
                  Organizations
                </Button>
              </NavLink>
              <Button
                ref={profileMenuRef}
                color="inherit"
                style={{ textTransform: "none" }}
                endIcon={<KeyboardArrowDown />}
                onClick={() => setProfileMenuOpen(true)}
              >
                {username}
              </Button>
              <Menu
                id="profile-menu"
                anchorEl={profileMenuRef.current}
                open={profileMenuOpen}
                onClose={() => setProfileMenuOpen(false)}
              >
                <NavLink
                  to={`/u/${username}`}
                  onClick={() => setProfileMenuOpen(false)}
                >
                  <MenuItem>My Profile</MenuItem>
                </NavLink>
                <Divider />
                <NavLink
                  to="/settings/general"
                  onClick={() => setProfileMenuOpen(false)}
                >
                  <MenuItem>Account Settings</MenuItem>
                </NavLink>
                <MenuItem onClick={() => setProfileMenuOpen(false)}>
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <NavLink to="/login">
              <Button color="inherit" style={{ textTransform: "none" }}>
                Sign In
              </Button>
            </NavLink>
          )}
        </div>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/login" element={<HomePage />} />
        <Route
          path="/r/:namespace/:repositoryName"
          element={<RepositoryPage />}
        />
        <Route path="/_/:repositoryName" element={<RepositoryPage />} />
        <Route
          path="/layers/:namespace/:repositoryName/:tagName/images/:digest"
          element={<ImagePage />}
        />
        <Route path="/settings/:page" element={<SettingsPage />} />
        <Route path="/u/:username" element={<UserProfilePage />} />
        <Route path="/repositories" element={<RepositoriesPage />} />
        <Route path="/orgs" element={<OrganizationsPage />} />
        <Route path="/repository/create" element={<CreateRepositoryPage />} />
      </Routes>
      <footer
        className="flex h-96 px-6 py-10"
        style={{ backgroundColor: "rgb(2, 33, 68)" }}
      ></footer>
    </div>
  );
}
