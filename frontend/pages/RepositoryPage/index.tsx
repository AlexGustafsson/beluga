import { RepositoryWithDetails, useClient } from "../../client";
import BreadcrumbSeparator from "../../components/BreadcrumbSeparator";
import RepositoryBox from "../../components/RepositoryBox";
import { useSubPage } from "../../utils";
import OverviewPage from "./OverviewPage";
import TagsPage from "./TagsPage";
import { Breadcrumbs, Divider, Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { NavLink, Outlet, Route, useParams } from "react-router-dom";

export const subPages = [
  <Route index element={<OverviewPage />} />,
  <Route path="tags" element={<TagsPage />} />,
];

export default function (): JSX.Element {
  const { namespace, repositoryName = "_" } = useParams();
  const [repository, setRepository] = useState<RepositoryWithDetails>();

  const tab = useSubPage(["", "tags"], "");

  const client = useClient();
  useEffect(() => {
    client.repositories
      .getRepository("_", "nginx")
      .then((x) => setRepository(x));
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
        <NavLink to="/explore" className="hover:text-blue-500">
          Explore
        </NavLink>
        <p className="text-sm text-blue-500">{`${namespace}/${repositoryName}`}</p>
      </Breadcrumbs>
      <Divider orientation="horizontal" />
      <header className="flex space-x-4">
        {repository ? (
          <RepositoryBox value={repository} sx={{ width: "100%" }} />
        ) : null}
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
            label="Overview"
            sx={{ padding: "20px", textTransform: "capitalize" }}
          />
          <Tab
            component={NavLink}
            to="tags"
            value="tags"
            label="Tags"
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
