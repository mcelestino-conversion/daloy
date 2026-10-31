"use server";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { z } from "zod";
import { getWorkspaceRepository } from "./database";
import type { WorkspaceAction } from "../daloy/workspace-state";
import { WorkspaceImportError } from "./workspace-repository";

const cookieName = "daloy-workspace";

export async function loadDatabaseWorkspace(legacy: unknown = undefined) {
  try {
    const jar = await cookies();
    const existing = jar.get(cookieName)?.value;
    const workspaceId = z.uuid().safeParse(existing).success ? existing! : randomUUID();
    const snapshot = await getWorkspaceRepository().load(workspaceId, legacy);
    jar.set(cookieName, workspaceId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 365 });
    return { ok: true as const, snapshot };
  } catch (error) {
    if (error instanceof WorkspaceImportError) return { ok: false as const, error: error.message };
    return { ok: false as const, error: "Could not load your workspace from the database. Please retry." };
  }
}

export async function mutateDatabaseWorkspace(action: WorkspaceAction) {
  try {
    const workspaceId = (await cookies()).get(cookieName)?.value;
    if (!z.uuid().safeParse(workspaceId).success) return { ok: false as const, error: "Your workspace session expired. Reload the page." };
    const snapshot = await getWorkspaceRepository().mutate(workspaceId!, action);
    return { ok: true as const, snapshot };
  } catch {
    return { ok: false as const, error: "Your change could not be saved. Please try it again." };
  }
}
