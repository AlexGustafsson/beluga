export interface Image {
  owner: string;
  name: string;
  updated: Date;
  summary: string;
  downloads: number;
  stars: number;
  tags: string[];
  description?: string;
}

export interface Tag {
  name: string;
  updated: Date;
  variants: TagVariant[];
}

export interface TagVariant {
  digestAlgorithm: string;
  digest: string;
  os: string;
  arch: string;
  compressedSize: number;
  layers?: Layer[];
  name: string;
  updated: Date;
}

export interface Layer {
  command: string;
  size: number;
}

export interface ImageSearchOptions {
  os?: string[];
  arch?: string[];
  page?: number;
  orderBy?: "Suggested" | "Recently Updated";
  query?: string;
}

export interface Paginated<T> {
  page: number;
  pages: number;
  count: number;
  results: T[];
}

export interface ImageFetchOptions {
  includeDescription?: boolean;
}

export interface TagSearchOptions {
  page?: number;
  orderBy?: "Newest" | "Oldest" | "A-Z" | "Z-A";
  query?: string;
}

export interface TagVariantFetchOptions {
  includeLayers?: boolean;
}

export interface Client {
  searchImages(options?: ImageSearchOptions): Promise<Paginated<Image>>;
  searchTags(
    owner: string,
    name: string,
    options?: TagSearchOptions
  ): Promise<Paginated<Tag>>;
  fetchImage(
    owner: string,
    name: string,
    options?: ImageFetchOptions
  ): Promise<Image>;
  fetchTagVariant(
    owner: string,
    name: string,
    digest: string,
    options?: TagVariantFetchOptions
  ): Promise<TagVariant>;
}

const client: Client = {
  async searchImages(options?: ImageSearchOptions) {
    return {
      page: 0,
      pages: 1,
      count: 4,
      results: [
        {
          owner: "_",
          name: "influxdb",
          updated: new Date(),
          summary:
            "InfluxDB is an open source time series database for recording metrics, events, and analytics.",
          tags: ["Linux", "ARM 64", "ARM", "x86-64"],
          downloads: 550000000,
          stars: 1600,
        },
        {
          owner: "nsdlegovdev",
          name: "sunbird-datapipeline",
          updated: new Date(),
          summary: "",
          tags: [],
          downloads: 525010,
          stars: 0,
        },
        {
          owner: "_",
          name: "nginx",
          updated: new Date(),
          summary: "Official build of Nginx.",
          tags: [],
          downloads: 1000000000,
          stars: 10000,
        },
        {
          owner: "foodcoops",
          name: "foodsoft",
          updated: new Date(),
          summary: "Web-based software to manage a non-profit food coop ",
          tags: [],
          downloads: 50000,
          stars: 0,
        },
      ],
    };
  },
  async fetchImage(owner: string, name: string, options?: ImageFetchOptions) {
    return {
      owner: "foodcoops",
      name: "foodsoft",
      updated: new Date(),
      summary: "Web-based software to manage a non-profit food coop ",
      tags: [],
      downloads: 50000,
      stars: 0,
      description: `# Quick reference
* **Maintained by**:<br />
  [the docker community and the mysql team](./)
* Where to get help:
  [the docker bla](./)

## Supported tags and respective \`Dockerfile\` links
* [\`8.0.30\`,\`8.0.30\`,\`8.0.30\`,\`8.0.30\`](./8)
* [\`8.0.30\`,\`8.0.30\`,\`8.0.30\`,\`8.0.30\`](./8)
* [\`8.0.30\`,\`8.0.30\`,\`8.0.30\`,\`8.0.30\`](./8)

## Quick reference (cont.)

## What is MySQL

MySQL is the world's most popular open source database. With its proven performance, reliability and ease-of-use, MySQL has become the leading database choice for web-based applications, covering the entire range from personal projects and websites, via e-commerce and information services, all the way to high profile web properties including Facebook, Twitter, YouTube, Yahoo! and many more.

For more information and related downloads for MySQL Server and other MySQL products, please visit <www.mysql.com>.

![MySQL Logo](https://raw.githubusercontent.com/docker-library/docs/c408469abbac35ad1e4a50a6618836420eb9502e/mysql/logo.png)

\`\`\`shell
Code fence
\`\`\`

> Quote

| Table | Table |
| ----- | ----- |
| Foo | bar |
| Foo | bar |
| Foo | bar |
| Foo | bar |

1. Foo
2. Bar
`,
    };
  },
  async searchTags(owner: string, name: string, options?: TagSearchOptions) {
    return {
      page: 0,
      pages: 1,
      count: 4,
      results: [
        {
          name: "latest",
          updated: new Date(),
          variants: [
            {
              name: "latest",
              updated: new Date(),
              digestAlgorithm: "sha256",
              digest:
                "01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b",
              os: "linux",
              arch: "amd64",
              compressedSize: 55 * 1024 * 1024,
            },
            {
              name: "latest",
              updated: new Date(),
              digestAlgorithm: "sha256",
              digest:
                "4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865",
              os: "linux",
              arch: "386",
              compressedSize: 22 * 1024 * 1024,
            },
          ],
        },
        {
          name: "stable",
          updated: new Date(),
          variants: [
            {
              name: "latest",
              updated: new Date(),
              digestAlgorithm: "sha256",
              digest:
                "01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b",
              os: "linux",
              arch: "amd64",
              compressedSize: 55 * 1024 * 1024,
            },
            {
              name: "latest",
              updated: new Date(),
              digestAlgorithm: "sha256",
              digest:
                "4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865",
              os: "linux",
              arch: "386",
              compressedSize: 22 * 1024 * 1024,
            },
          ],
        },
      ],
    };
  },
  async fetchTagVariant(owner, name, digest): Promise<TagVariant> {
    return {
      name: "stable",
      digestAlgorithm: "sha256",
      digest:
        "4355a46b19d348dc2f57c046f8ef63d4538ebb936000f3c9ee954a27460dd865",
      os: "linux",
      arch: "386",
      compressedSize: 22 * 1024 * 1024,
      updated: new Date(),
      layers: [
        {
          command: "ADD file ... in /",
          size: 48 * 1024 * 1024,
        },
        {
          command: "RUN apt-get update && \\\n\tapt-get install -y curl",
          size: 2 * 1024 * 1024,
        },
        {
          command: "ADD file ... in /",
          size: 48 * 1024 * 1024,
        },
        {
          command: "ADD file ... in /",
          size: 48 * 1024 * 1024,
        },
      ],
    };
  },
};

export function useClient(): Client {
  return client;
}
