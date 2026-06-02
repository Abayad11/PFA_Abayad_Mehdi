import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Video } from 'expo-av';

export default function App() {
  const [serverUrl, setServerUrl] = useState('http://192.168.1.10:4000');
  const [tenantId, setTenantId] = useState('chu-casablanca');
  const [email, setEmail] = useState('admin@chu-casablanca.demo');
  const [password, setPassword] = useState('AbharDemo!2025');
  const [code, setCode] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [step, setStep] = useState<'login' | 'mfa' | 'profile'>('login');
  const [message, setMessage] = useState<string | null>(null);
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const apiFetch = (path: string, init?: RequestInit) => {
    const headers: any = { 'Content-Type': 'application/json', 'X-Tenant-Id': tenantId, ...(init?.headers || {}) };
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(`${serverUrl}${path}`, { ...init, headers });
  };

  const onLogin = async () => {
    setMessage(null); setLoading(true);
    try {
      const res = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) { setMessage(data?.message || 'Erreur login'); return; }
      if (data.requiresMfa) { setStep('mfa'); return; }
      setToken(data.access_token || data.token);
      setStep('profile');
    } catch (e: any) {
      setMessage(e?.message || 'Erreur réseau');
    } finally { setLoading(false); }
  };

  const onVerifyMfa = async () => {
    setMessage(null); setLoading(true);
    try {
      const res = await apiFetch('/auth/mfa/verify', { method: 'POST', body: JSON.stringify({ email, password, code }) });
      const data = await res.json();
      if (!res.ok) { setMessage(data?.message || 'Erreur MFA'); return; }
      setToken(data.access_token || data.token);
      setStep('profile');
    } catch (e: any) {
      setMessage(e?.message || 'Erreur réseau');
    } finally { setLoading(false); }
  };

  const loadProfile = async () => {
    setMessage(null); setLoading(true); setMe(null);
    try {
      const res = await apiFetch('/me');
      const data = await res.json();
      if (!res.ok) { setMessage(data?.message || 'Erreur /me'); return; }
      setMe(data);
    } catch (e: any) {
      setMessage(e?.message || 'Erreur réseau');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (step === 'profile' && token) loadProfile();
  }, [step, token]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar style="light" />
      <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
        <Video
          source={require('./assets/vid_background.mp4')}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          resizeMode="cover"
          isLooping
          shouldPlay
          isMuted
        />
        <View style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} />
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: '100%', maxWidth: 420, backgroundColor: 'white', padding: 16, borderRadius: 12, elevation: 6 }}>
            <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 12 }}>
              {step === 'login' ? 'Connexion' : step === 'mfa' ? 'MFA' : 'Profil'}
            </Text>

            {(step === 'login' || step === 'mfa') && (
              <>
                <Text style={{ fontSize: 12, color: '#6b7280' }}>URL serveur API</Text>
                <TextInput value={serverUrl} onChangeText={setServerUrl} placeholder="http://192.168.1.10:4000" style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, height: 44, marginBottom: 8 }} />

                <Text style={{ fontSize: 12, color: '#6b7280' }}>Établissement (tenant)</Text>
                <TextInput value={tenantId} onChangeText={setTenantId} placeholder="chu-casablanca" style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, height: 44, marginBottom: 8 }} />

                <Text style={{ fontSize: 12, color: '#6b7280' }}>Email</Text>
                <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, height: 44, marginBottom: 8 }} />

                <Text style={{ fontSize: 12, color: '#6b7280' }}>Mot de passe</Text>
                <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, height: 44, marginBottom: 12 }} />
              </>
            )}

            {step === 'login' && (
              <View style={{ overflow: 'hidden', borderRadius: 10 }}>
                <Button color="#10b981" title={loading ? 'Connexion…' : 'Se connecter'} onPress={onLogin} disabled={loading} />
              </View>
            )}

            {step === 'mfa' && (
              <>
                <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 8 }}>Code MFA</Text>
                <TextInput value={code} onChangeText={setCode} placeholder="123456" keyboardType="number-pad" style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, height: 44, marginBottom: 12 }} />
                <View style={{ overflow: 'hidden', borderRadius: 10 }}>
                  <Button color="#10b981" title={loading ? 'Vérification…' : 'Vérifier'} onPress={onVerifyMfa} disabled={loading} />
                </View>
              </>
            )}

            {step === 'profile' && (
              <>
                {loading && <ActivityIndicator size="small" color="#10b981" />}
                {me && (
                  <View style={{ backgroundColor: '#f3f4f6', padding: 12, borderRadius: 8 }}>
                    <Text selectable>{JSON.stringify(me, null, 2)}</Text>
                  </View>
                )}
                <View style={{ height: 8 }} />
                <View style={{ overflow: 'hidden', borderRadius: 10 }}>
                  <Button color="#10b981" title="Recharger" onPress={loadProfile} />
                </View>
              </>
            )}

            {!!message && (
              <Text style={{ color: '#dc2626', marginTop: 12 }}>{message}</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
