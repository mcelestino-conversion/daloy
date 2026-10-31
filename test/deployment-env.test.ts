import assert from "node:assert/strict";
import test from "node:test";
import { validateDeploymentEnvironment } from "../scripts/check-deployment-env";

const production = "ep-production.us-east-2.aws.neon.tech";
const staging = "ep-staging.us-east-2.aws.neon.tech";
const config = {
  DEPLOY_ENVIRONMENT: "staging",
  EXPECTED_DATABASE_HOST: staging,
  PRODUCTION_DATABASE_HOST: production,
  DATABASE_URL: `postgresql://user:secret@ep-staging-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require`,
};
test("deployment guard accepts the intended staging endpoint and equivalent direct URL", () => {
  assert.doesNotThrow(() => validateDeploymentEnvironment({ ...config, DATABASE_URL_UNPOOLED: `postgresql://user:secret@${staging}/neondb?sslmode=verify-full` }));
});
test("deployment guard blocks production credentials in staging even when expected host is misconfigured", () => {
  assert.throws(() => validateDeploymentEnvironment({ ...config, EXPECTED_DATABASE_HOST: production, DATABASE_URL: `postgresql://user:secret@${production}/neondb?sslmode=require` }), /production/);
});
test("deployment guard rejects missing settings, malformed URLs, endpoint mismatches and insecure connections", () => {
  for (const key of ["DEPLOY_ENVIRONMENT", "EXPECTED_DATABASE_HOST", "PRODUCTION_DATABASE_HOST", "DATABASE_URL"]) {
    assert.throws(() => validateDeploymentEnvironment({ ...config, [key]: "" }));
  }
  assert.throws(() => validateDeploymentEnvironment({ ...config, DATABASE_URL: "secret-invalid-url" }), error => error instanceof Error && !error.message.includes("secret-invalid-url"));
  assert.throws(() => validateDeploymentEnvironment({ ...config, EXPECTED_DATABASE_HOST: "different.example.com" }), /match/);
  assert.throws(() => validateDeploymentEnvironment({ ...config, DATABASE_URL: config.DATABASE_URL.replace("sslmode=require", "sslmode=disable") }), /SSL/);
  assert.throws(() => validateDeploymentEnvironment({ ...config, DATABASE_URL_UNPOOLED: `postgresql://user:secret@${production}/neondb?sslmode=require` }), /match/);
});
test("production deployments must use the registered production endpoint", () => {
  assert.throws(() => validateDeploymentEnvironment({ ...config, DEPLOY_ENVIRONMENT: "production" }), /production/);
  assert.doesNotThrow(() => validateDeploymentEnvironment({ ...config, DEPLOY_ENVIRONMENT: "production", EXPECTED_DATABASE_HOST: production, DATABASE_URL: `postgresql://user:secret@${production}/neondb?sslmode=require` }));
});

test("deployment guard rejects driver query overrides and duplicate SSL parameters", () => {
  assert.throws(() => validateDeploymentEnvironment({ ...config, DATABASE_URL: `${config.DATABASE_URL}&host=${production}` }));
  assert.throws(() => validateDeploymentEnvironment({ ...config, DATABASE_URL: `${config.DATABASE_URL}&sslmode=disable` }));
  assert.throws(() => validateDeploymentEnvironment({ ...config, DATABASE_URL: `${config.DATABASE_URL}&dbname=another_database` }));
});
