import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function Loader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#156778" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: "center",
  },
});
