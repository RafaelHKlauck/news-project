export const endpoints = {
  topics: {
    list: "/topics",
    detail: (id: number | string) => `/topics/${id}`,
    user: "/user-topics",
  },
  news: {
    list: "/news",
  },
};
