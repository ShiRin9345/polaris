import { Id } from "@/convex/_generated/dataModel";
import { ProjectIdLayout } from "@/features/auth/projects/components/project-id-layout";

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: Id<"projects"> }>;
}) => {
  const { projectId } = await params;
  return <ProjectIdLayout projectId={projectId}>{children}</ProjectIdLayout>;
};

export default Layout;
