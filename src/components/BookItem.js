import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Surface, Text, IconButton, Divider } from 'react-native-paper';

const BookItem = ({ book, onEdit, onDelete }) => {
  const handleDelete = (bookId) => {
    Alert.alert(
      'Delete Book',
      `Are you sure you want to delete "${book.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => onDelete(bookId),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Surface style={styles.container} elevation={1}>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {book.title}
          </Text>
          <View style={styles.actions}>
            <IconButton
              icon="pencil-outline"
              size={20}
              onPress={() => onEdit(book)}
              style={styles.actionButton}
              iconColor="#6200ee"
            />
            <IconButton
              icon="trash-can-outline"
              size={20}
              onPress={() => handleDelete(book.id)}
              style={styles.actionButton}
              iconColor="#B00020"
            />
          </View>
        </View>

        <Text style={styles.author}>
          by {book.author || 'Unknown Author'}
        </Text>

        {book.isbn && (
          <Text style={styles.isbn}>
            ISBN: {book.isbn}
          </Text>
        )}

        {book.description && (
          <>
            <Divider style={styles.divider} />
            <Text style={styles.description} numberOfLines={3}>
              {book.description}
            </Text>
          </>
        )}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    marginHorizontal: 2,
    borderRadius: 12,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
    color: '#1a1a1a',
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  isbn: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    fontFamily: 'monospace',
  },
  divider: {
    marginVertical: 8,
  },
  description: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    margin: -5, // Reduce the default padding
  },
});

export default BookItem;