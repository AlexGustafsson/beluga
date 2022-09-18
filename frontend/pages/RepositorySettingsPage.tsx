import BreadcrumbSeparator from "../components/BreadcrumbSeparator";
import "../styles/markdown.css";
import { Schedule } from "@mui/icons-material";
import { Breadcrumbs, Card, Divider, Stack, Tab, Tabs } from "@mui/material";
import { NavLink, Outlet, useParams } from "react-router-dom";

export function RepositoryGeneralSettingsPage() {
  return (
    <>
      <Stack>
        <Card className="p-5">
          <h1>nginx/nginx</h1>
          <h2>Description</h2>
          <p>
            <Schedule />
            Last pushed: an hour ago
          </p>
        </Card>
      </Stack>
      <Stack direction="row" className="space-x-4">
        <Card className="p-5 grow">
          <h1>Tags and scans</h1>
          <h2>Description</h2>
          <p>
            <Schedule />
            Last pushed: an hour ago
          </p>
        </Card>
        <Card className="p-5">
          <h1>Automated Builds</h1>
          <p>...</p>
        </Card>
      </Stack>
      <Card className="p-5">
        <h1>README</h1>
        <p>Repository description is empty.</p>
      </Card>
    </>
  );
}

export function RepositoryTagsSettingsPage() {
  return <p>Tags</p>;
}

export function RepositorySettingsSettingsPage() {
  return <p>Settings</p>;
}

function useSubPage(
  available: string[],
  defaultPage?: string
): string | undefined {
  const page = location.pathname.replace(/\/$/, "").split("/").pop()!;
  if (available.includes(page)) {
    return page;
  }
  return defaultPage;
}

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
