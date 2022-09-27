import { Button } from "@mui/material";

export default function (): JSX.Element {
  return (
    <div className="flex flex-col grow" style={{ backgroundColor: "#f7f7f8" }}>
      <header className="bg-white px-6 pt-12 pb-10">
        <h1 className="text-2xl font-medium">Organizations</h1>
      </header>
      <main className="flex flex-col items-center justify-center mt-12">
        <div>
          <h2 className="text-xl font-medium">
            Collaborate on projects with your team
          </h2>
          <p>Bring your developers ...</p>
          <Button variant="contained" sx={{ textTransform: "none" }}>
            Create Organization
          </Button>
        </div>
      </main>
    </div>
  );
}
