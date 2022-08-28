import { Divider } from "@mui/material";

export default function (): JSX.Element {
  return (
    <Divider
      orientation="vertical"
      sx={{
        border: "none",
        position: "relative",
        marginRight: "10px",
        "::before": {
          content: '" "',
          width: 0,
          height: 0,
          borderTop: "21px solid transparent",
          borderBottom: "21px solid transparent",
          borderLeft: "10px solid rgba(187, 187, 187, 0.3)",
          position: "absolute",
          marginTop: "-21px",
          zIndex: 3,
          marginLeft: "1px",
        },
        "::after": {
          content: '" "',
          width: 0,
          height: 0,
          borderTop: "21px solid transparent",
          borderBottom: "21px solid transparent",
          borderLeft: "10px solid white",
          position: "absolute",
          marginTop: "-21px",
          zIndex: 3,
        },
      }}
    />
  );
}
