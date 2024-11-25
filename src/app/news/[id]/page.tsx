"use client";

import { Spinner } from "@chakra-ui/react";
import { useNews } from "@/hooks/news";
import NewsPage from "@/components/NewsPage";

const Page = () => {
  const { data: savedNews, isLoading } = useNews();
  if (isLoading) return <Spinner />;
  return <NewsPage savedNews={savedNews} />;
};

export default Page;
