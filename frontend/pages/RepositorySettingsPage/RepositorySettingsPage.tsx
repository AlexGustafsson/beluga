import { useClient } from "../../client";
import {
  Backdrop,
  Button,
  Card,
  CardContent,
  CardHeader,
  Fade,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface ModalProps {
  namespace: string;
  repositoryName: string;
  open: boolean;
  onClose: (
    event: {},
    reason: "backdropClick" | "escapeKeyDown" | "canceled" | "confirmed"
  ) => void;
}

function ConfirmDeletePopup({
  open,
  onClose,
  namespace,
  repositoryName,
}: ModalProps): JSX.Element {
  const [confirmedName, setConfirmedName] = useState<string>("");
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
          <Card sx={{ maxWidth: "740px" }}>
            <Stack className="space-y-4">
              <Typography variant="h2">
                Delete Repository:{" "}
                <span className="font-bold">
                  {namespace}/{repositoryName}
                </span>
              </Typography>
              <Typography variant="body1">
                This deletes the repository and all images it contains. This
                cannot be undone.
              </Typography>
              <Typography variant="body1" color="error">
                Please type the name of your repository to confirm deletion:{" "}
                <span className="font-bold">{repositoryName}</span>
              </Typography>
              <TextField
                value={confirmedName}
                variant="standard"
                onChange={(e) => setConfirmedName(e.target.value)}
              />
              <Stack direction="row" className="self-end space-x-6">
                <Button
                  variant="outlined"
                  onClick={() => onClose({}, "canceled")}
                >
                  Cancel
                </Button>
                <Button
                  disabled={confirmedName !== repositoryName}
                  variant="contained"
                  color="error"
                  onClick={() => onClose({}, "confirmed")}
                >
                  Delete
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Box>
      </Fade>
    </Modal>
  );
}

export default function () {
  const { namespace, repositoryName } = useParams();
  const [deletePopupOpen, setDeletePopupOpen] = useState<boolean>(false);

  const client = useClient();
  const navigate = useNavigate();

  const onDeleteModalClose = useCallback((_: {}, reason: string) => {
    setDeletePopupOpen(false);
    if (reason === "confirmed") {
      // TODO: Error handling
      client.repositories
        .deleteRepository(namespace!, repositoryName!)
        .then(() => {
          navigate("/repositories");
        });
    }
  }, []);

  return (
    <Stack>
      <Card>
        <CardHeader
          title={<Typography variant="h4">Delete Repository</Typography>}
        />
        <CardContent>
          <Typography variant="body1">
            Deleting a repository will{" "}
            <span className="font-bold">destroy</span> all images stored within
            it! This action is <span className="font-bold">not reversible</span>
            .
          </Typography>
          <Button
            variant="outlined"
            color="error"
            sx={{ marginTop: "20px" }}
            onClick={() => setDeletePopupOpen(true)}
          >
            Delete repository
          </Button>
        </CardContent>
        <ConfirmDeletePopup
          open={deletePopupOpen}
          onClose={onDeleteModalClose}
          namespace={namespace || ""}
          repositoryName={repositoryName || ""}
        />
      </Card>
    </Stack>
  );
}
