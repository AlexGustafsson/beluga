import { useClient, User } from "../../client";
import { useSubPage } from "../../utils";
import RepositoriesPage from "../RepositoriesPage";
import ContributedPage from "./ContributedPage";
import StarredPage from "./StarredPage";
import { AccessTime, DataUsage, Person } from "@mui/icons-material";
import { Divider, Stack, SvgIcon, Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { NavLink, Outlet, Route, useParams } from "react-router-dom";

export const subPages = [
  <Route index element={<RepositoriesPage />} />,
  <Route path="starred" element={<StarredPage />} />,
  <Route path="contributed" element={<ContributedPage />} />,
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
    <div className="flex flex-col grow">
      <header className="flex space-x-4">
        <Stack direction="row" className="p-4 items-center">
          <SvgIcon
            component={DataUsage}
            inheritViewBox
            sx={{ width: "120px", height: "120px" }}
          />
          <Stack className="ml-8" sx={{ color: "#445d6e" }}>
            <h2 className="text-xl font-semibold">{username}</h2>
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
      </header>
      <Box
        sx={{
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
      >
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
      </Box>
      <Divider />
      <Box sx={{ padding: "12px", backgroundColor: "#f7f7f8", flexGrow: 1 }}>
        <Outlet />
      </Box>
    </div>
  );
}
