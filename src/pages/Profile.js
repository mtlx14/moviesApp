import { ActivityIndicator, Pressable, TextInput, View, Dimensions } from 'react-native';
import { useState } from 'react';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useAuth } from '../contextAuth';
import { MainFrame } from '../components/MainFrame';
import { TextType1 } from '../components/TextType1';
import { TitleType1 } from '../components/TitleType1';
import { auth } from '../conection';

const windowHeight = Dimensions.get('window').height;

const errorMessages = {
  'auth/invalid-email': 'El correo no es válido.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
  'auth/network-request-failed': 'Sin conexión a internet.',
};

const inputContainerStyle = {
  backgroundColor: 'rgba(1, 1, 1, .1)',
  marginHorizontal: 20,
  height: 40,
  borderRadius: 20,
  marginTop: 10,
  justifyContent: 'center',
  paddingHorizontal: 15,
};

const inputStyle = {
  color: 'rgba(255,255,255,.9)',
  fontSize: 15,
  fontWeight: '500',
  height: '100%',
};

const buttonStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  marginHorizontal: 20,
  height: 40,
  borderRadius: 20,
  marginTop: 20,
  justifyContent: 'center',
};

export default function Profile() {
  const { user, blockedAttempts } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError('Ingresa tu correo y contraseña.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setPassword('');
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(errorMessages[e.code] ?? 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await signOut(auth);
  };

  return (
    <MainFrame>
      <View style={{ paddingTop: windowHeight * 0.15 + 20 }}>
        {user ? (
          <>
            <TextType1 addStyle={{ textAlign: 'left', marginHorizontal: 25 }}>Sesión iniciada como</TextType1>
            <TextType1 addStyle={{ textAlign: 'left', marginHorizontal: 25, marginTop: 5, fontSize: 16 }}>{user.email}</TextType1>
            <Pressable style={buttonStyle} onPress={handleSignOut}>
              <TextType1>Cerrar sesión</TextType1>
            </Pressable>
          </>
        ) : (
          <>
            <View style={inputContainerStyle}>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                placeholder="Correo"
                placeholderTextColor="rgba(255,255,255,0.4)"
                style={inputStyle}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={inputContainerStyle}>
              <TextInput
                secureTextEntry
                textContentType="password"
                placeholder="Contraseña"
                placeholderTextColor="rgba(255,255,255,0.4)"
                style={inputStyle}
                value={password}
                onChangeText={setPassword}
                onSubmitEditing={handleSignIn}
              />
            </View>
            {error && <TextType1 addStyle={{ marginTop: 10, color: 'rgba(255, 120, 120, 0.9)' }}>{error}</TextType1>}
            <Pressable style={buttonStyle} onPress={handleSignIn} disabled={loading}>
              {loading ? <ActivityIndicator color="rgba(255,255,255,.9)" /> : <TextType1>Iniciar sesión</TextType1>}
            </Pressable>
            {blockedAttempts > 0 && (
              <Animated.View key={blockedAttempts} entering={FadeInDown.springify().damping(80).stiffness(150)}>
                <TextType1 addStyle={{ marginTop: 15, marginHorizontal: 20, color: 'rgba(255,255,255,0.6)' }}>Inicia sesión para usar el resto de la app.</TextType1>
              </Animated.View>
            )}
          </>
        )}
      </View>
      <BlurView style={{ width: '100%', height: windowHeight * 0.15, paddingBottom: 10, position: 'absolute', justifyContent: 'flex-end' }}>
        <TitleType1 addStyle={{ marginTop: 0, marginLeft: 25 }}>Perfil</TitleType1>
      </BlurView>
    </MainFrame>
  );
}
