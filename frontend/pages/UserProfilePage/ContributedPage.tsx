import { Repository, useClient } from "../../client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function (): JSX.Element {
  const { username } = useParams();
  const [repositories, setRepositories] = useState<Repository[]>([]);

  const client = useClient();
  useEffect(() => {
    // TODO: Pagination
    client.users.getUserContributed(username!).then((x) => {
      setRepositories(x.results);
    });
  }, []);

  // TODO: Use a card. There are too many box, card variations, hard to maintain
  return (
    <>
      {repositories.map((repository) => (
        <p>{repository.name}</p>
      ))}
    </>
  );
}
