import BreadcrumbSeparator from "../components/BreadcrumbSeparator";
import "../styles/markdown.css";
import { Breadcrumbs, Divider } from "@mui/material";
import { NavLink } from "react-router-dom";

export default function (): JSX.Element {
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
        <NavLink to="/settings/general" className="text-sm text-blue-500">
          General
        </NavLink>
      </Breadcrumbs>
      <Divider orientation="horizontal" />
    </div>
  );
}
