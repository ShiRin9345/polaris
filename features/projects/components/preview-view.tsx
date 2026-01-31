"use client";

import { useState } from "react";
import {
  Loader2Icon,
  TerminalSquareIcon,
  AlertTriangleIcon,
  RefreshCwIcon,
} from "lucide-react";

import { useWebContainer } from "@/features/preview/hooks/use-webcontainer";
import { PreviewSettingsPopover } from "@/features/preview/components/preview-settings-popover";
import { PreviewTerminal } from "@/features/preview/components/preview-terminal";
import { Button } from "@/components/ui/button";
import { useProject } from "../hooks/use-projects";
import { Id } from "@/convex/_generated/dataModel";

export const PreviewView = ({ projectId }: { projectId: Id<"projects"> }) => {
  const project = useProject(projectId);
  const [showTerminal, setShowTerminal] = useState(true);

  const { status, previewUrl, error, restart, terminalOutput } =
    useWebContainer({
      projectId,
      enabled: true,
      settings: project?.settings,
    });

  const isLoading = status === "booting" || status === "installing";

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="h-8.75 flex items-center border-b bg-sidebar shrink-0">
        <Button
          size="sm"
          variant="ghost"
          disabled={isLoading}
          onClick={restart}
          title="Restart container"
        >
          <RefreshCwIcon className="size-3" />
        </Button>

        <div className="flex-1 h-full flex items-center px-3 bg-background border-x text-xs text-muted-foreground truncate font-mono">
          {isLoading && (
            <div className="flex items-center gap-1.5">
              <Loader2Icon className="size-3 animate-spin" />
              {status === "booting" ? "Starting..." : "Installing..."}
            </div>
          )}
          {previewUrl && <span className="truncate">{previewUrl}</span>}
          {error && (
            <div className="flex items-center gap-1.5 text-destructive">
              <AlertTriangleIcon className="size-3" />
              <span className="truncate">{error}</span>
            </div>
          )}
          {!isLoading && !previewUrl && !error && <span>Ready to run</span>}
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="h-full rounded-none"
          title="Toggle terminal"
          onClick={() => setShowTerminal((value) => !value)}
        >
          <TerminalSquareIcon className="size-3" />
        </Button>

        <PreviewSettingsPopover
          projectId={projectId}
          initialValues={project?.settings}
          onSave={restart}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
        {previewUrl ? (
          <iframe src={previewUrl} className="flex-1 border-none bg-white" />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
            {!error ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2Icon className="size-4 animate-spin" />
                <span>Preparing preview environment...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-destructive">
                <AlertTriangleIcon className="size-4" />
                <span>Failed to start preview</span>
              </div>
            )}
          </div>
        )}

        {showTerminal && (
          <div className="h-64 border-t shrink-0">
            <PreviewTerminal output={terminalOutput} />
          </div>
        )}
      </div>
    </div>
  );
};
