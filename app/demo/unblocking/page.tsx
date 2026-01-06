"use client";
import { inngest } from "@/inngest/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function UnblockingPage() {
  const [loading, setLoading] = useState(false);

  const handleBlocking = async () => {
    setLoading(true);
    await inngest.send({ name: "demo/generate" });
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
