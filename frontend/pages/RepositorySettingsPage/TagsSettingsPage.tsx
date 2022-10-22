import { Tag, useClient } from "../../client";
import TagCard from "../../components/TagCard";
import { Clear, Search } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function () {
  const { namespace, repositoryName } = useParams();

  const [tags, setTags] = useState<Tag[]>([]);

  const client = useClient();
  useEffect(() => {
    // TODO: pagination
    client.repositories.getTags(namespace!, repositoryName!).then((page) => {
      setTags(page.results);
    });
  }, []);

  return (
    <>
      <Stack direction="row" alignItems="center">
        <Checkbox />
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
        <Button variant="outlined" color="error" sx={{ textTransform: "none" }}>
          Delete
        </Button>
      </Stack>
      <Stack>
        {tags.map((tag) => (
          <Stack key={tag.digest} direction="row" alignItems="center">
            <Checkbox />
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
    </>
  );
}
