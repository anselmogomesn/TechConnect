import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@agenda_contatos';

export default function App() {
  const [contatos, setContatos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  // Carregar contatos salvos
  useEffect(() => {
    carregarContatos();
  }, []);

  const carregarContatos = async () => {
    try {
      const dados = await AsyncStorage.getItem(STORAGE_KEY);
      if (dados) {
        setContatos(JSON.parse(dados));
      }
    } catch (err) {
      console.error('Erro ao carregar contatos:', err);
    }
  };

  const salvarContatos = async (novosContatos) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosContatos));
      setContatos(novosContatos);
    } catch (err) {
      console.error('Erro ao salvar contatos:', err);
    }
  };

  const abrirAdicionar = () => {
    setEditandoId(null);
    setNome('');
    setTelefone('');
    setEmail('');
    setModalVisible(true);
  };

  const abrirEditar = (contato) => {
    setEditandoId(contato.id);
    setNome(contato.nome);
    setTelefone(contato.telefone);
    setEmail(contato.email);
    setModalVisible(true);
  };

  const salvar = () => {
    if (!nome.trim()) {
      Alert.alert('Aviso', 'Digite um nome para o contato.');
      return;
    }

    let novosContatos;
    if (editandoId) {
      // Editando
      novosContatos = contatos.map((c) =>
        c.id === editandoId
          ? { ...c, nome: nome.trim(), telefone: telefone.trim(), email: email.trim() }
          : c
      );
    } else {
      // Novo contato
      const novo = {
        id: Date.now().toString(),
        nome: nome.trim(),
        telefone: telefone.trim(),
        email: email.trim(),
      };
      novosContatos = [...contatos, novo];
    }

    salvarContatos(novosContatos);
    setModalVisible(false);
  };

  const confirmarExcluir = (id, nomeContato) => {
    Alert.alert(
      'Excluir Contato',
      `Tem certeza que deseja excluir ${nomeContato}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const filtrados = contatos.filter((c) => c.id !== id);
            salvarContatos(filtrados);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contatoItem}
      onPress={() => abrirEditar(item)}
      onLongPress={() => confirmarExcluir(item.id, item.nome)}
    >
      <View style={styles.contatoInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>
            {item.nome.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.contatoDados}>
          <Text style={styles.contatoNome}>{item.nome}</Text>
          {item.telefone ? (
            <Text style={styles.contatoTel}>{item.telefone}</Text>
          ) : null}
          {item.email ? (
            <Text style={styles.contatoEmail}>{item.email}</Text>
          ) : null}
        </View>
      </View>
      <Text style={styles.seta}>›</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />

      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Agenda</Text>
        <Text style={styles.headerSub}>
          {contatos.length} contato{contatos.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Lista de contatos */}
      {contatos.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioIcon}>📇</Text>
          <Text style={styles.vazioTexto}>Nenhum contato ainda</Text>
          <Text style={styles.vazioSub}>Toque no + para adicionar</Text>
        </View>
      ) : (
        <FlatList
          data={contatos.sort((a, b) => a.nome.localeCompare(b.nome))}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.lista}
          contentContainerStyle={styles.listaConteudo}
        />
      )}

      {/* Botão flutuante + */}
      <TouchableOpacity style={styles.fab} onPress={abrirAdicionar}>
        <Text style={styles.fabTexto}>+</Text>
      </TouchableOpacity>

      {/* Modal de adicionar/editar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>
              {editandoId ? 'Editar Contato' : 'Novo Contato'}
            </Text>

            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do contato"
              value={nome}
              onChangeText={setNome}
              autoFocus={!editandoId}
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="(11) 99999-9999"
              keyboardType="phone-pad"
              value={telefone}
              onChangeText={setTelefone}
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="email@exemplo.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <View style={styles.modalBotoes}>
              <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
                <Text style={styles.botaoSalvarTexto}>
                  {editandoId ? 'Atualizar' : 'Salvar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7',
  },
  // Cabeçalho
  header: {
    backgroundColor: '#4A90D9',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  // Lista
  lista: {
    flex: 1,
  },
  listaConteudo: {
    padding: 16,
    paddingBottom: 100,
  },
  // Item de contato
  contatoItem: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contatoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarTexto: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contatoDados: {
    flex: 1,
  },
  contatoNome: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  contatoTel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  contatoEmail: {
    fontSize: 13,
    color: '#999',
    marginTop: 1,
  },
  seta: {
    fontSize: 24,
    color: '#CCC',
    marginLeft: 8,
  },
  // Estado vazio
  vazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  vazioIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  vazioTexto: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  vazioSub: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  // FAB
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90D9',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  fabTexto: {
    fontSize: 30,
    color: '#FFF',
    marginTop: -2,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalConteudo: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A2E',
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F2F4F7',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#E8ECF0',
  },
  modalBotoes: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 12,
  },
  botaoCancelar: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#F2F4F7',
    alignItems: 'center',
  },
  botaoCancelarTexto: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  botaoSalvar: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#4A90D9',
    alignItems: 'center',
  },
  botaoSalvarTexto: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '600',
  },
});
