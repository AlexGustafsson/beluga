import { Tag, useClient } from "../../client";
import TagCard from "../../components/TagCard";
import { Clear, Search } from "@mui/icons-material";
import {
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function (): JSX.Element {
  const { namespace, repositoryName = "_" } = useParams();

  const [pages, setPages] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [results, setResults] = useState<Tag[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);

  const client = useClient();
  useEffect(() => {
    client.repositories
      .getTags(
        namespace!,
        repositoryName,
        undefined,
        undefined,
        undefined,
        page
      )
      .then((x) => {
        setPages(Math.ceil(x.count / x.page_size));
        setResults(x.results);
        setTotalResults(x.count);
      });
  }, [page]);

  return (
    <div className="flex flex-col">
      <header className="flex items-center space-x-4">
        <p className="text-xs">Sort by</p>
        <Select
          defaultValue="newest"
          size="small"
          sx={{ backgroundColor: "#fbfbfc", fontSize: "12px" }}
        >
          <MenuItem value="newest" sx={{ fontSize: "12px" }}>
            Newest
          </MenuItem>
          <MenuItem value="oldest" sx={{ fontSize: "12px" }}>
            Oldest
          </MenuItem>
          <MenuItem value="a-z" sx={{ fontSize: "12px" }}>
            A-Z
          </MenuItem>
          <MenuItem value="z-a" sx={{ fontSize: "12px" }}>
            Z-A
          </MenuItem>
        </Select>
        <TextField
          size="small"
          variant="outlined"
          InputProps={{
            placeholder: "Filter Tags",
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small">
                  <Clear fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: { fontSize: "12px", backgroundColor: "#fbfbfc" },
          }}
        />
      </header>
      <Stack direction="column" spacing={3} sx={{ marginTop: 2 }}>
        {results.map((x) => (
          <TagCard
            key={x.name}
            namespace={namespace!}
            repositoryName={repositoryName}
            value={x}
          />
        ))}
      </Stack>
      <Pagination
        count={pages}
        page={page + 1}
        onChange={(_, page) => setPage(page)}
        shape="rounded"
        showFirstButton
        showLastButton
        sx={{ alignSelf: "center", marginTop: "24px" }}
      />
    </div>
  );
}
