import { Tag } from "../client";
import { formatLayersURL, preferredTagVariant } from "../utils";
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
import { NavLink } from "react-router-dom";

export interface Props {
  value: Tag;
  owner: string;
  name: string;
}

export default function ({ owner, name, value }: Props): JSX.Element {
  const defaultVariant = preferredTagVariant(value.variants);

  return (
    <Card sx={{ padding: "24px" }}>
      <Stack direction="column" spacing={2}>
        <p className="text-xs text-gray-500">TAG</p>
        <header className="flex justify-between">
          <Stack direction="column" sx={{ flexGrow: 1 }}>
            <NavLink
              className="text-sm text-blue-500 underline font-semibold"
              to={formatLayersURL(
                owner,
                name,
                defaultVariant?.digest || "",
                defaultVariant?.digestAlgorithm || ""
              )}
            >
              {value.name}
            </NavLink>
            <p className="text-xs mt-1">
              Last pushed{" "}
              <span className="font-medium">{value.updated.toString()}</span> by{" "}
              <NavLink
                to={`/u/${owner}`}
                className="text-xs text-blue-500 underline"
              >
                {owner}
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
                {value.variants.map((variant) => (
                  <TableRow
                    key={variant.digest}
                    component={NavLink}
                    to={formatLayersURL(
                      owner,
                      name,
                      variant.digest,
                      variant.digestAlgorithm
                    )}
                    sx={{
                      "td, th": { border: 0 },
                      "&:hover": { backgroundColor: "#f2f8ff" },
                    }}
                  >
                    <TableCell component="th" scope="row" sx={{ padding: 0 }}>
                      <NavLink
                        to={formatLayersURL(
                          owner,
                          name,
                          variant.digest,
                          variant.digestAlgorithm
                        )}
                        className="underline text-blue-500"
                      >
                        {variant.digest.substring(0, 12)}
                      </NavLink>
                    </TableCell>
                    <TableCell align="left">
                      {variant.os}/{variant.arch}
                    </TableCell>
                    <TableCell align="right" sx={{ padding: 0 }}>
                      {Math.round(
                        (variant.compressedSize / 1024 / 1024) * 100
                      ) / 100}{" "}
                      MB
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
