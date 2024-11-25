import { useTopics } from "@/hooks/topic";
import { Topic } from "@/types/topic";
import { Box, Select, Spinner, Text } from "@chakra-ui/react";
import React from "react";

interface TopicSelector {
  index: number;
  handleTopicChange: (index: number, selectedTopic: Topic) => void;
  parentId: number | null;
  setSelectedTopics: React.Dispatch<React.SetStateAction<(Topic | null)[]>>;
}

const DATA_DEFAULT_VALUE: Topic[] = [];
export const TopicSelector = ({
  index,
  handleTopicChange,
  setSelectedTopics,
  parentId,
}: TopicSelector) => {
  const { data = DATA_DEFAULT_VALUE, isLoading, isError } = useTopics(parentId);

  React.useEffect(() => {
    if (isLoading || isError) return;
    if (!!data && data.length > 0) return;
    setSelectedTopics((prev) => {
      // remove the last topic
      const newTopics = prev.slice(0, index);
      return [...newTopics];
    });
  }, [isLoading, isError, setSelectedTopics, index, data]);

  return (
    <Box key={index} w="100%">
      {isLoading ? (
        <Spinner size="lg" />
      ) : isError ? (
        <Text color="red.500">Erro ao carregar tópicos</Text>
      ) : (
        <Select
          placeholder={`Selecione ${
            index === 0 ? "um tópico" : "um sub-tópico"
          }`}
          onChange={(e) => {
            const selectedTopic = data?.find(
              (topic) => topic.id === Number(e.target.value)
            );
            if (!selectedTopic) return;
            handleTopicChange(index, selectedTopic);
          }}
          bg="white"
          boxShadow="md"
          borderColor="gray.300"
          _hover={{ borderColor: "blue.400" }}
        >
          {data.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </Select>
      )}
    </Box>
  );
};
