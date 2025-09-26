import { Link } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hello, Expo!</Text>
      <TextInput placeholder="Type here..." />
      <TouchableOpacity
        style={{
          backgroundColor: "brown",
          padding: 12,
          borderRadius: 4,
          marginTop: 12,
        }}
      >
        <Text style={{ color: "white" }}>Submit</Text>
      </TouchableOpacity>
      <Link href="/about">Go to About</Link>
    </View>
  );
}
