import { Id } from "@/convex/_generated/dataModel";
import ProjectIdView from "@/features/projects/components/project-id-view";

export default async function ProjectIdPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <ProjectIdView projectId={projectId as Id<"projects">} />;
}
