import { CalendarDays, CheckSquare2, Filter, Folder, Globe2, Mail, MessageSquare, Table2, Webhook } from "lucide-react";

import type { AppId } from "@/lib/daloy/types";

const icons = {
  gmail: Mail,
  "google-sheets": Table2,
  "google-calendar": CalendarDays,
  "google-drive": Folder,
  slack: MessageSquare,
  webhooks: Webhook,
  "http-api": Globe2,
  tasks: CheckSquare2,
  filter: Filter,
} satisfies Record<AppId, typeof Mail>;

export function AppIcon({ appId, className = "size-4" }: { appId: AppId; className?: string }) {
  const Icon = icons[appId];
  return <Icon aria-hidden="true" className={className} strokeWidth={1.7} />;
}
