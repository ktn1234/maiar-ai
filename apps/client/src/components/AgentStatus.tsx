import { Grid, Typography } from "@mui/material";

import { useAgentState } from "../contexts/MonitorContext";

export function AgentStatus() {
  const agentState = useAgentState();

  return (
    <Grid container>
      <Grid
        size={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          padding={0}
          fontSize={10}
        >
          Queue
        </Typography>
        <Typography variant="body1" padding={0}>
          {agentState?.queueLength || 0}
        </Typography>
      </Grid>
      <Grid
        size={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          padding={0}
          fontSize={10}
        >
          Status
        </Typography>
        <Typography variant="body1" padding={0}>
          {agentState?.isRunning ? "Running" : "Idle"}
        </Typography>
      </Grid>
      <Grid
        size={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          padding={0}
          fontSize={10}
        >
          Updated
        </Typography>
        <Typography variant="body1" padding={0}>
          {agentState?.lastUpdate
            ? new Date(agentState.lastUpdate).toLocaleTimeString()
            : "-"}
        </Typography>
      </Grid>
    </Grid>
  );
}
