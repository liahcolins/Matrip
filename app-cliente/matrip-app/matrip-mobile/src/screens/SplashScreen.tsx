import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { authService } from '../services/auth';

export default function SplashScreen({ navigation }: any) {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(async () => {
      // Após a animação, checamos se o usuário está logado
      const isAuth = await authService.isAuthenticated();
      if (isAuth) {
        navigation.replace('Home');
      } else {
        navigation.replace('Login');
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Text style={styles.logoText}>Matrip</Text>
        <Text style={styles.subText}>Carregando sua próxima aventura...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05313d', // primary color do CSS original
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  subText: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 10,
    fontSize: 14,
  },
});
