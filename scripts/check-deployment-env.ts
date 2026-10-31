type Environment = Record<string, string | undefined>;

function normalizeHost(host: string) {
  return host.toLowerCase().replace(/-pooler(?=\.)/, "");
}

export function validateDeploymentEnvironment(env: Environment) {
  for (const key of ["DEPLOY_ENVIRONMENT", "EXPECTED_DATABASE_HOST", "PRODUCTION_DATABASE_HOST", "DATABASE_URL"]) {
    if (!env[key]) throw new Error(`Missing required deployment setting: ${key}`);
  }
  const environment = env.DEPLOY_ENVIRONMENT;
  if (environment !== "staging" && environment !== "production") throw new Error("Unknown deployment environment.");
  const expected = normalizeHost(env.EXPECTED_DATABASE_HOST!);
  const production = normalizeHost(env.PRODUCTION_DATABASE_HOST!);
  if (environment === "staging" && expected === production) throw new Error("Staging must not use the production database.");
  if (environment === "production" && expected !== production) throw new Error("Expected host does not match the registered production database.");

  let database: string | undefined;
  for (const key of ["DATABASE_URL", "DATABASE_URL_UNPOOLED"]) {
    if (!env[key]) continue;
    let url: URL;
    try { url = new URL(env[key]!); } catch { throw new Error(`${key} is not a valid database URL.`); }
    // pg permits connection options in the query string, including host/database
    // overrides. Accept only the standard Neon security flags, exactly once.
    for (const key of url.searchParams.keys()) {
      if (!["sslmode", "channel_binding"].includes(key) || url.searchParams.getAll(key).length !== 1) {
        throw new Error(`${key} is not an allowed unique database URL parameter.`);
      }
    }
    if (!["postgres:", "postgresql:"].includes(url.protocol)) throw new Error(`${key} must use PostgreSQL.`);
    if (!url.hostname.endsWith(".neon.tech")) throw new Error(`${key} must point to Neon.`);
    if (normalizeHost(url.hostname) !== expected) throw new Error(`${key} does not match the expected database endpoint.`);
    if (!["require", "verify-ca", "verify-full"].includes(url.searchParams.get("sslmode") ?? "")) throw new Error(`${key} must require SSL.`);
    if (!url.pathname || url.pathname === "/") throw new Error(`${key} must name a database.`);
    if (database && url.pathname !== database) throw new Error("Pooled and direct URLs must name the same database.");
    database = url.pathname;
  }
}

if (process.argv[1]?.endsWith("check-deployment-env.ts")) {
  try {
    validateDeploymentEnvironment(process.env);
    console.log("Deployment database matches the selected environment.");
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Invalid deployment configuration.");
    process.exitCode = 1;
  }
}
