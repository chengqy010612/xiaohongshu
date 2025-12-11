import { PageContainer } from "@/components/page-container";
import SearchHeader from "./components/search-header";
import { useEffect, useMemo, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { SceneMap } from "react-native-tab-view";
import UserList from "./components/user-list";
import { mockWaterfallData, WaterfallItem } from "@/data/mock-data";
import WaterfallFlow from "@/components/waterfall-flow";
import { wait } from "@/utils";
import Tabs from "@/components/custom-tab-view";

type SortKey = "composite" | "latest" | "likes" | "comments" | "collects";
type NoteType = "all" | "video" | "image" | "live";
type PublishRange = "all" | "1d" | "1w" | "6m";
type DistanceRange = "all" | "city" | "near";
type PublishScope = "all" | "watched" | "unwatched" | "followed";

type ExtendedItem = WaterfallItem & {
  publishedAt: number;
  collects: number;
  watched: boolean;
  distance: DistanceRange;
  followed: boolean;
};

const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const createExtended = (): ExtendedItem[] => {
  const now = Date.now();
  return mockWaterfallData.map((item, idx) => ({
    ...item,
    publishedAt: now - getRandomInt(1, 180) * 24 * 60 * 60 * 1000,
    collects: getRandomInt(100, 9000),
    watched: Math.random() < 0.3,
    distance: ["city", "near", "all"][getRandomInt(0, 2)] as DistanceRange,
    followed: Math.random() < 0.4,
    id: `${item.id}-s-${idx}`,
  }));
};

const AllTab = () => {
  const [base, setBase] = useState<ExtendedItem[]>(createExtended());
  const [data, setData] = useState<WaterfallItem[]>(base);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("composite");
  const [noteType, setNoteType] = useState<NoteType>("all");
  const [publishRange, setPublishRange] = useState<PublishRange>("all");
  const [distanceRange, setDistanceRange] = useState<DistanceRange>("all");
  const [publishScope, setPublishScope] = useState<PublishScope>("all");

  const sortedFiltered = useMemo(() => {
    let items = base.slice();
    if (noteType !== "all") {
      const target = noteType === "live" ? "video" : noteType;
      items = items.filter(i => i.type === target);
    }
    if (publishRange !== "all") {
      const now = Date.now();
      const ranges: Record<PublishRange, number> = { all: Infinity, "1d": 1, "1w": 7, "6m": 180 };
      const days = ranges[publishRange];
      items = items.filter(i => (now - i.publishedAt) <= days * 24 * 60 * 60 * 1000);
    }
    if (publishScope !== "all") {
      if (publishScope === "watched") items = items.filter(i => i.watched);
      if (publishScope === "unwatched") items = items.filter(i => !i.watched);
      if (publishScope === "followed") items = items.filter(i => i.followed);
    }
    if (distanceRange !== "all") items = items.filter(i => i.distance === distanceRange);
    switch (sortKey) {
      case "latest":
        items.sort((a,b) => b.publishedAt - a.publishedAt);
        break;
      case "likes":
        items.sort((a,b) => (b.likes || 0) - (a.likes || 0));
        break;
      case "comments":
        items.sort((a,b) => (b.comments || 0) - (a.comments || 0));
        break;
      case "collects":
        items.sort((a,b) => b.collects - a.collects);
        break;
      default:
        break;
    }
    return items.map(({ id, type, image, videoUrl, title, description, user, likes, comments, height }) => ({ id, type, image, videoUrl, title, description, user, likes, comments, height }));
  }, [base, noteType, publishRange, publishScope, distanceRange, sortKey]);

  useEffect(() => {
    setData(sortedFiltered);
  }, [sortedFiltered]);

  const onRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    await wait(800);
    const fresh = createExtended();
    setBase(fresh);
    setHasMore(true);
    setRefreshing(false);
  };

  const onLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await wait(600);
    const more = createExtended().map((i, idx) => ({ ...i, id: `${i.id}-more-${Date.now()}-${idx}` }));
    setBase(prev => [...prev, ...more]);
    setHasMore(base.length < mockWaterfallData.length * 6);
    setLoadingMore(false);
  };

  const resetFilters = () => {
    setSortKey("composite");
    setNoteType("all");
    setPublishRange("all");
    setDistanceRange("all");
    setPublishScope("all");
  };

  const SortChip = ({ label, value }: { label: string; value: SortKey }) => (
    <TouchableOpacity onPress={() => setSortKey(value)} style={[styles.chip, sortKey === value && styles.chipActive]}>
      <Text style={[styles.chipText, sortKey === value && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const OptionChip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={[styles.optionChip, active && styles.optionChipActive]}>
      <Text style={[styles.optionChipText, active && styles.optionChipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortRow}>
          <SortChip label="综合" value="composite" />
          <SortChip label="最新" value="latest" />
          <SortChip label="最多点赞" value="likes" />
          <SortChip label="最多评论" value="comments" />
          <SortChip label="最多收藏" value="collects" />
        </ScrollView>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(v => !v)}>
          <Text style={styles.filterBtnText}>筛选</Text>
        </TouchableOpacity>
      </View>

      {showFilter && (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>笔记类型</Text>
          <View style={styles.panelRow}>
            <OptionChip label="不限" active={noteType === "all"} onPress={() => setNoteType("all")} />
            <OptionChip label="视频" active={noteType === "video"} onPress={() => setNoteType("video")} />
            <OptionChip label="图文" active={noteType === "image"} onPress={() => setNoteType("image")} />
          </View>

          <Text style={styles.panelTitle}>发布时间</Text>
          <View style={styles.panelRow}>
            <OptionChip label="不限" active={publishRange === "all"} onPress={() => setPublishRange("all")} />
            <OptionChip label="一天内" active={publishRange === "1d"} onPress={() => setPublishRange("1d")} />
            <OptionChip label="一周内" active={publishRange === "1w"} onPress={() => setPublishRange("1w")} />
            <OptionChip label="半年内" active={publishRange === "6m"} onPress={() => setPublishRange("6m")} />
          </View>

          <Text style={styles.panelTitle}>发布范围</Text>
          <View style={styles.panelRow}>
            <OptionChip label="不限" active={publishScope === "all"} onPress={() => setPublishScope("all")} />
            <OptionChip label="已看过" active={publishScope === "watched"} onPress={() => setPublishScope("watched")} />
            <OptionChip label="未看过" active={publishScope === "unwatched"} onPress={() => setPublishScope("unwatched")} />
            <OptionChip label="已关注" active={publishScope === "followed"} onPress={() => setPublishScope("followed")} />
          </View>

          <Text style={styles.panelTitle}>位置距离</Text>
          <View style={styles.panelRow}>
            <OptionChip label="不限" active={distanceRange === "all"} onPress={() => setDistanceRange("all")} />
            <OptionChip label="同城" active={distanceRange === "city"} onPress={() => setDistanceRange("city")} />
            <OptionChip label="附近" active={distanceRange === "near"} onPress={() => setDistanceRange("near")} />
          </View>

          <View style={styles.panelFooter}>
            <TouchableOpacity style={styles.resetBtn} onPress={resetFilters}>
              <Text style={styles.resetText}>重置</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.collapseBtn} onPress={() => setShowFilter(false)}>
              <Text style={styles.collapseText}>收起</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <WaterfallFlow
        data={data}
        onRefresh={onRefresh}
        onLoadMore={onLoadMore}
        isRefreshing={refreshing}
        isLoadingMore={loadingMore}
        hasMore={hasMore}
      />
    </View>
  );
};

export default function SearchResult() {
  const [searchText, setSearchText] = useState("")
  const [data] = useState([
    { key: "all", title: "全部", component: () => <AllTab /> },
    { key: "users", title: "用户", component: () => <UserList /> },
    { key: "goods", title: "商品", component: () => <GoodsTab /> },
    { key: "places", title: "地点", component: () => <PlacesTab /> },
  ])

  const GoodsTab = () => (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 8 }}>
      {[1,2,3,4,5,6].map((i) => (
        <View key={i} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f5f5f5" }}>
          <View style={{ width: 64, height: 64, backgroundColor: "#eee", borderRadius: 8, marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, color: "#333" }} numberOfLines={1}>商品标题示例 {i}</Text>
            <Text style={{ fontSize: 12, color: "#999", marginTop: 4 }}>¥{(i * 9.9).toFixed(1)}</Text>
          </View>
          <TouchableOpacity style={{ paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: "#eee", borderRadius: 6 }}>
            <Text style={{ fontSize: 12, color: "#666" }}>查看</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );

  const PlacesTab = () => (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 12, paddingTop: 8 }}>
      {["上海","北京","深圳","成都","杭州"].map((city, idx) => (
        <View key={idx} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f5f5f5" }}>
          <Text style={{ fontSize: 14, color: "#333" }}>{city} · 相关地点</Text>
          <Text style={{ fontSize: 12, color: "#999", marginTop: 4 }}>距离你很近 · 1.2km</Text>
        </View>
      ))}
    </ScrollView>
  );

  // const scenes = {
  //   all: () => <AllTab />,
  //   users: () => <UserList />,
  //   goods: () => <GoodsTab />,
  //   places: () => <PlacesTab />,
  // };

  const handleAskPress = () => {
    console.log("问一问按钮被点击");
    // 这里可以添加问一问按钮的处理逻辑
  };

  return (
    <PageContainer>
      <SearchHeader searchText={searchText} setSearchText={setSearchText} />
      <Tabs
        data={data}
        // 尾部内容
      />
    </PageContainer>
  )
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
    backgroundColor: "#fff",
  },
  sortRow: {
    alignItems: "center",
  },
  chip: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: "#ffe9ed",
  },
  chipText: {
    fontSize: 13,
    color: "#666",
  },
  chipTextActive: {
    color: "#ff2442",
    fontWeight: "600",
  },
  filterBtn: {
    marginLeft: "auto",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterBtnText: {
    fontSize: 14,
    color: "#333",
  },
  panel: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  panelTitle: {
    fontSize: 14,
    color: "#333",
    marginTop: 10,
    marginBottom: 8,
    fontWeight: "500",
  },
  panelRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionChip: {
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  optionChipActive: {
    borderColor: "#ff2442",
    backgroundColor: "#ffe9ed",
  },
  optionChipText: {
    fontSize: 13,
    color: "#666",
  },
  optionChipTextActive: {
    color: "#ff2442",
    fontWeight: "600",
  },
  panelFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
  },
  resetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#f5f5f5",
  },
  resetText: {
    color: "#333",
    fontSize: 14,
  },
  collapseBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  collapseText: {
    color: "#666",
    fontSize: 14,
  },
});
