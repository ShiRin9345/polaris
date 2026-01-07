import { Doc } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { getProjectIcon } from "../utils";
import { formatTimestamp } from "../utils";

interface ProjectItemProps {
  data: Doc<"projects">;
}

export default function ProjectItem({ data }: ProjectItemProps) {
  return (
    <Link
      href={`/projects/${data._id}`}
      className="text-sm text-foreground/60 font-medium hover:text-foreground py-1 flex items-center justify-between w-full group"
    >
      <div className="flex items-center gap-2">
        {getProjectIcon(data)}
        <span className="truncate">{data.name}</span>
      </div>
      <span className="text-xs text-muted-foreground group-hover:text-foreground/60 transition-colors">
        {formatTimestamp(data.updatedAt)}
      </span>
    </Link>
  );
}
