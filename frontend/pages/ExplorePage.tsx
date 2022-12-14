import { Summary, useClient } from "../client";
import RepositoryCard from "../components/RepositoryCard";
import {
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  ListSubheader,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function (): JSX.Element {
  const operatingSystems = ["Linux", "Windows"];
  const architectures = [
    "ARM",
    "ARM 64",
    "IBM POWER",
    "IBM Z",
    "PowerPC 64 LE",
    "x86",
    "x86-64",
  ];
  const resultsPerPage = 25;

  const [filters, setFilters] = useState<string[]>([]);
  const [pages, setPages] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [results, setResults] = useState<Summary[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);

  function addFilter(filter: string) {
    setFilters((x) => Array.from(new Set([...x, filter])));
  }

  function removeFilter(filter: string) {
    setFilters((x) => x.filter((v) => v !== filter));
  }

  const client = useClient();

  useEffect(() => {
    client.search.getSearch().then((page) => {
      setPages(Math.ceil(page.count / page.page_size));
      setTotalResults(page.count);
      setResults(page.summaries);
    });
  }, [page, filters]);

  return (
    <div
      className="flex grow pr-6 py-12"
      style={{ backgroundColor: "#f7f7f8" }}
    >
      <aside className="w-64">
        <List>
          <ListSubheader sx={{ lineHeight: "21px", background: "none" }}>
            Filters
          </ListSubheader>
          <ListSubheader
            sx={{ fontWeight: 600, lineHeight: "21px", background: "none" }}
          >
            Operating Systems
          </ListSubheader>
          {operatingSystems.map((x) => (
            <ListItem key={x} sx={{ paddingTop: 0, paddingBottom: 0 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.includes(x)}
                    onChange={(e) =>
                      e.target.checked ? addFilter(x) : removeFilter(x)
                    }
                    size="small"
                  />
                }
                label={<Typography fontSize="14px">{x}</Typography>}
              />
            </ListItem>
          ))}
          <ListSubheader
            sx={{ fontWeight: 600, lineHeight: "21px", background: "none" }}
          >
            Architectures
          </ListSubheader>
          {architectures.map((x) => (
            <ListItem key={x} sx={{ paddingTop: 0, paddingBottom: 0 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.includes(x)}
                    onChange={(e) =>
                      e.target.checked ? addFilter(x) : removeFilter(x)
                    }
                    size="small"
                  />
                }
                label={<Typography fontSize="14px">{x}</Typography>}
              />
            </ListItem>
          ))}
        </List>
      </aside>
      <main className="flex flex-col grow">
        <header className="flex justify-between">
          <p className="text-sm">
            {page * resultsPerPage + 1}-{page * resultsPerPage + results.length}{" "}
            of {totalResults} available results.
          </p>
          <Select
            defaultValue="suggested"
            size="small"
            sx={{ backgroundColor: "white", fontSize: "14px" }}
          >
            <MenuItem value="suggested" sx={{ fontSize: "14px" }}>
              Suggested
            </MenuItem>
            <MenuItem value="recentlyUpdated" sx={{ fontSize: "14px" }}>
              Recently Updated
            </MenuItem>
          </Select>
        </header>
        <Stack direction="row" spacing={1} sx={{ minHeight: "32px" }}>
          {filters.map((x) => (
            <Chip
              key={x}
              label={x}
              onDelete={() => {
                removeFilter(x);
              }}
            />
          ))}
        </Stack>
        <Stack
          direction="column"
          spacing="15px"
          sx={{ flexGrow: 1, marginTop: 1 }}
        >
          {results.map((x) => (
            /** TODO: "library" repositories are served on /_/:name */
            <NavLink key={x.name} to={`/r/${x.slug}`}>
              <RepositoryCard summary={x} className="hover:drop-shadow-sm" />
            </NavLink>
          ))}
        </Stack>
        <Divider sx={{ marginTop: 2, marginBottom: 2 }} />
        <Pagination
          count={pages}
          page={page + 1}
          shape="rounded"
          showFirstButton
          showLastButton
          sx={{ alignSelf: "center" }}
          onChange={(_, x) => setPage(x)}
        />
      </main>
    </div>
  );
}
