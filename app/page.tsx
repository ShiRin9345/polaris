"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

export default function Home() {
  const projects = useQuery(api.projects.get);
  const createProject = useMutation(api.projects.create);
  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {projects?.map((project) => (
          <li key={project._id}>
            {project.name} {project.ownerId}
          </li>
        ))}
      </ul>
      <Button onClick={() => createProject({ name: "New Project" })}>
        Create Project
      </Button>
    </div>
  );
}
