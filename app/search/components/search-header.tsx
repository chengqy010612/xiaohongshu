import React from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native"
import { useRouter } from "expo-router"
import { IconSymbol } from "@/components/ui/icon-symbol"

interface SearchHeaderProps {
  searchText: string
  setSearchText: (text: string) => void
}

export default function SearchHeader({ searchText, setSearchText }: SearchHeaderProps) {
  const router = useRouter()

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <IconSymbol name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.searchBar}>
        <IconSymbol
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="张子枫王梓薇"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.cameraButton}>
          <IconSymbol name="camera-alt" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.searchButton} onPress={() => router.push('/search/result')}>
        <Text style={styles.searchButtonText}>搜索</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  backButton: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 36,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 14,
    color: "#333",
  },
  cameraButton: {
    marginLeft: 8,
  },
  searchButton: {
    marginLeft: 12,
  },
  searchButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
})