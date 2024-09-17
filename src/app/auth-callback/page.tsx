"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Suspense, useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin") || "/dashboard";
  const errorCode = "UNAUTHORIZED"; // You can switch this to other error codes as needed

  const { isSuccess, isLoading } = trpc.authCallback.useQuery(undefined, {
    retry: (failureCount, error) => {
      if (failureCount > 3) {
        router.push("/");
        return false;
      }
      if (error.data?.code === errorCode) {
        router.push("/sign-in");
        return false;
      }
      return true;
    },
    retryDelay: 500,
  });

  useEffect(() => {
    if (isSuccess) {
      router.push(origin);
    }
  }, [isSuccess, router, origin]);

  if (isLoading) {
    return <Loader />;
  }

  return null;
};

const AuthCallback = () => (
  <Suspense fallback={<Loader />}>
    <Page />
  </Suspense>
);

// Reusable Loader component for fallback
const Loader = () => (
  <div className="w-full mt-24 flex justify-center">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
      <h3 className="font-semibold text-xl">Setting up your account...</h3>
    </div>
  </div>
);

export default AuthCallback;
