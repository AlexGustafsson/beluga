import BreadcrumbSeparator from "../../components/BreadcrumbSeparator";
import { useSubPage } from "../../utils";
import GeneralSettingsPage from "./GeneralSettingsPage";
import RepositorySettingsPage from "./RepositorySettingsPage";
import TagsSettingsPage from "./TagsSettingsPage";
import { Breadcrumbs, Divider, Tab, Tabs } from "@mui/material";
import { NavLink, Outlet, Route, useParams } from "react-router-dom";

export const subPages = [
  <Route index element={<GeneralSettingsPage />} />,
  <Route path="general" element={<GeneralSettingsPage />} />,
  <Route path="tags" element={<TagsSettingsPage />} />,
  <Route path="settings" element={<RepositorySettingsPage />} />,
];

export default function (): JSX.Element {
  const { namespace, repositoryName } = useParams();

  const tab = useSubPage(["general", "tags", "settings"], "general");

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
        <p className="text-sm">{namespace}</p>
        <NavLink to="/repositories" className="hover:text-blue-500">
          Repositories
        </NavLink>
        <p className="text-sm text-blue-500">{repositoryName}</p>
      </Breadcrumbs>
      <Divider orientation="horizontal" />
      <Tabs value={tab}>
        <Tab
          component={NavLink}
          to="general"
          value="general"
          label="General"
          sx={{ padding: "20px", textTransform: "capitalize" }}
        />
        <Tab
          component={NavLink}
          to="tags"
          value="tags"
          label="Tags"
          sx={{ padding: "20px", textTransform: "capitalize" }}
        />
        <Tab
          component={NavLink}
          to="settings"
          value="settings"
          label="Settings"
          sx={{ padding: "20px", textTransform: "capitalize" }}
        />
      </Tabs>
      <Divider orientation="horizontal" />
      <main
        className="grow p-3 pt-7 space-y-4"
        style={{ backgroundColor: "#f7f7f8" }}
      >
        <Outlet />
      </main>
    </div>
  );
}
