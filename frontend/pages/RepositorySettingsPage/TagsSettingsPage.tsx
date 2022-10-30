import { Tag, useClient } from "../../client";
import TagCard from "../../components/TagCard";
import { Clear, Search } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Divider,
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

export default function () {
  const { namespace, repositoryName } = useParams();

  const [pages, setPages] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [results, setResults] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const client = useClient();
  useEffect(() => {
    client.repositories
      .getTags(
        namespace!,
        repositoryName!,
        undefined,
        undefined,
        undefined,
        page
      )
      .then((x) => {
        setPages(Math.ceil(x.count / x.page_size));
        setResults(x.results);
      });
  }, [page]);

  return (
    <>
      <Stack direction="row" alignItems="center">
        <Checkbox
          checked={selectedTags.length === results.length}
          onChange={(e) =>
            e.target.checked
              ? setSelectedTags(results.map((x) => x.digest))
              : setSelectedTags([])
          }
        />
        <Stack
          direction="row"
          alignItems="center"
          spacing="10px"
          flexGrow="1"
          marginLeft="20px"
        >
          <p className="text-xs">Sort by</p>
          <Select
            defaultValue="newest"
            size="small"
            sx={{
              backgroundColor: "#fbfbfc",
              fontSize: "12px",
              width: "165px",
            }}
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
            sx={{ backgroundColor: "#fbfbfc" }}
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
              style: { fontSize: "12px" },
            }}
          />
        </Stack>
        <Button
          variant="outlined"
          color="error"
          disabled={selectedTags.length === 0}
        >
          Delete
        </Button>
      </Stack>
      <Stack>
        {results.map((tag) => (
          <Stack key={tag.digest} direction="row" alignItems="center">
            <Checkbox
              checked={selectedTags.includes(tag.digest)}
              onChange={(e) =>
                e.target.checked
                  ? setSelectedTags((x) => [...x, tag.digest])
                  : setSelectedTags((x) => x.filter((y) => y !== tag.digest))
              }
            />
            <TagCard
              namespace={namespace!}
              repositoryName={repositoryName!}
              value={tag}
              sx={{
                marginLeft: "20px",
                flexGrow: "1",
              }}
            />
          </Stack>
        ))}
      </Stack>
      <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
      <Pagination
        count={pages}
        page={page + 1}
        onChange={(_, page) => setPage(page)}
        shape="rounded"
        showFirstButton
        showLastButton
        sx={{ alignSelf: "center", marginTop: "24px", flexGrow: "1" }}
      />
    </>
  );
}
