import { Summary, useClient } from "../client";
import Search, { ISearchOption, ISearchOptions } from "../components/Search";
import { useDebounce } from "../utils";
import SettingsPage, {
  subPages as accountSettingsPages,
} from "./AccountSettingsPage";
import CreateRepositoryPage from "./CreateRepositoryPage";
import ExplorePage from "./ExplorePage";
import FullPageLoading from "./FullPageLoading";
import HomePage from "./HomePage";
import ImagePage from "./ImagePage";
import OrganizationsPage from "./OrganizationsPage";
import RepositoriesPage from "./RepositoriesPage";
import RepositoryPage, { subPages as repositoryPages } from "./RepositoryPage";
import RepositorySettingsPage, {
  subPages as repositorySettingsPages,
} from "./RepositorySettingsPage";
import UserProfilePage, {
  subPages as userSettingsPages,
} from "./UserProfilePage";
import { useAuth0 } from "@auth0/auth0-react";
import { Fingerprint, KeyboardArrowDown } from "@mui/icons-material";
import { Avatar, Button, Divider, Menu, MenuItem } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";

function useSearch() {
  const [searchString, setSearchString] = useState<string>("");
  const [selected, setSelected] = useState<ISearchOption<Summary> | null>(null);
  const [searchOptions, setSearchOptions] = useState<ISearchOptions<Summary>>({
    group: "",
    matches: 0,
    options: [],
  });

  const client = useClient();

  const query = useDebounce(searchString, 250);

  useEffect(() => {
    if (query.length < 2) {
      setSearchOptions({
        group: "Community",
        matches: 0,
        options: [],
      });
      return;
    }

    client.search
      .getSearch(5, undefined, undefined, undefined, query)
      .then((x) => {
        setSearchOptions({
          group: "Community",
          matches: x.count,
          options: x.summaries.map((y) => ({
            title: y.name,
            group: "Community",
            value: y,
          })),
        });
      });
  }, [query]);

  const navigate = useNavigate();

  useEffect(() => {
    if (selected) {
      navigate(`/r/${selected.value.slug}`);
    }
  }, [selected]);

  const searchElement = (
    <Search
      options={searchOptions}
      placeholder="Search for great content (e.g., mysql)"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      }}
      value={searchString}
      onChange={(x) => setSearchString(x)}
      selected={selected}
      onSelectedChange={(x) => setSelected(x)}
    />
  );

  return { searchElement };
}

export default function (): JSX.Element {
  const profileMenuRef = useRef<HTMLButtonElement | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);

  const { searchElement } = useSearch();

  const { error, user, isAuthenticated, isLoading, loginWithRedirect, logout } =
    useAuth0();

  if (isLoading) {
    return <FullPageLoading />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

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
          {searchElement}
        </div>
        <div className="flex items-center space-x-4">
          <NavLink to="/explore">
            <Button color="inherit" style={{ textTransform: "none" }}>
              Explore
            </Button>
          </NavLink>
          {isAuthenticated ? (
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
                startIcon={
                  <Avatar sx={{ backgroundColor: "transparent" }}>
                    <Fingerprint sx={{ width: "100%", height: "100%" }} />
                  </Avatar>
                }
                endIcon={<KeyboardArrowDown />}
                onClick={() => setProfileMenuOpen(true)}
              >
                {user?.preferred_username}
              </Button>
              <Menu
                id="profile-menu"
                anchorEl={profileMenuRef.current}
                open={profileMenuOpen}
                onClose={() => setProfileMenuOpen(false)}
              >
                <NavLink
                  to={`/u/${user?.preferred_username}`}
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
                <MenuItem
                  onClick={() => logout({ returnTo: window.location.origin })}
                >
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              style={{ textTransform: "none" }}
              onClick={() => loginWithRedirect()}
            >
              Sign In
            </Button>
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
        >
          {repositoryPages}
        </Route>
        <Route path="/_/:repositoryName" element={<RepositoryPage />} />
        <Route
          path="/layers/:namespace/:repositoryName/:tagName/images/:digest"
          element={<ImagePage />}
        />
        <Route path="/settings" element={<SettingsPage />}>
          {accountSettingsPages}
        </Route>
        <Route path="/u/:username" element={<UserProfilePage />}>
          {userSettingsPages}
        </Route>
        <Route path="/repositories" element={<RepositoriesPage />} />
        <Route path="/orgs" element={<OrganizationsPage />} />
        <Route path="/repository/create" element={<CreateRepositoryPage />} />
        <Route
          path="/repository/:registryName/:namespace/:repositoryName"
          element={<RepositorySettingsPage />}
        >
          {repositorySettingsPages}
        </Route>
      </Routes>
      <footer
        className="px-6 py-10"
        style={{ backgroundColor: "rgb(2, 33, 68)" }}
      >
        <div className="flex">
          <div className="text-white px-4">
            <h3 className="font-medium">Beluga</h3>
            <ul className="font-light text-sm flex flex-col space-y-2 mt-2">
              <NavLink to="/" className="hover:opacity-100 opacity-60">
                <li>Home</li>
              </NavLink>
            </ul>
          </div>
          <div className="text-white px-4">
            <h3 className="font-medium">Support</h3>
            <ul className="font-light text-sm flex flex-col space-y-2 mt-2">
              <NavLink to="/docs" className="hover:opacity-100 opacity-60">
                <li>Documentation</li>
              </NavLink>
              <a
                href="https://github.com/AlexGustafsson/beluga/issues"
                target="_blank"
                className="hover:opacity-100 opacity-60"
              >
                <li>GitHub Issues</li>
              </a>
            </ul>
          </div>
          <div className="text-white px-4">
            <h3 className="font-medium">Developers</h3>
            <ul className="font-light text-sm flex flex-col space-y-2 mt-2">
              <a
                href="https://github.com/AlexGustafsson/beluga"
                target="_blank"
                className="hover:opacity-100 opacity-60"
              >
                <li>Getting Started</li>
              </a>
              <a
                href="https://github.com/AlexGustafsson/beluga"
                target="_blank"
                className="hover:opacity-100 opacity-60"
              >
                <li>Contributing</li>
              </a>
              <a
                href="https://github.com/AlexGustafsson/beluga/issues"
                target="_blank"
                className="hover:opacity-100 opacity-60"
              >
                <li>GitHub Issues</li>
              </a>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
