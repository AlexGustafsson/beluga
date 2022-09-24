import { Repository, useClient } from "../client";
import "../styles/markdown.css";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Clear,
  Download,
  Lock,
  Public,
  Search,
  StarBorder,
} from "@mui/icons-material";
import {
  Button,
  Card,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function (): JSX.Element {
  const { user } = useAuth0();

  const [namespace, setNamespace] = useState<string>(user?.preferred_username!);
  const [namespaces, setNamespaces] = useState<string[]>([
    user?.preferred_username!,
  ]);
  const [repositories, setRepositories] = useState<Repository[]>([]);

  const client = useClient();
  useEffect(() => {
    client.organizations.getOrganizations(200).then((x) => {
      setNamespaces([
        user?.preferred_username!,
        ...x.results.map((y) => y.orgname),
      ]);
    });
  }, []);

  useEffect(() => {
    // TODO: Pagination
    client.repositories.getRepositories(namespace).then((x) => {
      setRepositories(x.results);
    });
  }, [namespace]);

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
          <Button
            variant="contained"
            style={{ textTransform: "none" }}
            className="self-end"
          >
            Create repository
          </Button>
        </NavLink>
      </header>
      {repositories.map((repository) => (
        <NavLink
          to={`/repository/docker/${repository.namespace}/${repository.name}`}
          key={`${repository.namespace}/${repository.name}`}
        >
          <Card
            className="p-5 mt-5 flex flex-row items-center"
            sx={{ color: "#445E6E" }}
          >
            <Stack className="grow">
              <p className="text-sm">
                {repository.namespace} /{" "}
                <span className="font-bold">{repository.name}</span>
              </p>
              <p className="text-xs">Last pushed: 2 hours ago</p>
            </Stack>
            <Stack direction="row" className="mx-4 space-x-1 items-center">
              <StarBorder sx={{ width: "20px", height: "20px" }} />
              <p className="text-sm">{repository.star_count}</p>
            </Stack>
            <Stack direction="row" className="mx-4 space-x-1 items-center">
              <Download sx={{ width: "20px", height: "20px" }} />
              <p className="text-sm">{repository.pull_count}</p>
            </Stack>
            <Stack direction="row" className="mx-4 space-x-1 items-center">
              {repository.is_private ? (
                <Lock sx={{ width: "20px", height: "20px" }} />
              ) : (
                <Public sx={{ width: "20px", height: "20px" }} />
              )}
              <p className="text-sm">
                {repository.is_private ? "Private" : "Public"}
              </p>
            </Stack>
          </Card>
        </NavLink>
      ))}
      <Card className="p-5 mt-5 text-sm">
        {repositories.length === 0 && (
          <p>There are no repositories in this namespace.</p>
        )}
        <p>
          Tip: Not finding your repository? Try switching namespace via the top
          left dropdown.
        </p>
      </Card>
    </div>
  );
}
