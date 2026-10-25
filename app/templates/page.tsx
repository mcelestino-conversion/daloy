import { Suspense } from "react";

import { TemplateGallery } from "@/components/templates/template-gallery";

export default function TemplatesPage() {
  return <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-surface" />}><TemplateGallery /></Suspense>;
}
