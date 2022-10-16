import { Token, useClient } from "../../client";
import TextFieldCopy from "../../components/TextFieldCopy";
import { useAuth0 } from "@auth0/auth0-react";
import { MoreVert } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Card,
  Checkbox,
  Fade,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

interface ModalProps {
  open: boolean;
  onClose: (
    event: {},
    reason: "backdropClick" | "escapeKeyDown" | "canceled" | "completed"
  ) => void;
}

const tokenPermissionDescriptions: Record<string, string> = {
  "repo:admin":
    "Read, Write, Delete tokens allow you to manage your repositories.",
  "repo:write":
    "Read & Write tokens allow you to push images to any repository managed by your account.",
  "repo:read":
    "Read-only tokens allow you to view, search, and pull images from any public repositories and any private repositories that you have access to.",
  "repo:public_read":
    "Public Repo Read-only tokens allow to view, search, and pull images from any public repositories.",
};

const tokenPermissionNames: Record<string, string> = {
  "repo:admin": "Read, Write, Delete",
  "repo:write": "Read & Write",
  "repo:read": "Read-only",
  "repo:public_read": "Public Repo Read-only",
};

function AccessTokenPopup({ open, onClose }: ModalProps): JSX.Element {
  const [tokenDescription, setTokenDescription] = useState<string>("");
  const [tokenPermissions, setTokenPermissions] =
    useState<string>("repo:admin");
  const [token, setToken] = useState<Token>();
  const { user } = useAuth0();

  const tokenPermissionDescription =
    tokenPermissionDescriptions[tokenPermissions];

  const client = useClient();

  const generate = useCallback(() => {
    client.tokens
      .createAccessToken({
        token_label: tokenDescription,
        scopes: [tokenPermissions],
      })
      .then((token) => {
        setToken(token);
      });
  }, [tokenDescription, tokenPermissionDescription]);

  const copyAndClose = useCallback(() => {
    navigator.clipboard.writeText(token!.token!);
    onClose({}, "completed");
  }, [token]);

  const createTokenCard = token ? (
    <></>
  ) : (
    <Card className="p-6 flex flex-col" sx={{ maxWidth: "740px" }}>
      <Typography variant="h2">New Access Token</Typography>
      <Typography variant="body1">
        A personal access token is similar to a password except you can have
        many tokens and revoke access to each one at any time.
      </Typography>
      <TextField
        required
        variant="standard"
        label="Access Token Description"
        value={tokenDescription}
        sx={{ marginTop: "50px" }}
        onChange={(e) => setTokenDescription(e.target.value)}
      />
      <FormControl sx={{ marginTop: "35px" }}>
        <InputLabel variant="standard" htmlFor="token-permissions">
          Access Permissions
        </InputLabel>
        <Select
          id="token-permissions"
          value={tokenPermissions}
          onChange={(e) => setTokenPermissions(e.target.value)}
          variant="standard"
          className="self-start"
          label="Access Permissions"
        >
          <MenuItem value="repo:admin">Read, Write, Delete</MenuItem>
          <MenuItem value="repo:write">Read &amp; Write</MenuItem>
          <MenuItem value="repo:read">Read-only</MenuItem>
          <MenuItem value="repo:public_read">Public Repo Read-only</MenuItem>
        </Select>
        <FormHelperText id="token-permissions">
          {tokenPermissionDescription}
        </FormHelperText>
      </FormControl>

      <Stack direction="row" className="self-end mt-6 space-x-6">
        <Button
          sx={{ textTransform: "none" }}
          onClick={() => onClose({}, "canceled")}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ textTransform: "none" }}
          onClick={generate}
        >
          Generate
        </Button>
      </Stack>
    </Card>
  );

  const tokenCreatedCard = token ? (
    <Card className="p-6 flex flex-col" sx={{ maxWidth: "740px" }}>
      <Typography variant="h2">Copy Access Token</Typography>
      <Typography variant="body1">
        When logging in from your Docker CLI client, use this token as a
        password.
      </Typography>
      <Typography
        variant="body1"
        sx={{ textTransform: "uppercase", marginTop: "32px" }}
      >
        Access Token Description
      </Typography>
      <Typography variant="body1">{token.token_label}</Typography>
      <Typography
        variant="body1"
        sx={{ textTransform: "uppercase", marginTop: "22px" }}
      >
        Access Permissions
      </Typography>
      <Typography variant="body1" sx={{ marginTop: "6px" }}>
        {tokenPermissionNames[token.scopes[0]]}
      </Typography>
      <Typography variant="body1" fontWeight="600" sx={{ marginTop: "22px" }}>
        To use the access token from your Docker CLI client:
      </Typography>
      <Typography variant="body1" className="mt-2" sx={{ marginTop: "6px" }}>
        1. Run docker login -u {user?.preferred_username}
      </Typography>
      <Typography variant="body1" className="mt-2" sx={{ marginTop: "6px" }}>
        2. At the password prompt, enter the personal access token.
      </Typography>
      <TextFieldCopy
        value={token.token!}
        sx={{ marginTop: "22px", backgroundColor: "#27343B", color: "white" }}
      />
      <Button
        variant="contained"
        sx={{ textTransform: "none", marginTop: "32px" }}
        className="self-end"
        onClick={copyAndClose}
      >
        Copy and Close
      </Button>
    </Card>
  ) : (
    <></>
  );

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box className="flex items-center justify-center absolute w-full h-full">
          {token ? tokenCreatedCard : createTokenCard}
        </Box>
      </Fade>
    </Modal>
  );
}

