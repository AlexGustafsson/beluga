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

export interface ISearchOption<T> {
  title: string;
  value: T;
}

export interface ISearchOptions<T> {
  group: string;
  matches: number;
  options: ISearchOption<T>[];
}

interface Props<T> {
  options: ISearchOptions<T>;
  sx?: SxProps<Theme>;
  placeholder?: string;
  value: string;
  onChange?: (_: string) => void;
  selected: ISearchOption<T> | null;
  onSelectedChange?: (_: ISearchOption<T> | null) => void;
}

/** A search box implementation using a TextField. */
// TODO: currently the component is hard coded to one group.
// We should support multipe, for example by providing a list of ISearchOptions
// and handling that instead.
export default function <T>({
  options,
  sx,
  placeholder,
  onChange,
  value,
  selected,
  onSelectedChange,
}: Props<T>): JSX.Element {
  return (
    <Box>
      <Autocomplete
        value={selected}
        onChange={(_, value) => {
          if (onSelectedChange && typeof value !== "string") {
            onSelectedChange(value);
          }
        }}
        inputValue={value}
        onInputChange={(_, value) => {
          if (onChange) {
            onChange(value);
          }
        }}
        options={options.options}
        freeSolo
        disablePortal
        PopperComponent={CustomPopper}
        disableClearable
        groupBy={() => options.group}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.title
        }
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
          params.children,
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
