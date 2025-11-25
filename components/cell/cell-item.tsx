import { List } from "@ant-design/react-native";
import { router } from "expo-router";
import React from "react";
import { Text } from 'react-native';

const Item = List.Item;

interface CellItemProps {
    title: string;
  url: Parameters<typeof router.push>[0];
}

export default function CellItem({title, url}: CellItemProps) {
  return (
    <Item
      arrow="horizontal"
      onPress={() => {
        router.push(url);
      }}>
      <Text className="pl-2">{title}</Text>
    </Item>
  );
}
