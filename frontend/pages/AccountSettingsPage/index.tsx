import { useClient, User } from "../../client";
import BreadcrumbSeparator from "../../components/BreadcrumbSeparator";
import { useSubPage } from "../../utils";
import GeneralSettingsPage from "./GeneralSettingsPage";
import SecuritySettingsPage from "./SecuritySettingsPage";
import {
  AccessTime,
  DataUsage,
  Person,
  Fingerprint,
} from "@mui/icons-material";
import {
  Breadcrumbs,
  Divider,
  Stack,
  SvgIcon,
  Tab,
  Tabs,
  Avatar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Navigate, NavLink, Outlet, Route } from "react-router-dom";

export const subPages = [
  <Route index element={<Navigate replace to="general" />} />,
  <Route path="general" element={<GeneralSettingsPage />} />,
  <Route path="security" element={<SecuritySettingsPage />} />,
];

export default function (): JSX.Element {
  const tab = useSubPage(
    [
      "general",
      "security",
      "default-privacy",
      "notifications",
      "convert",
      "deactivate",
    ],
    "general"
  );

  const [user, setUser] = useState<User>();

  const client = useClient();
  useEffect(() => {
    client.users.getCurrentUser().then((x) => {
      setUser(x);
    });
  }, []);

  return (
    <div className="flex flex-col grow">
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          paddingLeft: "12px",
          paddingRight: "12px",
          paddingTop: "11px",
          paddingBottom: "11px",
          fontSize: "14px",
        }}
        separator={<BreadcrumbSeparator />}
      >
        <NavLink to="/settings/general" className="hover:text-blue-500">
          Account Settings
        </NavLink>
        <p className="text-sm text-blue-500 capitalize">
          {tab?.replaceAll("-", " ")}
        </p>
      </Breadcrumbs>
      <Divider orientation="horizontal" />
      <Stack
        direction="row"
        sx={{ padding: "60px 75px" }}
        spacing="55px"
        alignItems="center"
      >
        <Avatar
          sx={{
            width: "80px",
            height: "80px",
            backgroundColor: "transparent",
          }}
        >
          <Fingerprint
            sx={{ width: "100%", height: "100%", color: "#099CEC" }}
          />
        </Avatar>
        <Stack sx={{ color: "#445d6e" }}>
          <Stack direction="row" alignItems="flex-end" spacing="20px">
            <Typography variant="h3" fontWeight="medium">
              {user?.username}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            className="text-xs items-center mt-3"
            sx={{ color: "#8f9ea8", fill: "#8f9ea8" }}
          >
            <Person sx={{ width: "18px", height: "18px" }} />
            <p className="ml-1">Community User</p>
            <AccessTime
              className="ml-4"
              sx={{ width: "18px", height: "18px" }}
            />
            <p className="ml-1">{user?.date_joined}</p>
          </Stack>
        </Stack>
      </Stack>
      <div
        className="flex flex-row grow p-6"
        style={{ backgroundColor: "#f7f7f8" }}
      >
        <menu>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={tab}
            sx={{
              ".MuiTabs-indicator": {
                left: 0,
              },
            }}
          >
            <Tab
              component={NavLink}
              to="general"
              value="general"
              label="General"
              sx={{
                alignItems: "flex-start",
              }}
            />
            <Tab
              component={NavLink}
              to="security"
              value="security"
              label="Security"
              sx={{
                alignItems: "flex-start",
              }}
            />
          </Tabs>
        </menu>
        <main className="ml-6 grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
