import { Box, Grid, Typography } from "@mui/material";

import { useAgentState } from "../contexts/MonitorContext";

export function AgentStatus() {
  const agentState = useAgentState();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Queue
          </Typography>
          <Typography variant="h6">{agentState?.queueLength || 0}</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Status
          </Typography>
          <Typography variant="h6">
            {agentState?.isRunning ? "Running" : "Idle"}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Updated
          </Typography>
          <Typography variant="h6">
            {agentState?.lastUpdate
              ? new Date(agentState.lastUpdate).toLocaleTimeString()
              : "-"}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
}
