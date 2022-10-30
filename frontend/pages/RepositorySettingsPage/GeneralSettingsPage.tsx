import { RepositoryWithDetails, useClient } from "../../client";
import "../../styles/markdown.css";
import { Edit, Lock, Public, Schedule } from "@mui/icons-material";
import {
  Button,
  Card,
  Divider,
  IconButton,
  Link,
  Stack,
  SvgIcon,
  SxProps,
  Tab,
  Tabs,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { NavLink, useParams } from "react-router-dom";
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
        <Tab value="write" label="Write" />
        <Tab value="preview" label="Preview" />
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

function RepositoryCard({
  repository,
  onDescriptionChange,
}: {
  repository: RepositoryWithDetails;
  onDescriptionChange?: (description: string) => void;
}): JSX.Element {
  const [showDescriptionEditor, setShowDescriptionEditor] =
    useState<boolean>(false);

  const [description, setDescription] = useState<string>(
    repository.description
  );

  return (
    <Card>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gridGap: "14px",
        }}
      >
        <Stack>
          <Stack direction="row" alignItems="center" spacing="5px">
            <SvgIcon sx={{ marginRight: "10px" }}>
              {repository.is_private ? <Lock /> : <Public />}
            </SvgIcon>
            <Typography variant="h2">{repository.namespace}</Typography>
            <Typography variant="h2">/</Typography>
            <Typography variant="h2" fontWeight="bold">
              {repository.name}
            </Typography>
          </Stack>
          <Typography variant="h4" sx={{ marginTop: "15px" }}>
            Description
          </Typography>

          {showDescriptionEditor ? (
            <Stack sx={{ marginTop: "10px", maxWidth: "320px" }}>
              <TextField
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
              <Stack
                direction="row"
                justifyContent="flex-end"
                spacing="5px"
                sx={{ marginTop: "15px" }}
              >
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setShowDescriptionEditor(false);
                    setDescription(repository.description);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    onDescriptionChange && onDescriptionChange(description);
                    setShowDescriptionEditor(false);
                  }}
                >
                  Update
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Stack
              direction="row"
              alignItems="center"
              spacing="8px"
              sx={{ marginTop: "10px" }}
            >
              <Typography>{repository.description}</Typography>
              <IconButton
                size="small"
                onClick={() => setShowDescriptionEditor(true)}
              >
                <Edit fontSize="inherit" />
              </IconButton>
            </Stack>
          )}
          <Stack
            direction="row"
            alignItems="center"
            spacing="8px"
            sx={{ marginTop: "15px" }}
          >
            <SvgIcon>
              <Schedule />
            </SvgIcon>
            <Typography variant="body2">
              Last pushed: {repository.last_updated}
            </Typography>
          </Stack>
        </Stack>
        <Stack>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4">Docker commands</Typography>
            <NavLink to={`/r/${repository.namespace}/${repository.name}`}>
              <Button variant="outlined">Public View</Button>
            </NavLink>
          </Stack>
          <Typography variant="body1">
            To push a new tag to this repository,
          </Typography>
          <TextField
            sx={{ marginTop: "15px" }}
            InputProps={{
              sx: {
                color: "white",
                fontWeight: 500,
                backgroundColor: "#445E6E",
              },
              readOnly: true,
            }}
            value={`docker push ${repository.namespace}/${repository.name}:tagname`}
          />
        </Stack>
      </Box>
    </Card>
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

  const submitDescriptionChange = useCallback((value: string) => {
    client.repositories
      .patchRepository(namespace!, repositoryName!, {
        description: value,
      })
      .then((x) => {
        setRepository(x);
        setReadme(x.full_description);
      });
  }, []);

  return (
    <>
      <Stack>
        {repository && (
          <RepositoryCard
            repository={repository}
            onDescriptionChange={(value) => {
              submitDescriptionChange(value);
            }}
          />
        )}
      </Stack>
      <Card>
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
