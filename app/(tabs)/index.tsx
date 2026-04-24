import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type SearchResult = {
  store: string;
  product: string;
  price: number;
  unit_price: number;
  unit_label?: string;
  is_discount: boolean;
  before_price?: number | null;
  last_updated?: string;
};

const QUICK_SEARCHES = ["melk", "ost", "cola", "banan"];

function formatKr(value: number) {
  return `${value.toFixed(2)} kr`;
}

export default function HomeScreen() {
  const [query, setQuery] = useState("melk");
  const [result, setResult] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState("");

  async function search(nextQuery?: string) {
    const searchValue = (nextQuery ?? query).trim();

    if (!searchValue) {
      setResult([]);
      setSearchedQuery("");
      return;
    }

    setQuery(searchValue);
    setSearchedQuery(searchValue);
    setResult([]);

    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:8000/search?q=${encodeURIComponent(searchValue)}`
      );
      const data = await response.json();
      setResult(data.sort((a: SearchResult, b: SearchResult) => a.price - b.price));
    } catch {
      setResult([]);
    } finally {
      setLoading(false);
    }
  }

  const bestResult = result[0];
  const comparedStores = result.length;
  const savings =
    bestResult && bestResult.before_price
      ? (bestResult.before_price - bestResult.price).toFixed(2)
      : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f4ee" }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }}>
        <View
          style={{
            backgroundColor: "#e8dfd1",
            borderRadius: 28,
            padding: 24,
            marginBottom: 18,
            borderWidth: 1,
            borderColor: "#d3c3ab",
          }}
        >
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#f7f4ee",
              borderRadius: 999,
              paddingHorizontal: 12,
              paddingVertical: 7,
              marginBottom: 14,
            }}
          >
            <Text style={{ color: "#5f4b32", fontSize: 12, fontWeight: "700" }}>
              Norway grocery finder
            </Text>
          </View>

          <Text
            style={{
              fontSize: 32,
              fontWeight: "800",
              color: "#1f2937",
              marginBottom: 8,
            }}
          >
            Compare grocery prices
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: "#5b6472",
              lineHeight: 22,
            }}
          >
            Search a product and instantly see where the best deal is right now.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#ffffff",
            borderRadius: 24,
            padding: 18,
            borderWidth: 1,
            borderColor: "#e5ddd0",
            shadowColor: "#3f3a33",
            shadowOpacity: 0.08,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 6 },
            elevation: 3,
            marginBottom: 18,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#5f4b32",
              marginBottom: 8,
            }}
          >
            Search product
          </Text>

          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => search()}
            placeholder="Try melk, ost, cola"
            placeholderTextColor="#9ca3af"
            style={{
              borderWidth: 1,
              borderColor: "#ddd3c3",
              borderRadius: 16,
              padding: 14,
              fontSize: 16,
              color: "#111827",
              backgroundColor: "#faf8f4",
              marginBottom: 12,
            }}
          />

          <Pressable
            onPress={() => search()}
            style={{
              backgroundColor: "#1f3b2f",
              paddingVertical: 14,
              borderRadius: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "800" }}>
              Search
            </Text>
          </Pressable>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 14,
            }}
          >
            {QUICK_SEARCHES.map((item) => (
              <Pressable
                key={item}
                onPress={() => search(item)}
                style={{
                  backgroundColor: "#f3efe7",
                  borderRadius: 999,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: "#ddd3c3",
                }}
              >
                <Text style={{ color: "#5f4b32", fontWeight: "700" }}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {loading && (
          <Text style={{ color: "#5f4b32", marginBottom: 12, fontWeight: "600" }}>
            Searching...
          </Text>
        )}

        {searchedQuery === "" && (
          <Text style={{ color: "#7b7280", marginTop: 8 }}>
            Type a product to search
          </Text>
        )}

        {bestResult && !loading && (
          <View
            style={{
              backgroundColor: "#1f3b2f",
              borderRadius: 24,
              padding: 18,
              marginTop: 8,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: "#d1fae5", fontSize: 13, fontWeight: "700" }}>
              BEST PRICE RIGHT NOW
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 24,
                fontWeight: "800",
                marginTop: 6,
              }}
            >
              {bestResult.store} for {formatKr(bestResult.price)}
            </Text>
            <Text style={{ color: "#d1d5db", marginTop: 6 }}>
              {bestResult.product}
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
              <View
                style={{
                  backgroundColor: "#2b4d3e",
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: "#d1fae5", fontSize: 12 }}>Compared stores</Text>
                <Text style={{ color: "white", fontSize: 18, fontWeight: "800" }}>
                  {comparedStores}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#2b4d3e",
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ color: "#d1fae5", fontSize: 12 }}>Unit price</Text>
                <Text style={{ color: "white", fontSize: 18, fontWeight: "800" }}>
                  {bestResult.unit_price} {bestResult.unit_label ?? "kr/l"}
                </Text>
              </View>
              {savings && (
                <View
                  style={{
                    backgroundColor: "#2b4d3e",
                    borderRadius: 14,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                  }}
                >
                  <Text style={{ color: "#d1fae5", fontSize: 12 }}>You save</Text>
                  <Text style={{ color: "white", fontSize: 18, fontWeight: "800" }}>
                    {savings} kr
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {searchedQuery !== "" && !loading && (
          <Text
            style={{
              color: "#1f2937",
              fontSize: 18,
              fontWeight: "800",
              marginTop: 4,
              marginBottom: 6,
            }}
          >
            Results for: {searchedQuery}
          </Text>
        )}

        {result.length > 0 && !loading && (
          <Text
            style={{
              color: "#6b7280",
              fontSize: 14,
              fontWeight: "600",
              marginBottom: 14,
            }}
          >
            Cheapest stores
          </Text>
        )}

        {!loading && result.length === 0 && searchedQuery !== "" && (
          <Text style={{ color: "#7b7280", marginTop: 8 }}>No products found</Text>
        )}

        {result.map((item, index) => {
          const savedAmount =
            item.before_price && item.is_discount
              ? (item.before_price - item.price).toFixed(2)
              : null;

          return (
            <View
              key={index}
              style={{
                backgroundColor: index === 0 ? "#f3efe7" : "#ffffff",
                borderWidth: 1,
                borderColor: index === 0 ? "#cab89b" : "#e5ddd0",
                borderRadius: 24,
                padding: 16,
                marginBottom: 12,
                shadowColor: "#3f3a33",
                shadowOpacity: 0.06,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 4 },
                elevation: 2,
              }}
            >
              {index === 0 && (
                <View
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: "#8b6f47",
                    borderRadius: 999,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ color: "white", fontSize: 12, fontWeight: "800" }}>
                    Best deal
                  </Text>
                </View>
              )}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "#1f2937",
                      fontSize: 18,
                      fontWeight: "800",
                      marginBottom: 4,
                    }}
                  >
                    {item.store}
                  </Text>

                  <Text style={{ color: "#4b5563", fontSize: 16, marginBottom: 10 }}>
                    {item.product}
                  </Text>
                </View>

                <View
                  style={{
                    backgroundColor: "#faf8f4",
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    borderRadius: 16,
                    minWidth: 96,
                  }}
                >
                  <Text
                    style={{
                      color: "#1f2937",
                      fontSize: 22,
                      fontWeight: "800",
                      textAlign: "right",
                    }}
                  >
                    {item.price}
                  </Text>
                  <Text style={{ color: "#7b7280", textAlign: "right" }}>kr</Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 2,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#f6f1e8",
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    borderRadius: 14,
                  }}
                >
                  <Text style={{ color: "#6b7280", fontSize: 12 }}>Unit price</Text>
                  <Text style={{ color: "#1f2937", fontWeight: "700" }}>
                    {item.unit_price} {item.unit_label ?? "kr/l"}
                  </Text>
                </View>

                {item.before_price && (
                  <View
                    style={{
                      backgroundColor: "#f6f1e8",
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      borderRadius: 14,
                    }}
                  >
                    <Text style={{ color: "#6b7280", fontSize: 12 }}>Before price</Text>
                    <Text style={{ color: "#1f2937", fontWeight: "700" }}>
                      {item.before_price} kr
                    </Text>
                  </View>
                )}

                {item.last_updated && (
                  <View
                    style={{
                      backgroundColor: "#f6f1e8",
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      borderRadius: 14,
                    }}
                  >
                    <Text style={{ color: "#6b7280", fontSize: 12 }}>Last updated</Text>
                    <Text style={{ color: "#1f2937", fontWeight: "700" }}>
                      {item.last_updated}
                    </Text>
                  </View>
                )}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 14,
                }}
              >
                <View
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: item.is_discount ? "#e7f1ea" : "#f3efe7",
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                  }}
                >
                  <Text
                    style={{
                      color: item.is_discount ? "#2f6a49" : "#7b7280",
                      fontWeight: "700",
                    }}
                  >
                    {item.is_discount ? "Discount" : "Normal price"}
                  </Text>
                </View>

                {savedAmount && (
                  <Text style={{ color: "#2f6a49", fontWeight: "700" }}>
                    Save {savedAmount} kr
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
