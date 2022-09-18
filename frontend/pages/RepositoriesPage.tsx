import { useClient } from "../client";
import "../styles/markdown.css";
import { Clear, Search } from "@mui/icons-material";
import {
  Button,
  Card,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function (): JSX.Element {
  const [namespace, setNamespace] = useState<string>("username");
  const [namespaces, setNamespaces] = useState<string[]>(["username"]);

  const client = useClient();
  useEffect(() => {
    client.organizations.getOrganizations(200).then((x) => {
      setNamespaces(["username", ...x.results.map((y) => y.orgname)]);
    });
  }, []);

  return (
    <div
      className="flex flex-col grow p-3 pt-7"
      style={{ backgroundColor: "#f7f7f8" }}
    >
      <header className="flex items-center space-x-4">
        <Select
          value={namespace}
          onChange={(e) => setNamespace(e.target.value)}
          size="small"
          className="self-start"
          sx={{ backgroundColor: "#fbfbfc", fontSize: "12px" }}
        >
          {namespaces.map((x) => (
            <MenuItem key={x} value={x} sx={{ fontSize: "12px" }}>
              {x}
            </MenuItem>
          ))}
        </Select>
        <TextField
          size="small"
          variant="outlined"
          sx={{ backgroundColor: "#fbfbfc" }}
          InputProps={{
            placeholder: "Search by repository name",
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small">
                  <Clear fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            style: { fontSize: "12px" },
          }}
        />
        <NavLink to={`/repository/create?namespace=${namespace}`}>
          <Button variant="contained" style={{ textTransform: "none" }}>
            Create repository
          </Button>
        </NavLink>
      </header>
      <Card className="p-5 mt-5">
        <p>
          There are no repositories in this namespace. Tip: Not finding your
          repository? Try switching namespace via the top left dropdown.
        </p>
      </Card>
    </div>
  );
}
