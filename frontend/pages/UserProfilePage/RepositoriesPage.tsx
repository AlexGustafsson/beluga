import { Repository, useClient } from "../../client";
import RepositoryCard from "../../components/RepositoryCard";
import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function (): JSX.Element {
  const { username } = useParams();
  const [repositories, setRepositories] = useState<Repository[]>([]);

  const client = useClient();
  useEffect(() => {
    // TODO: Pagination
    client.repositories.getRepositories(username!).then((x) => {
      setRepositories(x.results);
    });
  }, []);

  return (
    <Stack spacing="15px">
      {repositories.map((repository) => (
        <RepositoryCard
          key={repository.namespace + "/" + repository.name}
          repository={repository}
          showPublisher={true}
          showDownloads={false}
        />
      ))}
    </Stack>
  );
}
