import React, { useState } from "react";

import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert
} from "react-native";

import {
  createUserWithEmailAndPassword
} from "firebase/auth";

import { auth } from "../services/firebase";

export default function RegisterScreen() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      Alert.alert("Registered Successfully");

    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.container}>

      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
      />

      <Button
        title="Register"
        onPress={handleRegister}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20
  },

  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10
  }
});