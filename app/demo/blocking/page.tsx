"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DemoPage() {
  const [loading, setLoading] = useState(false);

  const handleBlocking = async () => {
    setLoading(true);
    await fetch("/api/demo/blocking", { method: "POST" });
    setLoading(false);
  };

  return (
    <div className="p-8 space-x-4">
      <Button disabled={loading} onClick={handleBlocking}>
        {loading ? "Loading..." : "Blocking"}
      </Button>
    </div>
  );
}
