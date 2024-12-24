import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, StatusBar } from 'react-native';
import { Searchbar, FAB, Portal, Modal, TextInput, Button, Text, IconButton, Surface } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BookItem from '../components/BookItem';
import { getBooks, searchBooks, addBook, updateBook, deleteBook } from '../utils/api';

const HomeScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [bookIsbn, setBookIsbn] = useState('');
  const [bookDescription, setBookDescription] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (error) {
      setError('Failed to load books');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBooks();
    setRefreshing(false);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    try {
      if (query.trim()) {
        const results = await searchBooks(query);
        setBooks(results);
      } else {
        loadBooks();
      }
    } catch (error) {
      setError('Search failed');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.replace('Login');
    } catch (error) {
      setError('Logout failed');
    }
  };

  const resetForm = () => {
    setBookTitle('');
    setBookAuthor('');
    setBookIsbn('');
    setBookDescription('');
    setEditingBook(null);
  };

  const showModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setBookTitle(book.title);
      setBookAuthor(book.author || '');
      setBookIsbn(book.isbn || '');
      setBookDescription(book.description || '');
    } else {
      resetForm();
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!bookTitle.trim()) {
      setError('Title is required');
      return;
    }

    const bookData = {
      title: bookTitle.trim(),
      author: bookAuthor.trim(),
      isbn: bookIsbn.trim(),
      description: bookDescription.trim()
    };

    try {
      setLoading(true);
      if (editingBook) {
        await updateBook(editingBook.id, bookData);
      } else {
        await addBook(bookData);
      }
      setModalVisible(false);
      resetForm();
      loadBooks();
    } catch (error) {
      setError(editingBook ? 'Update failed' : 'Add failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    try {
      await deleteBook(bookId);
      loadBooks();
    } catch (error) {
      setError('Delete failed');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <Surface style={styles.header} elevation={2}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Readily</Text>
          <IconButton
            icon="logout"
            size={24}
            onPress={handleLogout}
            style={styles.logoutButton}
          />
        </View>
      </Surface>

      {/* Search Bar */}
      <Surface style={styles.searchContainer} elevation={1}>
        <Searchbar
          placeholder="Search books..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor="#666"
          placeholderTextColor="#999"
        />
      </Surface>

      {/* Books List */}
      <FlatList
        data={books}
        renderItem={({ item }) => (
          <BookItem
            book={item}
            onEdit={showModal}
            onDelete={handleDelete}
          />
        )}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            tintColor="#6200ee"
          />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No books found</Text>
            <Text style={styles.emptySubtext}>Add some books to your collection!</Text>
          </View>
        )}
      />

      {/* Add/Edit Book Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => {
            setModalVisible(false);
            resetForm();
          }}
          contentContainerStyle={styles.modalContent}
          dismissable={false}
        >
          <Surface style={styles.modalSurface}>
            <Text style={styles.modalTitle}>
              {editingBook ? 'Edit Book' : 'Add New Book'}
            </Text>
            
            <TextInput
              label="Title"
              value={bookTitle}
              onChangeText={setBookTitle}
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Author"
              value={bookAuthor}
              onChangeText={setBookAuthor}
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="ISBN"
              value={bookIsbn}
              onChangeText={setBookIsbn}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
            />
            
            <TextInput
              label="Description"
              value={bookDescription}
              onChangeText={setBookDescription}
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textArea]}
              mode="outlined"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                loading={loading}
                disabled={loading}
                style={[styles.modalButton, styles.saveButton]}
              >
                {editingBook ? 'Update' : 'Add'}
              </Button>
            </View>
          </Surface>
        </Modal>
      </Portal>

      {/* FAB */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => showModal()}
        label="Add Book"
        extended
        color='white'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  searchBar: {
    elevation: 0,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    fontSize: 16,
  },
  list: {
    padding: 15,
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    backgroundColor: '#6200ee',
  },
  modalContent: {
    margin: 20,
  },
  modalSurface: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 15,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6200ee',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  modalButton: {
    marginLeft: 10,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#6200ee',
  },
  error: {
    color: '#B00020',
    marginTop: 10,
  },
  logoutButton: {
    margin: 0,
  },
});

export default HomeScreen;