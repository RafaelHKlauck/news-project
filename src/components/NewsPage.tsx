"use client";
import { useState, useEffect } from "react";

import {
  Box,
  Button,
  Heading,
  HStack,
  List,
  ListItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import { z } from "zod";
import { useTypedRouter } from "@/hooks/useTypedRoute";
import { News } from "@/types/news";
import { useUserTopics } from "@/hooks/topic";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ensureTimestring } from "@/utils/dateUtils";

const userNewsPage = z.object({
  id: z.string(),
});

interface NewsPageInterface {
  savedNews?: News[];
}
const defaultUserTopics: string[] = [];
const NewsPage = ({ savedNews }: NewsPageInterface) => {
  const router = useTypedRouter(userNewsPage);
  const queryClient = useQueryClient();
  const userId = router.query.id;

  const [messages, setMessages] = useState(savedNews || []);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const { data: userTopics = defaultUserTopics } = useUserTopics();

  useEffect(() => {
    const wsInstance = new WebSocket(`ws://localhost:8765/${userId}`);

    wsInstance.onopen = () => {
      setIsConnected(true);
      console.log("Conexão WebSocket aberta");
    };

    wsInstance.onmessage = (event) => {
      const data: News = JSON.parse(event.data);
      setMessages((prev) => [data, ...prev]);
    };

    wsInstance.onclose = () => {
      setIsConnected(false);
      console.log("Conexão WebSocket fechada");
    };

    setWs(wsInstance);

    return () => {
      console.log("Fechando conexão ao desmontar componente");
      wsInstance.close();
    };
  }, [userId]);

  const closeConnection = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
      setIsConnected(false);
      console.log("Conexão fechada manualmente");
      router.push("/");
      queryClient.invalidateQueries();
    }
  };

  const joinedTopics = userTopics.join(", ");

  return (
    <Box p={6} bg="gray.50" borderRadius="md" boxShadow="md">
      <VStack mb={4}>
        <Heading as="h1" size="lg">
          Notícias
        </Heading>
        <Text>Tópicos: {joinedTopics}</Text>
      </VStack>

      <List
        spacing={3}
        mb={6}
        bg="white"
        p={4}
        borderRadius="md"
        boxShadow="sm"
      >
        {messages.map((message, index) => (
          <ListItem key={index} borderBottom="1px solid #eee" py={2}>
            <strong>{message.header}</strong>
            <br />
            {message.message}
            <br />
            Data: {format(ensureTimestring(message.date), "dd/MM/yyyy")}
          </ListItem>
        ))}
      </List>

      <VStack spacing={4} align="stretch">
        <HStack spacing={4}>
          <Button
            colorScheme="red"
            onClick={closeConnection}
            isDisabled={!isConnected}
          >
            Fechar Conexão
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default NewsPage;
