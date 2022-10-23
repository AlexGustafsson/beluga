import { useClient, User } from "../../client";
import { useSubPage } from "../../utils";
import RepositoriesPage from "./RepositoriesPage";
import { AccessTime, Fingerprint, Person } from "@mui/icons-material";
import { Avatar, Divider, Stack, Tab, Tabs, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { NavLink, Outlet, Route, useParams } from "react-router-dom";

export const subPages = [
  <Route index element={<RepositoriesPage category="owned" />} />,
  <Route path="starred" element={<RepositoriesPage category="starred" />} />,
  <Route
    path="contributed"
    element={<RepositoriesPage category="contributed" />}
  />,
];

export default function (): JSX.Element {
  const { username } = useParams();
  const tab = useSubPage(["", "starred", "contributed"], "");

  const [user, setUser] = useState<User>();

  const client = useClient();
  useEffect(() => {
    client.users.getUser(username!).then((x) => {
      setUser(x);
    });
  }, []);

  return (
    <Stack flexGrow="1">
      <Stack alignItems="center">
        <Stack sx={{ maxWidth: "960px", width: "100%" }}>
          <Stack
            direction="row"
            sx={{ padding: "60px 0px" }}
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
                  {username}
                </Typography>
                <NavLink to="/settings/general">
                  <Typography
                    variant="body2"
                    className="text-blue-500 underline"
                  >
                    Edit profile
                  </Typography>
                </NavLink>
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
          <Tabs value={tab}>
            <Tab
              component={NavLink}
              to=""
              value=""
              label="Repositories"
              sx={{ padding: "20px", textTransform: "capitalize" }}
            />
            <Tab
              component={NavLink}
              to="starred"
              value="starred"
              label="Starred"
              sx={{ padding: "20px", textTransform: "capitalize" }}
            />
            <Tab
              component={NavLink}
              to="contributed"
              value="contributed"
              label="Contributed"
              sx={{ padding: "20px", textTransform: "capitalize" }}
            />
          </Tabs>
        </Stack>
      </Stack>
      <Divider />
      <Stack
        sx={{
          padding: "12px",
          paddingTop: "24px",
          backgroundColor: "#f7f7f8",
          alignItems: "center",
          flexGrow: "1",
        }}
      >
        <Box sx={{ maxWidth: "960px", width: "100%" }}>
          <Outlet />
        </Box>
      </Stack>
    </Stack>
  );
}
