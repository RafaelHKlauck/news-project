import React from "react";
import { VStack } from "@chakra-ui/react";
import { TopicSelector } from "./TopicSelector";
import { Topic } from "@/types/topic";

interface DynamicTopicSelectorProps {
  selectedTopics: (Topic | null)[];
  setSelectedTopics: React.Dispatch<React.SetStateAction<(Topic | null)[]>>;
}
const DynamicTopicSelector = ({
  selectedTopics,
  setSelectedTopics,
}: DynamicTopicSelectorProps) => {
  const handleTopicChange = (index: number, selectedTopic: Topic) => {
    setSelectedTopics((prev) => {
      const newTopics = [...prev];
      newTopics[index] = selectedTopic;
      return [...newTopics, null];
    });
  };

  return (
    <VStack gap={4} align="start">
      {selectedTopics.map((topic, index) => {
        return (
          <TopicSelector
            handleTopicChange={handleTopicChange}
            index={index}
            key={index}
            parentId={selectedTopics[index - 1]?.id || null}
            setSelectedTopics={setSelectedTopics}
          />
        );
      })}
    </VStack>
  );
};

export default DynamicTopicSelector;
