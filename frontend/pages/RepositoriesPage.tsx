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
import { NavLink } from "react-router-dom";

export default function (): JSX.Element {
  return (
    <div
      className="flex flex-col grow p-3 pt-7"
      style={{ backgroundColor: "#f7f7f8" }}
    >
      <header className="flex items-center space-x-4">
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
        <NavLink to="/repository/create?namespace=ramonkulasdasd">
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
