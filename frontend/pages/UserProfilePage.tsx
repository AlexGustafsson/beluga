import "../styles/markdown.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Divider, Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";

export default function (): JSX.Element {
  const { user } = useAuth0();
  const tabs = ["repositories", "starred", "contributed"];
  const tab = "repositories";

  return (
    <div className="flex flex-col grow">
      <header className="flex space-x-4">
        <p>{user?.preferred_username}</p>
      </header>
      <Box
        sx={{
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
      >
        <Tabs value={0}>
          {tabs.map((x) => (
            <Tab
              key={x}
              label={x}
              sx={{ padding: "20px", textTransform: "capitalize" }}
            />
          ))}
        </Tabs>
      </Box>
      <Divider />
      <Box
        sx={{ padding: "12px", backgroundColor: "#f7f7f8", flexGrow: 1 }}
      ></Box>
    </div>
  );
}
