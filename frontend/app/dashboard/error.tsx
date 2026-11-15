"use client";

import { startTransition, useEffect } from "react";
import ErrorState from "@/components/shared/ErrorState";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  const retry = () => {
    startTransition(() => {
      router.refresh(); // reload the page

      reset();
    });
  }

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <ErrorState
        title="Something went wrong"
        message="We hit an unexpected error loading this page. You can try again, or come back later."
        onRetry={retry}
      />
    </div>
  );
}