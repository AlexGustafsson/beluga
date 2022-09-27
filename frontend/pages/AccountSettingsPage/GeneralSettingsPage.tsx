import { useClient, User } from "../../client";
import { Button, Card, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

export default function (): JSX.Element {
  const [user, setUser] = useState<User>();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const client = useClient();
  useEffect(() => {
    client.users.getCurrentUser().then((x) => {
      setUser(x);
    });
  }, []);

  const submit = useCallback(() => {
    // TODO: form validation
    setIsSubmitting(true);
    client.users
      .updateCurrentUser({
        company: user?.company || "",
        full_name: user?.full_name || "",
        gravatar_email: user?.gravatar_email || "",
        profile_url: user?.profile_url || "",
        location: user?.location || "",
      })
      .then(() => {
        setIsSubmitting(false);
      })
      .catch(() => {
        setIsSubmitting(false);
      });
  }, [user]);

  if (!user) {
    return <></>;
  }

  return (
    <Card className="flex flex-col p-6 w-full space-y-6">
      <Typography variant="h3">Account Information</Typography>
      <Typography variant="body1">
        This information will be visible to all users of Beluga.
      </Typography>
      <TextField
        placeholder="Full Name"
        value={user.full_name}
        onChange={(e) => setUser((x) => ({ ...x!, full_name: e.target.value }))}
      />
      <TextField
        placeholder="Company"
        value={user.company}
        onChange={(e) => setUser((x) => ({ ...x!, company: e.target.value }))}
      />
      <TextField
        placeholder="Location"
        value={user.location}
        onChange={(e) => setUser((x) => ({ ...x!, location: e.target.value }))}
      />
      <TextField
        placeholder="Website"
        value={user.profile_url}
        onChange={(e) =>
          setUser((x) => ({ ...x!, profile_url: e.target.value }))
        }
      />
      <TextField
        placeholder="Gravatar Email"
        value={user.gravatar_email}
        onChange={(e) =>
          setUser((x) => ({ ...x!, gravatar_email: e.target.value }))
        }
      />
      <Button
        variant="contained"
        className="self-start"
        sx={{ textTransform: "none" }}
        onClick={submit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving" : "Save"}
      </Button>
    </Card>
  );
}
