import { Tag } from "../client";
import {
  Card,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";

export interface Props {
  value: Tag;
  namespace: string;
  repositoryName: string;
}

export default function ({
  namespace,
  repositoryName,
  value,
}: Props): JSX.Element {
  const navigate = useNavigate();

  return (
    <Card sx={{ padding: "24px" }}>
      <Stack direction="column" spacing={2}>
        <p className="text-xs text-gray-500">TAG</p>
        <header className="flex justify-between">
          <Stack direction="column" sx={{ flexGrow: 1 }}>
            <NavLink
              className="text-sm text-blue-500 underline font-semibold self-start"
              to={`/layers/${namespace}/${repositoryName}/${value.name}/images/${value.digest}`}
            >
              {value.name}
            </NavLink>
            <p className="text-xs mt-1">
              Last pushed{" "}
              <span className="font-medium">
                {value.last_updated.toString()}
              </span>{" "}
              by{" "}
              <NavLink
                to={`/u/${value.last_updated_username}`}
                className="text-xs text-blue-500 underline"
              >
                {value.last_updated_username}
              </NavLink>
            </p>
            <Table size="small" aria-label="a dense table">
              <TableHead>
                <TableRow sx={{ "td, th": { border: 0 } }}>
                  <TableCell sx={{ padding: 0 }}>
                    <Typography variant="caption">DIGEST</Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="caption">OS/ARCH</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ padding: 0 }}>
                    <Typography variant="caption">COMPRESSED SIZE</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {value.images.map((image) => (
                  <TableRow
                    key={image.digest}
                    className="cursor-pointer"
                    sx={{
                      "td, th": { border: 0 },
                      "&:hover": { backgroundColor: "#f2f8ff" },
                    }}
                    /** A table row cannot exist within an anchor, hence we use onclick instead */
                    onClick={() =>
                      navigate(
                        `/layers/${namespace}/${repositoryName}/${value.name}/images/${image.digest}`
                      )
                    }
                  >
                    <TableCell component="th" scope="row" sx={{ padding: 0 }}>
                      <NavLink
                        to={`/layers/${namespace}/${repositoryName}/${value.name}/images/${image.digest}`}
                        className="underline text-blue-500"
                      >
                        {image.digest.substring(0, 12)}
                      </NavLink>
                    </TableCell>
                    <TableCell align="left">
                      {image.os}/{image.architecture}
                    </TableCell>
                    <TableCell align="right" sx={{ padding: 0 }}>
                      {Math.round((image.size / 1024 / 1024) * 100) / 100} MB
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Stack>
        </header>
      </Stack>
    </Card>
  );
}
