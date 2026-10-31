import assert from "node:assert/strict";
import test from "node:test";

import { nextDuplicateName } from "../lib/daloy/workflows";

test("duplicate names advance without colliding with existing flows", () => {
  const names = ["Daily digest", "Daily digest copy", "Daily digest copy 2"];
  assert.equal(nextDuplicateName("Daily digest", names), "Daily digest copy 3");
});

test("duplicate naming starts with a readable copy suffix", () => {
  assert.equal(nextDuplicateName("Daily digest", ["Daily digest"]), "Daily digest copy");
});
