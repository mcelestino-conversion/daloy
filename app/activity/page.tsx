import { Suspense } from "react";

import { ActivityList } from "@/components/activity/activity-list";

export default function ActivityPage() {
  return <Suspense fallback={<div className="h-96 rounded-xl bg-surface" aria-label="Loading activity" />}><ActivityList /></Suspense>;
}
