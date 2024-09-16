"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Suspense } from 'react'

const Page = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");
  const errorCode = "UNAUTHORIZED";
  // const errorCode = "BAD_GATEWAY";

  const { isSuccess } = trpc.authCallback.useQuery(undefined, {
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
  if (isSuccess) {
    // user is synced to db
    router.push(origin ? `/${origin}` : "/dashboard");
  }

  return (
 
      <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  
  );
};


const  AuthCallBack = () => {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <Page />
    </Suspense>
  )
}


export default AuthCallBack;
