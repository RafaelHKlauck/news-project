"use client";
import { useMemo } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { z } from "zod";

export const useTypedRouter = <T extends z.Schema>(schema: T) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();

  const mergedParams = useMemo(() => {
    const searchParamsObj = Object.fromEntries(
      searchParams ? searchParams.entries() : []
    );
    return { ...params, ...searchParamsObj };
  }, [searchParams, params]);

  const parsed = schema.safeParse(mergedParams);
  if (!parsed.success) {
    console.warn("Invalid Router Query", parsed.error);
  }

  return {
    ...router,
    pathname: pathname || "",
    query: mergedParams as z.infer<typeof schema>,
  };
};
