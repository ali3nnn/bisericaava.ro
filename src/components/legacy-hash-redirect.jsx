"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// The old site used HashRouter, so bookmarks/shares look like
// `/#/despre-noi`. The hash never reaches the server, so it can't be
// redirected there — map it to the real route on the client instead.
export const LegacyHashRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const match = window.location.hash.match(/^#\/(.+)$/);
    if (match) {
      router.replace("/" + match[1]);
    }
  }, [router]);

  return null;
};
