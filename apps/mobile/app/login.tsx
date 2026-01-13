import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { createApiClient, createAuthService } from "@digital-barbershop/shared-api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { LoginRequest } from "@digital-barbershop/shared-types";

// Storage adapter for React Native
const asyncStorageAdapter = {
  getItem: async (key: string) => await AsyncStorage.getItem(key),
  setItem: async (key: string, value: string) => await AsyncStorage.setItem(key, value),
  removeItem: async (key: string) => await AsyncStorage.removeItem(key),
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8082/api/v1";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const navigationAdapter = {
    navigate: (path: string) => router.push(path as any),
  };

  const apiClient = createApiClient({
    baseURL: API_BASE_URL,
    storage: asyncStorageAdapter,
    navigation: navigationAdapter,
  });

  const authService = createAuthService(apiClient);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const loginRequest: LoginRequest = { email, password };
      const response = await authService.login(loginRequest);

      if (response.statusCode === 200 && response.data) {
        await AsyncStorage.setItem("accessToken", response.data.accessToken);
        await AsyncStorage.setItem("refreshToken", response.data.refreshToken);
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

        Alert.alert("Success", "Login successful!");
        router.replace("/dashboard" as any);
      } else {
        Alert.alert("Error", response.message || "Login failed");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "An error occurred during login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />
      
      <Pressable 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleLogin} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1a1a1a",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});


