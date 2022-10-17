import { Repository, RepositoryPage, useClient } from "../../client";
import RepositoryCard from "../../components/RepositoryCard";
import { Divider, Pagination, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

export interface Props {
  category: "owned" | "starred" | "contributed";
}

export default function ({ category }: Props): JSX.Element {
  const { username } = useParams();
  const [pages, setPages] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [results, setResults] = useState<Repository[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);

  const client = useClient();
  useEffect(() => {
    let promise: Promise<RepositoryPage>;
    switch (category) {
      case "owned":
        promise = client.repositories.getRepositories(
          username!,
          undefined,
          page
        );
        break;
      case "starred":
        promise = client.users.getUserStarred(username!, undefined, page);
        break;
      case "contributed":
        promise = client.users.getUserStarred(username!, undefined, page);
        break;
      default:
        return;
    }

    promise.then((page) => {
      setPages(Math.ceil(page.count / page.page_size));
      setPageSize(page.page_size);
      setTotalResults(page.count);
      setResults(page.results);
    });
  }, []);

  return (
    <Stack spacing="24px">
      <Typography>
        Displaying {results.length} of {totalResults} repositories
      </Typography>
      <Stack spacing="15px">
        {results.map((repository) => (
          <NavLink
            to={
              "/r/" +
              encodeURIComponent(repository.namespace) +
              "/" +
              encodeURIComponent(repository.name)
            }
          >
            <RepositoryCard
              key={repository.namespace + "/" + repository.name}
              repository={repository}
              showPublisher={true}
              showDownloads={false}
              className="hover:drop-shadow-sm"
            />
          </NavLink>
        ))}
      </Stack>
      {totalResults > pageSize && (
        <Stack>
          <Divider sx={{ marginBottom: 2 }} />
          <Pagination
            count={pages}
            page={page + 1}
            shape="rounded"
            showFirstButton
            showLastButton
            sx={{ alignSelf: "center" }}
            onChange={(_, x) => setPage(x)}
          />
        </Stack>
      )}
    </Stack>
  );
}
