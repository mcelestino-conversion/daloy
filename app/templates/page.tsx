import { Suspense } from "react";

import { TemplateGallery } from "@/components/templates/template-gallery";

export default function TemplatesPage() {
  return <Suspense fallback={<div className="h-96 rounded-xl bg-surface" aria-label="Loading templates" />}><TemplateGallery /></Suspense>;
}
