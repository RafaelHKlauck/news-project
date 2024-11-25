import { endpoints } from "@/constants/endpoints";
import { baseApiClient } from "@/services/HttpServices";
import { Topic } from "@/types/topic";

import { QueryFunctionContext, useQuery } from "@tanstack/react-query";

const queryKeys = {
  prefix: "topics",
  byId: (id: number | null) => [queryKeys.prefix, id],
  userTopics: () => [queryKeys.prefix, "user"],
};
export type TopicQueryKeys = typeof queryKeys;
export const topicQueryKeys = queryKeys;

export type TopicQueryKey = ReturnType<TopicQueryKeys["byId"]>;
const fetchTopics = async (options: QueryFunctionContext<TopicQueryKey>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, id] = options.queryKey;

  const response = id
    ? await baseApiClient.get(endpoints.topics.detail(id))
    : await baseApiClient.get(endpoints.topics.list);

  return response.data;
};

export const useTopics = (id: number | null) => {
  return useQuery<Topic[], Error, Topic[], TopicQueryKey>({
    queryKey: queryKeys.byId(id),
    queryFn: fetchTopics,
  });
};

export type UserTopicsQueryKey = ReturnType<TopicQueryKeys["userTopics"]>;
const fetchUserTopics = async () => {
  const response = await baseApiClient.get(endpoints.topics.user);

  return response.data;
};

export const useUserTopics = () => {
  return useQuery<string[], Error, string[], UserTopicsQueryKey>({
    queryKey: queryKeys.userTopics(),
    queryFn: fetchUserTopics,
  });
};
