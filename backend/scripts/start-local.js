/**
 * Frees port 5000 (stops Docker backend if running) then starts the local server.
 */
const { execSync, spawn } = require("child_process");
const path = require("path");

const PORT = process.env.PORT || 5000;

function tryStopDockerBackend() {
  try {
    execSync("docker stop techstore-backend", { stdio: "pipe" });
    console.log("✓ Stopped Docker container 'techstore-backend' to free port", PORT);
  } catch {
    // Container not running or Docker unavailable — OK
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
      "⚠ Could not start techstore-mongodb. Start Docker Desktop, then run: docker start techstore-mongodb"
    );
  }
}

tryStopDockerBackend();
tryStartMongoContainer();
freePortOnWindows(PORT);

const serverPath = path.join(__dirname, "..", "server.js");
const child = spawn(process.execPath, [serverPath], {
  stdio: "inherit",
  cwd: path.join(__dirname, ".."),
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 0));
