import { endpoints } from "@/constants/endpoints";
import { baseApiClient } from "@/services/HttpServices";
import { News } from "@/types/news";

import { useQuery } from "@tanstack/react-query";

const queryKeys = {
  prefix: "news",
  list: () => [queryKeys.prefix, "list"],
};
export type NewsQueryKeys = typeof queryKeys;
export const newsQueryKeys = queryKeys;

export type NewsQueryKey = ReturnType<NewsQueryKeys["list"]>;
const fetchNews = async () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const response = await baseApiClient.get(endpoints.news.list);

  return response.data;
};

export const useNews = () => {
  return useQuery<News[], Error, News[], NewsQueryKey>({
    queryKey: queryKeys.list(),
    queryFn: fetchNews,
  });
};
