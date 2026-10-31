import { LoaderCircle } from "lucide-react";

export default function LoadingWorkflow() {
  return <div className="grid h-full place-items-center"><LoaderCircle className="size-5 animate-spin text-sandstone" aria-label="Loading workflow" /></div>;
}
