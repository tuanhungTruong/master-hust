import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

// eslint-disable-next-line react/prop-types
export default function Loading({ height = "100vh" } = {}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: height, // Set the height to full viewport height
      }}
    >
      <CircularProgress />
    </Box>
  );
}
