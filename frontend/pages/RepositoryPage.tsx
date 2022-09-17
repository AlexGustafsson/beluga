import { RepositoryWithDetails, Tag, useClient } from "../client";
import BreadcrumbSeparator from "../components/BreadcrumbSeparator";
import RepositoryBox from "../components/RepositoryBox";
import TagCard from "../components/TagCard";
import TextFieldCopy from "../components/TextFieldCopy";
import "../styles/markdown.css";
import { Clear, Search } from "@mui/icons-material";
import {
  Breadcrumbs,
  Card,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import remarkGfm from "remark-gfm";

function DescriptionPage(): JSX.Element {
  const [repository, setRepository] = useState<RepositoryWithDetails>();

  const client = useClient();
  useEffect(() => {
    client.repositories
      .getRepository("_", "influxdb")
      .then((x) => setRepository(x));
  }, []);

  return (
    <Box
      sx={{ display: "grid", gridTemplateColumns: "1fr auto", gridGap: "14px" }}
    >
      {repository ? (
        <Card sx={{ padding: "24px" }}>
          <ReactMarkdown
            className="markdown"
            remarkPlugins={[remarkGfm]}
            linkTarget="_blank"
          >
            {repository.full_description}
          </ReactMarkdown>
        </Card>
      ) : (
        <Card
          sx={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>No overview available</p>
          <p>This repository doesn't have an overview</p>
        </Card>
      )}

      <Card sx={{ padding: "24px", height: "max-content" }}>
        <Typography
          variant="subtitle1"
          sx={{ marginBottom: "24px", fontWeight: 600 }}
          component="p"
        >
          Docker Pull Command
        </Typography>
        <TextFieldCopy
          value={`docker pull ${repository?.namespace}/${repository?.name}`}
          color="white"
          backgroundColor="#27343B"
        ></TextFieldCopy>
      </Card>
    </Box>
  );
}

function TagsPage({
  namespace,
  repositoryName,
}: {
  namespace: string;
  repositoryName: string;
}): JSX.Element {
  const [pages, setPages] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [results, setResults] = useState<Tag[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);

  const client = useClient();
  useEffect(() => {
    client.repositories.getTags(namespace, repositoryName).then((x) => {
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
      </header>
      <Stack direction="column" spacing={3} sx={{ marginTop: 2 }}>
        {results.map((x) => (
          <TagCard
            key={x.name}
            namespace={namespace}
            repositoryName={repositoryName}
            value={x}
          />
        ))}
      </Stack>
      <Pagination
        count={pages}
        page={page + 1}
        shape="rounded"
        showFirstButton
        showLastButton
        sx={{ alignSelf: "center", marginTop: "24px" }}
      />
    </div>
  );
}

export default function (): JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const { namespace, repositoryName = "_" } = useParams();
  const [tab, setTab] = useState<number>(0);
  const [repository, setRepository] = useState<RepositoryWithDetails>();
  const tabs = ["overview", "tags"];

  function tabChanged(
    event: React.SyntheticEvent<Element, Event>,
    value: number
  ) {
    if (value === 0) {
      setSearchParams({});
    } else {
      setSearchParams({ tab: tabs[value].toLowerCase() });
    }
    setTab(value);
  }

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      const index = tabs.indexOf(tab);
      if (index >= 0) {
        setTab(index);
      } else {
        // Clear bad tabs
        setSearchParams({});
      }
    }
  }, []);

  const pages = [
    <DescriptionPage />,
    <TagsPage namespace={namespace!} repositoryName={repositoryName} />,
  ];

  const client = useClient();
  useEffect(() => {
    client.repositories
      .getRepository("_", "nginx")
      .then((x) => setRepository(x));
  }, []);

  return (
    <div className="flex flex-col grow">
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          paddingLeft: "12px",
          paddingRight: "12px",
          paddingTop: "11px",
          paddingBottom: "11px",
          fontSize: "14px",
        }}
        separator={<BreadcrumbSeparator />}
      >
        <NavLink to="/explore" className="hover:text-blue-500">
          Explore
        </NavLink>
        <p className="text-sm text-blue-500">{`${namespace}/${repositoryName}`}</p>
      </Breadcrumbs>
      <Divider orientation="horizontal" />
      <header className="flex space-x-4">
        {repository ? (
          <RepositoryBox value={repository} sx={{ width: "100%" }} />
        ) : null}
      </header>
      <Box
        sx={{
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
      >
        <Tabs value={tab} onChange={tabChanged}>
          {tabs.map((x) => (
            <Tab
              key={x}
              label={x}
              sx={{ padding: "20px", textTransform: "capitalize" }}
            />
          ))}
        </Tabs>
      </Box>
      <Divider />
      <Box sx={{ padding: "12px", backgroundColor: "#f7f7f8", flexGrow: 1 }}>
        {pages[tab]}
      </Box>
    </div>
  );
}
