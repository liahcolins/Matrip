import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Importante: Para testar no celular físico via Expo Go (na mesma rede Wi-Fi), o IP deve ser o IPv4 local da sua máquina.
// O IP atual do seu Wi-Fi é 192.168.3.9. Se estiver rodando no Emulador Android, descomente a linha do 10.0.2.2
export const API_BASE_URL = Platform.OS === 'android' ? 'http://192.168.3.9:8081/api' : 'http://192.168.3.9:8081/api';

export interface LoginParams {
  email: string;
  senha: string;
}

export interface RegisterParams {
  nome: string;
  email: string;
  cpf: string;
  contato: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  nome: string;
  email: string;
}

export interface UserProfile {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  contato: string;
  tipo: string;
}

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('@Matrip:token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Erro na requisição');
  }

  return response.json();
};

export const authService = {
  async login(params: LoginParams): Promise<AuthResponse> {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async register(params: RegisterParams): Promise<AuthResponse> {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async getProfile(): Promise<UserProfile> {
    return apiFetch('/users/me', {
      method: 'GET',
    });
  },

  async logout() {
    await AsyncStorage.removeItem('@Matrip:token');
    await AsyncStorage.removeItem('@Matrip:user');
  },
  
  async saveAuthData(data: AuthResponse) {
    await AsyncStorage.setItem('@Matrip:token', data.token);
    await AsyncStorage.setItem('@Matrip:user', JSON.stringify({
      nome: data.nome,
      email: data.email
    }));
  },
  
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('@Matrip:token');
    if (!token) return false;

    try {
      const payloadBase64 = token.split('.')[1];
      // Para Base64 no React Native sem atob, podemos usar um helper simples ou buffer.
      // Aqui usaremos uma forma simples para validar a string se precisar.
      // Por simplicidade na migração inicial, assumiremos que se o token existe, ele é válido até falhar na API.
      // Uma biblioteca jwt-decode pode ser adicionada no futuro.
      return true;
    } catch (e) {
      await this.logout();
      return false;
    }
  }
};
