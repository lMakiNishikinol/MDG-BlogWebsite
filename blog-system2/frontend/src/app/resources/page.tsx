import { getResources } from "@/lib/static-data";
import ResourcesClient from "@/components/resources/ResourcesClient";

export const dynamic = "force-static";

export default function ResourcesPage() {
  const categories = getResources();
  return <ResourcesClient categories={categories} />;
}
