import { useClient } from "../client";
import BreadcrumbSeparator from "../components/BreadcrumbSeparator";
import "../styles/markdown.css";
import { Lock, Public } from "@mui/icons-material";
import {
  Breadcrumbs,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";

export default function (): JSX.Element {
  const [search] = useSearchParams();
  const requestedNamespace = search.get("namespace");

  const [namespace, setNamespace] = useState<string>();
  const [namespaces, setNamespaces] = useState<string[]>([]);
  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<string>();
  const [description, setDescription] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>();
  const [visibility, setVisibility] = useState<"public" | "private">("public");

  const client = useClient();
  useEffect(() => {
    client.organizations.getOrganizations(200).then((x) => {
      const namespaces = ["username", ...x.results.map((y) => y.orgname)];
      setNamespaces(namespaces);
      if (requestedNamespace && namespaces.includes(requestedNamespace)) {
        setNamespace(requestedNamespace);
      } else {
        setNamespace(namespaces[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (name === "") {
      setNameError("Repository name is required");
    } else if (name.match(/^[a-z0-9.,_-]+$/) === null) {
      setNameError(
        "Your repository name must contain a combination of alphanumeric characters and may contain the special characters ., _, or -. Letters must be lowercase."
      );
    } else if (name.length < 2 || name.length > 255) {
      setNameError(
        "Ensure that this value has at least 2 and at most 255 characters"
      );
    } else {
      setNameError(undefined);
    }
  }, [name]);

  useEffect(() => {
    if (description.length > 100) {
      setDescriptionError(
        "Description length should be no longer than 100 characters"
      );
    } else {
      setDescriptionError(undefined);
    }
  }, [description]);

  const navigate = useNavigate();

  const submit = useCallback(() => {
    client.repositories
      .postRepositories({
        namespace: namespace!,
        registry: "beluga",
        image: `${namespace}/${name}`,
        name: name,
        description: description,
        privacy: visibility,
        is_private: visibility === "private",
      })
      .then(() => {
        navigate(`/repository/beluga/${namespace}/${name}`);
      });
  }, [namespace, name, description, visibility]);

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
        <NavLink to="/repositories" className="hover:text-blue-500">
          Repositories
        </NavLink>
        <p className="text-sm text-blue-500">Create</p>
      </Breadcrumbs>
      <Divider orientation="horizontal" />
      <div className="flex">
        <main className="flex flex-col grow p-3 pt-4 space-y-4">
          <h1 className="text-xl font-bold">Create repository</h1>
          <Stack direction="row" className="space-x-4">
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
              error={typeof nameError !== "undefined"}
              helperText={nameError}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="grow"
              placeholder="Name"
              variant="standard"
            />
          </Stack>
          <TextField
            error={typeof descriptionError !== "undefined"}
            helperText={descriptionError}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            variant="standard"
          />
          <h2 className="text-lg font-medium !mt-16">Visibility</h2>
          <FormControl>
            <RadioGroup
              row
              defaultValue="public"
              value={visibility}
              onChange={(e) =>
                setVisibility(e.target.value as "public" | "private")
              }
            >
              <FormControlLabel
                value="public"
                control={<Radio />}
                label={
                  <Stack>
                    <p className="text-sm font-medium">
                      Public{" "}
                      <Public
                        sx={{
                          width: "18px",
                          height: "18px",
                          fill: "rgb(130, 148, 158)",
                        }}
                      />
                    </p>
                    <p className="text-sm">Appears in Beluga search results</p>
                  </Stack>
                }
              />
              <FormControlLabel
                value="private"
                control={<Radio />}
                label={
                  <Stack>
                    <p className="text-sm font-medium">
                      Private{" "}
                      <Lock
                        sx={{
                          width: "18px",
                          height: "18px",
                          fill: "rgb(130, 148, 158)",
                        }}
                      />
                    </p>
                    <p className="text-sm">Only visible to you</p>
                  </Stack>
                }
              />
            </RadioGroup>
          </FormControl>
          <div className="flex space-x-4 justify-end">
            <NavLink to="/repositories">
              <Button
                variant="outlined"
                color="error"
                style={{ textTransform: "none" }}
              >
                Cancel
              </Button>
            </NavLink>
            <Button
              disabled={name === ""}
              variant="contained"
              style={{ textTransform: "none" }}
              onClick={submit}
            >
              Create
            </Button>
          </div>
        </main>
        <aside className="flex flex-col p-3 pt-4 space-y-2">
          <h2 className="font-medium">Pro tip</h2>
          <p className="text-sm">
            You can push a new image to this repository using the CLI
          </p>
          <code
            className="px-3 py-4 rounded text-sm text-white"
            style={{ backgroundColor: "#445E6E" }}
          >
            docker tag local-image:tagname new-repo:tagname
            <br />
            docker push new-repo:tagname
          </code>
          <p className="text-sm">
            Make sure to change tagname with your desired image repository tag.
          </p>
        </aside>
      </div>
    </div>
  );
}
