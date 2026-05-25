import React, { useState, useEffect } from "react";

import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import { auth, db } from "../services/firebase";

import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

import { signOut } from "firebase/auth";

export default function HomeScreen() {

  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "notes"),
      (snapshot) => {

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setNotes(data);
      }
    );

    return unsubscribe;

  }, []);

  const addNote = async () => {

    if (editingId) {

      await updateDoc(doc(db, "notes", editingId), {
        text: note
      });

      setEditingId(null);

    } else {

      await addDoc(collection(db, "notes"), {
        text: note
      });

    }

    setNote("");
  };

  const deleteNote = async (id) => {
    await deleteDoc(doc(db, "notes", id));
  };

  const editNote = (item) => {
    setNote(item.text);
    setEditingId(item.id);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <View style={styles.container}>

      <Button title="Logout" onPress={logout} />

      <TextInput
        placeholder="Enter note"
        style={styles.input}
        value={note}
        onChangeText={setNote}
      />

      <Button
        title={editingId ? "Update Note" : "Add Note"}
        onPress={addNote}
      />

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.noteBox}>

            <Text>{item.text}</Text>

            <View style={styles.buttons}>

              <TouchableOpacity
                onPress={() => editNote(item)}
              >
                <Text>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => deleteNote(item.id)}
              >
                <Text>Delete</Text>
              </TouchableOpacity>

            </View>

          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    marginTop: 40
  },

  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10
  },

  noteBox: {
    borderWidth: 1,
    padding: 10,
    marginTop: 10
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10
  }

});