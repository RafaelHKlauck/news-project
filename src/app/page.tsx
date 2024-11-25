"use client";
import { baseApiClient } from "@/services/HttpServices";
import { User } from "@/types/user";
import { Button, Input, Text, VStack } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  const { mutate } = useMutation<AxiosResponse<User>>({
    mutationFn: () => {
      return baseApiClient.post("/login", { username: userName });
    },
    onSuccess: (response) => {
      const user = response.data;
      if (user.type === "writer") {
        router.push(`/writer/${user.id}`);
      } else {
        router.push(`/news/${user.id}`);
      }
    },
  });

  return (
    <VStack>
      <Text>Home</Text>
      <Input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Digite seu nome"
      />
      <Button onClick={() => mutate()}>Enviar</Button>
    </VStack>
  );
}
