import { ContentCopyOutlined } from "@mui/icons-material";
import {
  ClickAwayListener,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import { useState } from "react";

export interface Props {
  value: string;
  backgroundColor?: string;
  color?: string;
}

export default function ({
  value,
  backgroundColor,
  color,
}: Props): JSX.Element {
  const [copied, setCopied] = useState<boolean>(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
  }

  return (
    <ClickAwayListener onClickAway={() => setCopied(false)}>
      <Tooltip
        arrow
        placement="top"
        open={copied}
        title="Pull command copied"
        disableFocusListener
        disableHoverListener
        disableTouchListener
        PopperProps={{
          disablePortal: true,
        }}
      >
        <TextField
          value={value}
          variant="standard"
          sx={{
            border: "0",
            backgroundColor,
          }}
          InputProps={{
            readOnly: true,

            disableUnderline: true,
            style: {
              color,
              fontWeight: 600,
              fontSize: "14px",
              paddingTop: "8px",
              paddingBottom: "8px",
              paddingLeft: "12px",
              paddingRight: "0px",
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={copy}>
                  <ContentCopyOutlined sx={{ color }} fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        ></TextField>
      </Tooltip>
    </ClickAwayListener>
  );
}