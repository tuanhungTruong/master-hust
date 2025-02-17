import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function SortDropdown({ sortType, changeSort }) {
  const handleChange = (e) => {
    changeSort(e.target.value);
  };

  return (
    <FormControl className="w-1/2 h-8">
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={sortType}
        onChange={handleChange}
        className="h-full bg-white"
      >
        <MenuItem value="time">Thời gian</MenuItem>
        <MenuItem value="like">Lượt thích</MenuItem>
      </Select>
    </FormControl>
  );
}