export default function (): JSX.Element {
  const [tokenModalOpen, setTokenModalOpen] = useState<boolean>(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);

  const client = useClient();
  useEffect(() => {
    // TODO: Pagination
    client.tokens.getAccessTokens().then((x) => {
      setTokens(x.results);
    });
  }, []);

  // TODO: On delete, show delete modal
  // TODO: On edit, show edit modal
  // TODO: On "more" button, show edit modal
  return (
    <Card className="flex flex-col p-6 w-full space-y-6">
      <Stack direction="row" className="justify-between items-center">
        <Typography variant="h3">Access Tokens</Typography>
        {tokens.length > 0 && (
          <Stack direction="row" spacing="18px">
            {selectedTokens.length === 0 && (
              <Button
                variant="contained"
                sx={{ textTransform: "none" }}
                onClick={() => setTokenModalOpen(true)}
              >
                New Access Token
              </Button>
            )}
            {selectedTokens.length > 0 && (
              <Button
                variant="outlined"
                sx={{ textTransform: "none" }}
                color="error"
              >
                Delete
              </Button>
            )}
            {selectedTokens.length === 1 && (
              <Button variant="outlined" sx={{ textTransform: "none" }}>
                Edit
              </Button>
            )}
          </Stack>
        )}
      </Stack>
      {tokens.length == 0 && (
        <Stack
          className="items-center justify-center self-center"
          sx={{
            maxWidth: "520px",
          }}
        >
          <Typography variant="body1" fontWeight="600">
            It looks like you have not created any tokens.
          </Typography>
          <Typography variant="body1" className="text-center">
            Beluga lets you create tokens to authenticate access. Treat personal
            access tokens as alternatives to your password.
          </Typography>
          <Button
            variant="contained"
            sx={{ marginTop: "12px", textTransform: "none" }}
            onClick={() => setTokenModalOpen(true)}
          >
            New Access Token
          </Button>
        </Stack>
      )}
      {tokens.length > 0 && (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={selectedTokens.length === tokens.length}
                    onChange={(e) =>
                      e.target.checked
                        ? setSelectedTokens(tokens.map((x) => x.uuid))
                        : setSelectedTokens([])
                    }
                  />
                </TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Scope</TableCell>
                <TableCell>Last Used</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Active</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tokens.map((token) => (
                <TableRow key={token.uuid}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTokens.includes(token.uuid)}
                      onChange={(e) =>
                        e.target.checked
                          ? setSelectedTokens((x) => [...x, token.uuid])
                          : setSelectedTokens((x) =>
                              x.filter((y) => y !== token.uuid)
                            )
                      }
                    />
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={
                      token.is_active
                        ? {
                            position: "relative",
                            "::before": {
                              content: '" "',
                              position: "absolute",
                              left: 0,
                              top: "calc(50% - 4px)",
                              height: "8px",
                              width: "8px",
                              borderRadius: "50%",
                              backgroundColor: "#54d1b0",
                            },
                          }
                        : { color: "#90a0ac" }
                    }
                  >
                    {token.token_label}
                  </TableCell>
                  <TableCell sx={token.is_active ? {} : { color: "#90a0ac" }}>
                    {tokenPermissionNames[token.scopes[0]]}
                  </TableCell>
                  <TableCell sx={token.is_active ? {} : { color: "#90a0ac" }}>
                    {token.last_used ?? "Never"}
                  </TableCell>
                  <TableCell sx={token.is_active ? {} : { color: "#90a0ac" }}>
                    {token.created_at}
                  </TableCell>
                  <TableCell sx={token.is_active ? {} : { color: "#90a0ac" }}>
                    {token.is_active ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    <IconButton>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <AccessTokenPopup
        open={tokenModalOpen}
        onClose={() => setTokenModalOpen(false)}
      />
    </Card>
  );
}
