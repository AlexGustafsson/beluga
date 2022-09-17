import { Summary } from "../client";
import { DataUsage } from "@mui/icons-material";
import {
  Card,
  Chip,
  Stack,
  SvgIcon,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";

export interface Props {
  sx?: SxProps<Theme>;
  value: Summary;
}

export default function ({ sx, value }: Props): JSX.Element {
  return (
    <Card sx={{ height: "182px", padding: "24px", ...sx }}>
      <Stack direction="row" spacing={2}>
        <SvgIcon
          component={DataUsage}
          inheritViewBox
          sx={{ width: "60px", height: "60px" }}
        />
        <Stack direction="column" sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" component="p">
            {value.name}
          </Typography>
          <Typography variant="body2" component="p">
            {`Updated ${value.updated_at}`}
          </Typography>
          <Typography
            variant="body2"
            component="p"
            sx={{ flexGrow: 1, marginTop: 2 }}
          >
            {value.short_description}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ marginTop: 1 }}>
            {value.architectures.map((x) => (
              <Chip key={x.name} label={x.label} size="small" />
            ))}
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1}>
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
    </Card>
  );
}
