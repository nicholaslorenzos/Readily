import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText, Surface } from 'react-native-paper';
import { register } from '../utils/api';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureTextEntryConfirm, setSecureTextEntryConfirm] = useState(true);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      await register(username, email, password);
      navigation.replace('Login');
    } catch (error) {
      setError(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Centered "Create Account" Text */}
      <View style={styles.header}>
        <Text style={styles.title}>Create an Account</Text>
      </View>

      {/* Bottom container for inputs and actions */}
      <Surface style={styles.bottomContainer} elevation={8}>
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={styles.input}
          mode="outlined"
        />
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
        <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={secureTextEntryConfirm}
        right={
            <TextInput.Icon
            icon={secureTextEntryConfirm ? 'eye' : 'eye-off'}
            onPress={() => setSecureTextEntryConfirm(!secureTextEntryConfirm)}
            />
        }
        style={styles.input}
        mode="outlined"
        />
        {error ? <HelperText type="error" visible>{error}</HelperText> : null}

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.registerButton}
          labelStyle={styles.registerButtonText}
        >
          Continue
        </Button>
        <View style={styles.loginContainer}>
          <Text style={styles.unClickableText}>Already have an account?</Text>
          <Text
            style={styles.loginText}
            onPress={() => navigation.navigate('Login')}
          >
            Login here
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
    fontSize: 32,
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
  registerButton: {
    marginTop: 10,
    backgroundColor: '#6200ee',
    paddingVertical: 5,
    borderRadius: 8,
  },
  registerButtonText: {
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  unClickableText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'normal',
  },
  loginText: {
    marginLeft: 5,
    color: '#6200ee',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
