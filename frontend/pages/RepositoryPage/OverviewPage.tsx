import { RepositoryWithDetails, useClient } from "../../client";
import TextFieldCopy from "../../components/TextFieldCopy";
import "../../styles/markdown.css";
import { Card, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function (): JSX.Element {
  const [repository, setRepository] = useState<RepositoryWithDetails>();

  const client = useClient();
  useEffect(() => {
    client.repositories
      .getRepository("_", "influxdb")
      .then((x) => setRepository(x));
  }, []);

  return (
    <Box
      sx={{ display: "grid", gridTemplateColumns: "1fr auto", gridGap: "14px" }}
    >
      {repository ? (
        <Card sx={{ padding: "24px" }}>
          <ReactMarkdown
            className="markdown"
            remarkPlugins={[remarkGfm]}
            linkTarget="_blank"
          >
            {repository.full_description}
          </ReactMarkdown>
        </Card>
      ) : (
        <Card
          sx={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>No overview available</p>
          <p>This repository doesn't have an overview</p>
        </Card>
      )}

      <Card sx={{ padding: "24px", height: "max-content" }}>
        <Typography
          variant="subtitle1"
          sx={{ marginBottom: "24px", fontWeight: 600 }}
          component="p"
        >
          Docker Pull Command
        </Typography>
        <TextFieldCopy
          value={`docker pull ${repository?.namespace}/${repository?.name}`}
          tooltipTitle="Pull command copied"
          tooltipPlacement="top"
          sx={{ backgroundColor: "#27343B" }}
          InputProps={{
            style: {
              color: "white",
              fontSize: "14px",
              paddingTop: "8px",
              paddingBottom: "8px",
              paddingLeft: "12px",
              paddingRight: "0px",
              fontWeight: 600,
            },
          }}
        ></TextFieldCopy>
      </Card>
    </Box>
  );
}
