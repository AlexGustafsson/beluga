import { Search } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  InputAdornment,
  ListItem,
  ListSubheader,
  Popper,
  PopperProps,
  SxProps,
  TextField,
  Theme,
} from "@mui/material";

const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  {
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
];

function CustomPopper(props: PopperProps) {
  return (
    <Popper
      {...props}
      style={{
        ...props.style,
        width: 310,
      }}
      placement="bottom"
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 8],
          },
        },
      ]}
    />
  );
}

export default function ({
  sx,
  placeholder,
}: {
  sx?: SxProps<Theme>;
  placeholder?: string;
}): JSX.Element {
  const options = top100Films.map((option) => {
    const firstLetter = option.title[0].toUpperCase();
    return {
      firstLetter: /\d/.test(firstLetter) ? "0-9" : firstLetter,
      ...option,
    };
  });

  return (
    <Box>
      <Autocomplete
        id="grouped-demo"
        options={options.sort(
          (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
        )}
        freeSolo
        disablePortal
        PopperComponent={CustomPopper}
        disableClearable
        groupBy={(option) => option.firstLetter}
        getOptionLabel={(option) => option.title}
        ListboxProps={{ style: { maxHeight: "418px" } }}
        renderGroup={(params) => [
          <ListSubheader
            key={params.key}
            sx={{
              fontWeight: 400,
              fontSize: 14,
              letterSpacing: "normal",
              color: "#8f9ea8",
              lineHeight: "20px",
              height: "44px",
              padding: "12px",
            }}
          >
            {params.group} (308)
          </ListSubheader>,
          ...(params.children ?? []),
        ]}
        renderOption={(props, option) => (
          <ListItem
            {...props}
            sx={{
              fontWeight: 400,
              fontSize: 14,
            }}
          >
            {option.title}
          </ListItem>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              ...sx,
              p: "8px 12px",
              width: 310,
              input: {
                color: "white",
                fontSize: 14,
              },
            }}
            size="small"
            variant="standard"
            InputProps={{
              ...params.InputProps,
              placeholder,
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "white" }} fontSize="small" />
                </InputAdornment>
              ),
              disableUnderline: true,
            }}
          />
        )}
      />
    </Box>
  );
}
