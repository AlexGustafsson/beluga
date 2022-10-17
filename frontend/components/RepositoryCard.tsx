import { Repository, Summary } from "../client";
import { DataUsage } from "@mui/icons-material";
import { Card, Chip, Stack, SvgIcon, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

export interface Props {
  repository?: Repository;
  summary?: Summary;
  showPublisher?: boolean;
  showDownloads?: boolean;
  showStars?: boolean;
}

export default function ({
  repository,
  summary,
  showPublisher = false,
  showDownloads = true,
  showStars = true,
}: Props): JSX.Element {
  const name = repository
    ? repository.namespace + "/" + repository.name
    : summary?.name;
  const updatedAt = repository?.last_updated || summary?.updated_at;
  const description = summary?.short_description;
  const chips = summary?.architectures.map((x) => x.label);
  const stars = repository?.star_count || summary?.star_count;
  const pulls = repository?.pull_count || summary?.pull_count;
  const publisher = repository?.namespace || summary?.publisher;

  return (
    <Card>
      <Stack direction="row" spacing="15px">
        <SvgIcon
          component={DataUsage}
          inheritViewBox
          sx={{ width: "60px", height: "60px" }}
        />
        <Stack className="grow" spacing="14px">
          <Typography fontWeight="medium">{name}</Typography>
          {/* Bump specificity with && */}
          {showPublisher ? (
            <Typography variant="body2" sx={{ "&&": { marginTop: "8px" } }}>
              By{" "}
              <NavLink
                to={`/u/${publisher}`}
                className="text-xs text-blue-500 underline"
              >
                {publisher || ""}
              </NavLink>{" "}
              • Updated {updatedAt}
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ "&&": { marginTop: "8px" } }}>
              Updated {updatedAt}
            </Typography>
          )}
          {description && (
            <Typography variant="body1">{description}</Typography>
          )}
          {chips && (
            <Stack direction="row" spacing="5px">
              {chips.map((x) => (
                <Chip key={x} label={x} size="small" />
              ))}
            </Stack>
          )}
        </Stack>
        <Stack direction="row" spacing="15px">
          {showDownloads && (
            <Stack alignItems="flex-end">
              <Typography fontWeight="medium">{pulls}</Typography>
              <Typography variant="body2">Downloads</Typography>
            </Stack>
          )}
          {showStars && (
            <Stack alignItems="flex-end">
              <Typography fontWeight="medium">{stars}</Typography>
              <Typography variant="body2">Stars</Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
