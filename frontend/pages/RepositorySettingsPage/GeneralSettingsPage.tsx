import { Schedule } from "@mui/icons-material";
import { Card, Stack } from "@mui/material";

export default function () {
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
      <Stack direction="row" className="space-x-4">
        <Card className="p-5 grow">
          <h1>Tags and scans</h1>
          <h2>Description</h2>
          <p>
            <Schedule />
            Last pushed: an hour ago
          </p>
        </Card>
        <Card className="p-5">
          <h1>Automated Builds</h1>
          <p>...</p>
        </Card>
      </Stack>
      <Card className="p-5">
        <h1>README</h1>
        <p>Repository description is empty.</p>
      </Card>
    </>
  );
}
