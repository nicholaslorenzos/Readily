import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText, Surface } from 'react-native-paper';
import { login, checkAuthStatus } from '../utils/api';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  useEffect(() => {
    checkPreviousLogin();
  }, []);

  const checkPreviousLogin = async () => {
    try {
      const { token, user } = await checkAuthStatus();
      if (token && user) {
        navigation.replace('Home');
      }
    } catch (error) {
      console.log('No previous login found');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigation.replace('Home');
    } catch (error) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Centered "Readily" Text */}
      <View style={styles.header}>
        <Text style={styles.title}>Readily</Text>
      </View>

      {/* Bottom container for inputs and actions */}
      <Surface style={styles.bottomContainer} elevation={8}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextEntry}
          right={
            <TextInput.Icon
              icon={secureTextEntry ? 'eye' : 'eye-off'}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            />
          }
          style={styles.input}
          mode="outlined"
        />
        {error ? <HelperText type="error" visible>{error}</HelperText> : null}

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.loginButton}
          labelStyle={styles.loginButtonText}
        >
          Continue
        </Button>
        <View style={styles.registerContainer}>
          <Text style={styles.unClickableText}>Don't have an account?</Text>
          <Text
            style={styles.registerText}
            onPress={() => navigation.navigate('Register')}
          >
            Register here
          </Text>
        </View>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6200ee',
    justifyContent: 'space-between',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  bottomContainer: {
    padding: 40,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  loginButton: {
    marginTop: 10,
    backgroundColor: '#6200ee',
    paddingVertical: 5,
    borderRadius: 8,
  },
  loginButtonText: {
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  unClickableText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'normal',
  },
  registerText: {
    marginLeft: 5,
    color: '#6200ee',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
