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
        <NavLink to="/repositories" className="hover:text-blue-500">
          Repositories
        </NavLink>
        <p className="text-sm text-blue-500">Create</p>
      </Breadcrumbs>
      <Divider orientation="horizontal" />
      <div className="flex">
        <main className="flex flex-col grow p-3 space-y-4">
          <h1 className="text-2xl">Create repository</h1>
          <div className="flex space-x-4">
            <Select
              defaultValue="newest"
              size="small"
              sx={{ backgroundColor: "#fbfbfc", fontSize: "12px" }}
            >
              <MenuItem value="newest" sx={{ fontSize: "12px" }}>
                Newest
              </MenuItem>
              <MenuItem value="oldest" sx={{ fontSize: "12px" }}>
                Oldest
              </MenuItem>
              <MenuItem value="a-z" sx={{ fontSize: "12px" }}>
                A-Z
              </MenuItem>
              <MenuItem value="z-a" sx={{ fontSize: "12px" }}>
                Z-A
              </MenuItem>
            </Select>
            <TextField className="grow" placeholder="Name" variant="standard" />
          </div>
          <TextField placeholder="Description" variant="standard" />
          <h2 className="text-xl">Visibility</h2>
          <FormControl>
            <RadioGroup row defaultValue="public">
              <FormControlLabel
                value="public"
                control={<Radio />}
                label={
                  <Stack>
                    <p>
                      Public <Public />
                    </p>
                    <p>Appears in Beluga search results</p>
                  </Stack>
                }
              />
              <FormControlLabel
                value="private"
                control={<Radio />}
                label={
                  <Stack>
                    <p>
                      Private <Lock />
                    </p>
                    <p>Only visible to you</p>
                  </Stack>
                }
              />
            </RadioGroup>
          </FormControl>
          <div className="flex space-x-4 justify-end">
            <Button
              variant="outlined"
              color="error"
              style={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button variant="contained" style={{ textTransform: "none" }}>
              Create
            </Button>
          </div>
        </main>
        <aside className="flex flex-col p-3 space-y-2">
          <h2>Pro tip</h2>
          <p>You can push a new image to this repository using the CLI</p>
          <code className="p-2 rounded bg-gray-400">
            docker tag local-image:tagname new-repo:tagname
            <br />
            docker push new-repo:tagname
          </code>
          <p>
            Make sure to change tagname with your desired image repository tag.
          </p>
        </aside>
      </div>
    </div>
  );
}
