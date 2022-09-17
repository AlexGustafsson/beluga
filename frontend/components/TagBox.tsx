import { Image, Tag } from "../client";
import { DataUsage } from "@mui/icons-material";
import {
  Box,
  Divider,
  MenuItem,
  Stack,
  SvgIcon,
  SxProps,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export interface Props {
  namespace: string;
  repositoryName: string;
  tagName: string;
  value: Tag;
  sx?: SxProps<Theme>;
}

export default function ({
  sx,
  value,
  namespace,
  repositoryName,
  tagName,
}: Props): JSX.Element {
  const [digest, setDigest] = useState<string>("");
  const [image, setImage] = useState<Image>();

  useEffect(() => {
    setImage(value.images.find((x) => x.digest === digest));
  }, [digest]);

  useEffect(() => {
    setDigest(value.images[0].digest);
  }, []);

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
            {namespace}/{repositoryName}:{tagName}
          </Typography>
          <Typography variant="caption" component="p" sx={{ color: "#6f777c" }}>
            DIGEST:{digest}
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
              <TextField
                select
                value={digest}
                onChange={(e) => setDigest(e.target.value)}
                variant="standard"
              >
                {value.images.map((x) => (
                  <MenuItem key={x.digest} value={x.digest}>
                    {x.os}/{x.architecture}
                  </MenuItem>
                ))}
              </TextField>
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
                {image?.size}
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
                {image?.last_pushed} by{" "}
                <NavLink
                  to={`/u/${value.last_updated_username}`}
                  className="text-xs text-blue-500 underline"
                >
                  {value.last_updated_username}
                </NavLink>
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
