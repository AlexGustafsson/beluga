import { ContentCopyOutlined } from "@mui/icons-material";
import {
  ClickAwayListener,
  IconButton,
  InputAdornment,
  InputProps,
  SxProps,
  TextField,
  Theme,
  Tooltip,
  TooltipProps,
} from "@mui/material";
import { useState } from "react";

export interface Props {
  value: string;
  tooltipTitle: string;
  tooltipPlacement: Pick<TooltipProps, "placement">;
  sx?: SxProps<Theme> & React.CSSProperties;
  InputProps: InputProps;
}

/** A copyable TextField implementation. */
export default function ({
  value,
  tooltipTitle,
  tooltipPlacement,
  sx,
  InputProps,
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
        placement={tooltipPlacement}
        open={copied}
        title={tooltipTitle}
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
            ...sx,
          }}
          InputProps={{
            ...InputProps,
            readOnly: true,
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={copy}>
                  <ContentCopyOutlined
                    sx={{ color: InputProps?.style?.color ?? "inherit" }}
                    fontSize="small"
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        ></TextField>
      </Tooltip>
    </ClickAwayListener>
  );
}
