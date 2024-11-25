"use client";
import { useState } from "react";
import DynamicTopicSelector from "@/components/DynamicTopicSelector";
import {
  Box,
  Button,
  HStack,
  Input,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Topic } from "@/types/topic";
import { useMutation } from "@tanstack/react-query";
import { baseApiClient } from "@/services/HttpServices";
import { format } from "date-fns";
import React from "react";
import { z } from "zod";
import { useTypedRouter } from "@/hooks/useTypedRoute";

interface SendNewsPayload {
  header: string;
  message: string;
  topic?: string;
  date: string;
}

const writerPage = z.object({
  id: z.string(),
});

const WriterPage = () => {
  const router = useTypedRouter(writerPage);
  const userId = router.query.id;
  const [messageHeader, setMessageHeader] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [isBroadcast, setIsBroadcast] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<Array<Topic | null>>([
    null,
  ]);

  const { mutate: sendNews, isPending: isSending } = useMutation<
    unknown,
    Error,
    SendNewsPayload
  >({
    mutationFn: (payload) => {
      if (!payload.topic) return baseApiClient.post("/broadcast", payload);
      return baseApiClient.post("/write-news", payload);
    },
    onSuccess: () => {
      setMessageHeader("");
      setInputMessage("");
      setSelectedTopics([null]);
    },
  });

  const sendMessage = () => {
    const message = {
      client_id: userId,
      header: messageHeader,
      message: inputMessage,
      topic: isBroadcast
        ? undefined
        : selectedTopics
            .filter((topic) => topic !== null)
            .map((topic) => topic.name)
            .join("."),
      date: format(new Date(), "yyyy-MM-dd"),
    };
    sendNews(message);
  };

  return (
    <Box p={6} bg="gray.50" borderRadius="md" boxShadow="md">
      <VStack spacing={4} align="stretch">
        <Input
          placeholder="Digite um título"
          value={messageHeader}
          onChange={(e) => setMessageHeader(e.target.value)}
          bg="white"
          borderColor="gray.300"
          focusBorderColor="blue.500"
          boxShadow="sm"
        />
        <Input
          placeholder="Digite uma mensagem"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          bg="white"
          borderColor="gray.300"
          focusBorderColor="blue.500"
          boxShadow="sm"
          h="200px"
        />
        <HStack>
          <Switch
            colorScheme="blue"
            isChecked={isBroadcast}
            onChange={() => setIsBroadcast(!isBroadcast)}
          />
          <Text>Enviar para todos os tópicos</Text>
        </HStack>
        {!isBroadcast && (
          <DynamicTopicSelector
            selectedTopics={selectedTopics}
            setSelectedTopics={setSelectedTopics}
          />
        )}

        <HStack spacing={4}>
          <Button
            colorScheme="blue"
            onClick={sendMessage}
            isLoading={isSending}
          >
            Enviar
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default WriterPage;
