import { RepositoryWithDetails, useClient } from "../../client";
import "../../styles/markdown.css";
import { Edit, Schedule } from "@mui/icons-material";
import {
  Button,
  Card,
  Divider,
  IconButton,
  Link,
  Stack,
  SxProps,
  Tab,
  Tabs,
  Theme,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";

function ReadmeEditor({
  value,
  onChange,
  sx,
}: {
  value: string;
  onChange: (value: string) => void;
  sx?: SxProps<Theme>;
}) {
  const [tab, setTab] = useState<string>("write");

  return (
    <Stack sx={sx} className="border-solid border-2">
      <Tabs value={tab} onChange={(_, tab) => setTab(tab)}>
        <Tab value="write" label="Write" sx={{ textTransform: "none" }} />
        <Tab value="preview" label="Preview" sx={{ textTransform: "none" }} />
      </Tabs>
      <Divider />
      {/* TODO: Likely more efficient to just hide preview when not active */}
      {tab === "write" ? (
        <textarea
          rows={10}
          className="p-5 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        ></textarea>
      ) : (
        <ReactMarkdown
          className="markdown p-5"
          remarkPlugins={[remarkGfm]}
          linkTarget="_blank"
        >
          {value}
        </ReactMarkdown>
      )}
    </Stack>
  );
}

export default function () {
  const [showReadmeEdit, setShowReadmeEdit] = useState<boolean>(false);
  const [readme, setReadme] = useState<string>("");
  const [repository, setRepository] = useState<RepositoryWithDetails>();

  const { namespace, repositoryName } = useParams();
  const client = useClient();

  useEffect(() => {
    client.repositories.getRepository(namespace!, repositoryName!).then((x) => {
      setRepository(x);
      setReadme(x.full_description);
    });
  }, []);

  const submitReadmeChange = useCallback(() => {
    client.repositories
      .patchRepository(namespace!, repositoryName!, {
        full_description: readme,
      })
      .then((x) => {
        setRepository(x);
        setShowReadmeEdit(false);
        setReadme(x.full_description);
      });
  }, []);

  const cancelReadmeChange = useCallback(() => {
    setShowReadmeEdit(false);
    setReadme(repository?.full_description || "");
  }, [repository]);

  return (
    <>
      <Stack>
        <Card className="p-5">
          <h1>nginx/nginx</h1>
          <h2>Description</h2>
          <p>
            <Schedule />
            Last pushed: an hour ago
          </p>
        </Card>
      </Stack>
      <Card className="p-5">
        <Stack direction="row" alignItems="center">
          <Typography variant="h4">README</Typography>
          {!showReadmeEdit && (
            <IconButton size="small" onClick={() => setShowReadmeEdit(true)}>
              <Edit fontSize="inherit" />
            </IconButton>
          )}
        </Stack>
        {!showReadmeEdit ? (
          repository?.full_description === "" ? (
            <Typography variant="body1" fontStyle="italic">
              Repository description is empty. Click{" "}
              <Link
                variant="body2"
                sx={{ cursor: "pointer" }}
                onClick={() => setShowReadmeEdit(true)}
              >
                here
              </Link>{" "}
              to edit.
            </Typography>
          ) : (
            <ReactMarkdown
              className="markdown p-5"
              remarkPlugins={[remarkGfm]}
              linkTarget="_blank"
            >
              {repository?.full_description || ""}
            </ReactMarkdown>
          )
        ) : (
          <Stack>
            <ReadmeEditor
              value={readme}
              onChange={(x) => setReadme(x)}
              sx={{ marginTop: "20px" }}
            />
            <Stack
              direction="row"
              spacing="8px"
              alignSelf="flex-end"
              className="mt-5"
            >
              <Button
                variant="outlined"
                color="error"
                onClick={cancelReadmeChange}
              >
                Cancel
              </Button>
              <Button variant="contained" onClick={submitReadmeChange}>
                Update
              </Button>
            </Stack>
          </Stack>
        )}
      </Card>
    </>
  );
}
