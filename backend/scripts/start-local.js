/**
 * Prepares environment (free port, optional Docker) then starts server in the same process
 * so the backend stays running and does not exit when the wrapper ends.
 */
const { execSync } = require("child_process");
const path = require("path");

const PORT = process.env.PORT || 5000;

function tryStopDockerBackend() {
  try {
    execSync("docker stop techstore-backend", { stdio: "pipe" });
    console.log("✓ Stopped Docker container 'techstore-backend' to free port", PORT);
  } catch {
    // OK if not running
  }
}

function freePortOnWindows(port) {
  if (process.platform !== "win32") return;
  try {
    const out = execSync(`netstat -ano | findstr ":${port}" | findstr "LISTENING"`, {
      encoding: "utf8",
    });
    const pids = new Set();
    for (const line of out.split("\n")) {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && /^\d+$/.test(pid) && pid !== "0") pids.add(pid);
    }
    for (const pid of pids) {
      try {
        const info = execSync(`tasklist /FI "PID eq ${pid}" /FO CSV /NH`, {
          encoding: "utf8",
        });
        if (!info.toLowerCase().includes("node.exe")) continue;
        execSync(`taskkill /PID ${pid} /F`, { stdio: "pipe" });
        console.log(`✓ Freed port ${port} (stopped stale node process ${pid})`);
      } catch {
        // ignore
      }
    }
  } catch {
    // port already free
  }
}

function tryStartMongoContainer() {
  try {
    execSync("docker start techstore-mongodb", { stdio: "pipe" });
    console.log("✓ Started Docker container 'techstore-mongodb'");
  } catch {
    console.warn(
      "⚠ Docker MongoDB not started. Using local MongoDB on port 27017 if available."
    );
  }
}

tryStopDockerBackend();
tryStartMongoContainer();
freePortOnWindows(PORT);

// Run server in THIS process (keeps terminal attached, no auto-exit)
require(path.join(__dirname, "..", "server.js"));
