import { TagVariant } from "../client";
import { formatImageDisplayName } from "../utils";
import { DataUsage } from "@mui/icons-material";
import {
  Box,
  Divider,
  Stack,
  SvgIcon,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";

export interface Props {
  owner: string;
  name: string;
  tagName: string;
  value: TagVariant;
  sx?: SxProps<Theme>;
}

export default function ({
  sx,
  value,
  owner,
  name,
  tagName,
}: Props): JSX.Element {
  return (
    <Box sx={{ padding: "24px", ...sx }}>
      <Stack direction="row" spacing={2}>
        <SvgIcon
          component={DataUsage}
          inheritViewBox
          sx={{ width: "120px", height: "120px" }}
        />
        <Stack direction="column" sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="p" sx={{ fontWeight: "normal" }}>
            {formatImageDisplayName(owner, name)}:{tagName}
          </Typography>
          <Typography variant="caption" component="p" sx={{ color: "#6f777c" }}>
            DIGEST:{value.digestAlgorithm}:{value.digest}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ marginTop: "20px" }}>
            <Stack sx={{ paddingRight: "30px" }}>
              <Typography
                variant="caption"
                component="p"
                sx={{ color: "#6f777c" }}
              >
                OS/ARCH
              </Typography>
              <Typography variant="caption" component="p">
                {value.os}/{value.arch}
              </Typography>
            </Stack>
            <Divider orientation="vertical" />
            <Stack sx={{ paddingRight: "30px" }}>
              <Typography
                variant="caption"
                component="p"
                sx={{ color: "#6f777c" }}
              >
                COMPRESSED SIZE
              </Typography>
              <Typography variant="caption" component="p">
                {value.compressedSize}
              </Typography>
            </Stack>
            <Divider orientation="vertical" />
            <Stack sx={{ paddingRight: "30px" }}>
              <Typography
                variant="caption"
                component="p"
                sx={{ color: "#6f777c" }}
              >
                LAST PUSHED
              </Typography>
              <Typography variant="caption" component="p">
                {value.updated.toString()}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
