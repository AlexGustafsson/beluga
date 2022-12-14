import { RepositoryWithDetails } from "../client";
import { DataUsage, Star, StarOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  SvgIcon,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";

export interface Props {
  sx?: SxProps<Theme>;
  value: RepositoryWithDetails;
  onStarredChange?: (starred: boolean) => void;
}

export default function ({ sx, value, onStarredChange }: Props): JSX.Element {
  return (
    <Box sx={{ padding: "24px", ...sx }}>
      <Stack direction="row" spacing={2}>
        <SvgIcon
          component={DataUsage}
          inheritViewBox
          sx={{ width: "120px", height: "120px" }}
        />
        <Stack direction="column" sx={{ flexGrow: 1 }}>
          <Stack direction="row" alignItems="center" spacing="5px">
            <Typography variant="h5" component="p">
              {value.namespace}/{value.name}
            </Typography>
            <IconButton
              onClick={
                onStarredChange
                  ? () => onStarredChange(!value.has_starred)
                  : undefined
              }
            >
              {value.has_starred ? (
                <Star fontSize="inherit" />
              ) : (
                <StarOutline fontSize="inherit" />
              )}
            </IconButton>
          </Stack>
          <Typography variant="body2" component="p">
            By{" "}
            <NavLink
              to={`/u/${value.hub_user}`}
              className="text-xs text-blue-500 underline"
            >
              {value.hub_user}
            </NavLink>{" "}
            • Updated {value.last_updated}
          </Typography>
          <Typography
            variant="body2"
            component="p"
            sx={{ flexGrow: 1, marginTop: 2 }}
          >
            {value.description}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
            <Chip
              key={value.repository_type}
              label={value.repository_type}
              size="small"
            />
          </Stack>
        </Stack>
        <Stack>
          <NavLink to={`/repository/docker/${value.namespace}/${value.name}`}>
            {value.affiliation === "owner" && (
              <Button variant="outlined">Manage Repository</Button>
            )}
          </NavLink>
          <Stack direction="row" spacing={1} className="mt-3 self-end">
            <Stack direction="column" sx={{ alignItems: "flex-end" }}>
              <Typography variant="subtitle2" component="p">
                {value.pull_count}
              </Typography>
              <Typography variant="subtitle2" component="p">
                Downloads
              </Typography>
            </Stack>
            <Stack direction="column" sx={{ alignItems: "flex-end" }}>
              <Typography variant="subtitle2" component="p">
                {value.star_count}
              </Typography>
              <Typography variant="subtitle2" component="p">
                Stars
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
