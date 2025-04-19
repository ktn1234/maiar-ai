import { spawn } from "child_process";
import fs from "fs";

const pidFile = ".pid";

/**
 * Terminate existing child process group using PID from file
 */
function terminatePreviousChildProcessGroup() {
  if (fs.existsSync(pidFile)) {
    const pid = parseInt(fs.readFileSync(pidFile, "utf-8").trim(), 10);
    if (!isNaN(pid)) {
      try {
        // Terminate previous child process group
        process.kill(-pid, "SIGTERM");
        console.log(
          `[RESTART] Terminated previous process group with PID: ${pid}`
        );
      } catch (err) {
        console.log(
          `[RESTART] No process group found or unable to terminate PID ${pid}: ${err.message}`
        );
      }
    }
  }
}

/**
 * Start new detached child process and store its PID
 */
function spawnChildProcess() {
  // Spawn detached child process in its own process group with stdio inheritance
  const child = spawn("node", ["dist/index.js"], {
    stdio: "inherit",
    detached: true
  });

  child.on("spawn", () => {
    console.log(`[RESTART] Started new child process with PID: ${child.pid}`);
    // Store the PID of the detached child process in a file
    fs.writeFileSync(pidFile, String(child.pid));
  });

  child.on("error", (err) => {
    console.error("[RESTART] Failed to start child process");
    console.error(err);
  });

  child.on("exit", (code, signal) => {
    console.log(
      `[RESTART] Child process exited with code ${code} and signal ${signal}`
    );
  });

  return child;
}

(async () => {
  try {
    terminatePreviousChildProcessGroup();
    const childProcess = spawnChildProcess();

    const handleExit = () => {
      if (childProcess && childProcess.pid) {
        console.log(
          `\n[RESTART] Terminating current child process group with PID: ${childProcess.pid}`
        );
        try {
          // Terminate the current child process group that was spawned by the parent process
          process.kill(-childProcess.pid, "SIGTERM");
        } catch (err) {
          console.error(
            "[RESTART] Error terminating current child process group"
          );
          console.error(err.message);
        }
      }
      process.exit();
    };

    // Handles common termination signals (Ctrl+C, Ctrl+Z) to terminate the current child process group that was spawned by the parent process
    process.on("SIGINT", handleExit);
    process.on("SIGTSTP", handleExit);
  } catch (err) {
    console.error("[RESTART] Error in restart script");
    console.error(err);
    process.exit(1);
  }
})();
