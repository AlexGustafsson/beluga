import { ImageWithDetails, Tag, useClient } from "../client";
import BreadcrumbSeparator from "../components/BreadcrumbSeparator";
import TagBox from "../components/TagBox";
import { Box, Breadcrumbs, Card, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

export default function (): JSX.Element {
  const { namespace, repositoryName, tagName, digest } = useParams();

  const [selectedLayer, setSelectedLayer] = useState<number>(0);
  const [images, setImages] = useState<ImageWithDetails[]>();
  const [image, setImage] = useState<ImageWithDetails>();
  const [tag, setTag] = useState<Tag>();

  const client = useClient();
  useEffect(() => {
    if (!namespace || !repositoryName || !tagName) {
      return;
    }

    client.repositories.getTag(namespace, repositoryName, tagName).then((x) => {
      setTag(x);
    });
    client.repositories
      .getImages(namespace, repositoryName, tagName)
      .then((x) => {
        setImages(x);
        setImage(x[0]);
      });
  }, [namespace, repositoryName, digest]);

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
        <NavLink
          to={`/r/${namespace}/${repositoryName}/tags`}
          className="hover:text-blue-500"
        >
          {namespace}/{repositoryName}
        </NavLink>
        <p className="text-sm text-blue-500">
          {namespace}/{repositoryName}
        </p>
      </Breadcrumbs>
      <Divider orientation="horizontal" />
      <header className="flex space-x-4">
        {tag ? (
          <TagBox
            namespace={namespace!}
            repositoryName={repositoryName!}
            sx={{ width: "100%" }}
            value={tag}
            tagName={tag.name}
          />
        ) : null}
      </header>
      <Divider />
      <Box
        sx={{
          padding: "12px",
          backgroundColor: "#f7f7f8",
          flexGrow: 1,
        }}
      >
        <Typography variant="body2" component="p" sx={{ marginBottom: "14px" }}>
          IMAGE LAYERS
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gridGap: "14px",
          }}
        >
          <Card className="relative h-max" sx={{ padding: "0px" }}>
            <ul>
              {image?.layers?.map((x, i) => (
                <li
                  key={i}
                  className={
                    "flex h-10 items-center text-xs cursor-pointer hover:bg-blue-100" +
                    (i === selectedLayer ? " bg-slate-100" : "")
                  }
                  onClick={() => setSelectedLayer(i)}
                >
                  <p className="text-gray-300 w-8 pr-2 text-right z-10 text-sm shrink-0">
                    {i + 1}
                  </p>
                  <code
                    className={
                      "pl-2 pr-4 grow truncate" +
                      (i === selectedLayer ? " font-bold" : "")
                    }
                  >
                    {x.instruction}
                  </code>
                  <code
                    className={
                      "pr-2 shrink-0" +
                      (i === selectedLayer ? " font-bold" : "")
                    }
                  >
                    {x.size}
                  </code>
                  <hr
                    className={
                      "h-full w-2 border-0" +
                      (i === selectedLayer ? " bg-blue-500" : "")
                    }
                  />
                </li>
              ))}
            </ul>
            <div className="absolute top-0 h-full w-8 bg-slate-100"></div>
          </Card>
          <Card sx={{ height: "max-content" }}>
            <Typography
              variant="body2"
              sx={{ marginBottom: "24px" }}
              component="p"
            >
              Command
            </Typography>
            <pre className="whitespace-pre">
              <code className="block bg-slate-600 p-4 text-white font-mono text-xs w-full">
                {image && image.layers
                  ? image.layers[selectedLayer].instruction
                  : null}
              </code>
            </pre>
          </Card>
        </Box>
      </Box>
    </div>
  );
}
