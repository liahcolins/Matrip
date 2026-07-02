import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, LogOut, User, Mail, Phone, CreditCard } from 'lucide-react-native';
import { authService, type UserProfile } from '../services/auth';

const PRIMARY = '#05313d';
const GRADIENT_END = '#11586a';
const ACCENT = '#2dd4bf';
const DANGER = '#dc2626';

export default function ProfileScreen({ navigation }: any) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        setProfile(data);
      } catch (error) {
        Alert.alert('Sessão expirada', 'Faça login novamente.');
        await authService.logout();
        navigation.replace('Login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [navigation]);

  const handleLogout = async () => {
    await authService.logout();
    navigation.replace('Login');
  };

  return (
    <LinearGradient colors={[PRIMARY, GRADIENT_END]} style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Home')}>
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Meu Perfil</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Main Card */}
      <View style={styles.card}>
        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={PRIMARY} />
          </View>
        ) : profile ? (
          <>
            {/* Avatar */}
            <View style={styles.avatarSection}>
              <LinearGradient colors={[PRIMARY, GRADIENT_END]} style={styles.avatar}>
                <User size={40} color="#fff" />
              </LinearGradient>
              <Text style={styles.name}>{profile.nome}</Text>
              <View style={styles.tipoBadge}>
                <Text style={styles.tipoBadgeText}>{(profile.tipo || 'Usuário').toUpperCase()}</Text>
              </View>
            </View>

            {/* Info List */}
            <View style={styles.infoList}>
              <View style={styles.infoRow}>
                <Mail size={20} color={ACCENT} />
                <View>
                  <Text style={styles.infoLabel}>E-mail</Text>
                  <Text style={styles.infoValue}>{profile.email}</Text>
                </View>
              </View>

              {!!profile.cpf && (
                <View style={styles.infoRow}>
                  <CreditCard size={20} color={ACCENT} />
                  <View>
                    <Text style={styles.infoLabel}>CPF</Text>
                    <Text style={styles.infoValue}>{profile.cpf}</Text>
                  </View>
                </View>
              )}

              {!!profile.contato && (
                <View style={styles.infoRow}>
                  <Phone size={20} color={ACCENT} />
                  <View>
                    <Text style={styles.infoLabel}>Contato</Text>
                    <Text style={styles.infoValue}>{profile.contato}</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <LogOut size={18} color={DANGER} />
              <Text style={styles.logoutText}>Sair da conta</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Não foi possível carregar os dados.</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  backBtn: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  topTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  card: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#64748b', fontSize: 14 },
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', textAlign: 'center' },
  tipoBadge: {
    backgroundColor: 'rgba(5,49,61,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 8,
  },
  tipoBadgeText: { fontSize: 11, fontWeight: '600', color: PRIMARY, letterSpacing: 1 },
  infoList: { flex: 1, gap: 16 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  infoLabel: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  infoValue: { fontSize: 14, fontWeight: '500', color: '#0f172a', marginTop: 2 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 32,
    backgroundColor: 'rgba(220,38,38,0.1)',
  },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: DANGER },
});
