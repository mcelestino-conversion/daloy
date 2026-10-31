import { spawnSync } from "node:child_process";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for integration tests.");
const result = spawnSync(process.execPath, ["--import", "tsx", "--test", "test/database.test.ts"], {
  env: { ...process.env, TEST_DATABASE_URL: process.env.DATABASE_URL },
  stdio: "inherit",
});
process.exitCode = result.status ?? 1;
