import { List } from "@ant-design/react-native";
import { router } from "expo-router";
import React from "react";
import { Text } from 'react-native';

export type CellProps = {
  children: React.ReactElement<typeof List.Item> | React.ReactElement<typeof List.Item>[];
};

export default function Cell({ children }: CellProps) {
  return (
    <List
      renderHeader={
        <Text className="text-xl mt-1">
        </Text>
      }>
      {children}
    </List>
  );
}
