import { Image } from "../client";
import { formatImageDisplayName } from "../utils";
import { DataUsage } from "@mui/icons-material";
import {
  Box,
  Chip,
  Stack,
  SvgIcon,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";

export interface Props {
  sx?: SxProps<Theme>;
  value: Image;
}

export default function ({ sx, value }: Props): JSX.Element {
  return (
    <Box sx={{ padding: "24px", ...sx }}>
      <Stack direction="row" spacing={2}>
        <SvgIcon
          component={DataUsage}
          inheritViewBox
          sx={{ width: "120px", height: "120px" }}
        />
        <Stack direction="column" sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="p">
            {formatImageDisplayName(value.owner, value.name)}
          </Typography>
          <Typography variant="body2" component="p">
            {`By ${value.owner} • Updated ${value.updated}`}
          </Typography>
          <Typography
            variant="body2"
            component="p"
            sx={{ flexGrow: 1, marginTop: 2 }}
          >
            {value.summary}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
            {value.tags.map((x) => (
              <Chip key={x} label={x} size="small" />
            ))}
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Stack direction="column" sx={{ alignItems: "flex-end" }}>
            <Typography variant="subtitle2" component="p">
              {value.downloads}
            </Typography>
            <Typography variant="subtitle2" component="p">
              Downloads
            </Typography>
          </Stack>
          <Stack direction="column" sx={{ alignItems: "flex-end" }}>
            <Typography variant="subtitle2" component="p">
              {value.stars}
            </Typography>
            <Typography variant="subtitle2" component="p">
              Stars
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}