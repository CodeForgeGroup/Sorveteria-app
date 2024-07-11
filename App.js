import * as React from "react";

import { useState, useEffect, useRef } from "react"; // Reconhece os comandos de start inicial

import Modal from "react-native-modal";
import axios from "axios"; // Faz a requisição HTTP para a API
import AsyncStorage from "@react-native-async-storage/async-storage"; // Para fazer o storage
import Icon from 'react-native-vector-icons/Ionicons';



import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Button,
  ScrollView,
  FlatList,
  SafeAreaView,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Picker } from "@react-native-picker/picker";
import { launchImageLibrary } from 'react-native-image-picker';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { AppLoading } from 'expo'; // Componente de carregamento

// Style
import { loginStyle } from "./src/styles/style";
import { dashboardStyle } from "./src/styles/style";
import { menuStyle } from "./src/styles/style";
import { estoqueStyle } from "./src/styles/style";
import { editarPerfilStyle } from "./src/styles/style";
import { visualizarPerfilStyle } from "./src/styles/style";
import { funcionarioStyle } from "./src/styles/style";
import { visualizarMenuStyle } from "./src/styles/style";
import { editarMenuStyle } from "./src/styles/style";

import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from '@react-navigation/native';

export function LoginScreen({ navigation }) {
  // Importando o hook useState do React
  const [email, setEmail] = useState("");
  // Cria uma variável de estado chamada "email" e uma função "setEmail" para atualizá-la. O estado inicial é uma string vazia.

  const [senha, setSenha] = useState("");
  // Cria uma variável de estado chamada "senha" e uma função "setSenha" para atualizá-la. O estado inicial é uma string vazia.

  const [errorModalVisible, setErrorModalVisible] = useState(false);
  // Cria uma variável de estado chamada "errorModalVisible" e uma função "setErrorModalVisible" para atualizá-la. O estado inicial é "false". Essa variável provavelmente será usada para controlar a visibilidade de um modal de erro.

  const [isFocused, setIsFocused] = React.useState(false);
  // Cria uma variável de estado chamada "isFocused" e uma função "setIsFocused" para atualizá-la. O estado inicial é "false". Essa variável pode ser usada para indicar se um campo de entrada está focado ou não.

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });


  // Define uma função assíncrona chamada "handleLogin". Esta função será usada para lidar com o evento de login.
  const handleLogin = async () => {
     //Verificar se o email ou a senha estão preenchidos
     if (!email.trim() || !senha.trim()) {
      setErrorModalVisible(true);
      return;
    }

    try {
      // const resposta = await axios.post(`http://127.0.0.1:8000/api/login?email=?{email}&senha=${senha}`);
      const resposta = await axios.post(`http://127.0.0.1:8000/api/login`, {
        email: email,
        senha: senha,
      });
      if (resposta.data) {
        const funcionario = resposta.data;

        if (funcionario) {
          console.log(funcionario);
          console.log(funcionario.usuario.dados_funcionario.idFuncionario);
          console.log(funcionario.usuario.dados_funcionario.nome);
          console.log(funcionario.access_token);

          const idFuncionario =
            funcionario.usuario.dados_funcionario.idFuncionario;
          const token = funcionario.access_token;

          // Armazenar o token na memória do APP (assyncStorage)
          await AsyncStorage.setItem("userToken", token);
          navigation.navigate("dashboard", { idFuncionario });
        }
      }
    } catch (error) {
      console.error("Erro ao verificar o email e a senha", error);
      setErrorModalVisible("Erro", "Erro ao verificar email e senha");
    }
  };


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={loginStyle.boxFundo}>
        <ImageBackground
          source={require("./assets/fundoLogin.png")}
          style={loginStyle.img}
        ></ImageBackground>
        <Text style={loginStyle.txtFundo}>
          <Text style={loginStyle.spanFundo}>Sorveteria</Text> 
          Faça o login para acessar a área administrativa da sorveteria.
        </Text>
      </View>
  
      {/* <StatusBar style="auto" /> */}
  
      <View style={loginStyle.container2}>
        <Text style={loginStyle.txtLogin}>Login</Text>

        <View style={loginStyle.inputContainer}>
          <Icon name="mail-outline" size={20} color="gray" style={loginStyle.icon} />
          <TextInput
            placeholder="Seu Email:"
            placeholderTextColor="gray"
            style={loginStyle.TextInput}
            value={email}
            onChangeText={setEmail}
            underlineColorAndroid="transparent"
          />
        </View>

  
        <View style={loginStyle.inputContainer}>
          <Icon name="lock-closed-outline" size={20} color="gray" style={loginStyle.icon} />
          <TextInput
            secureTextEntry={true}
            placeholder="Sua Senha:"
            placeholderTextColor="gray"
            style={loginStyle.TextInput}
            value={senha}
            onChangeText={setSenha}
            underlineColorAndroid="transparent"
          />
        </View>
  
        <TouchableOpacity
          style={loginStyle.txtForgetPassword}
          // onPress={() => navigation.navigate("EsqueciSenha")}
        >
          Esqueceu a senha?
        </TouchableOpacity>
  
        {/* <button style={loginStyle.btn} onPress={() => navigation.navigate('Dashboard')}>ENTRAR</button> */}
  
        <TouchableOpacity onPress={handleLogin} style={loginStyle.btnLogin}>
          <Text style={loginStyle.entrarLogin}>Entrar</Text>
        </TouchableOpacity>
  
        <Text style={loginStyle.txtcodeForge}>
          Desenvolvido por CodeForge @2024
        </Text>
  
        <Modal
          isVisible={errorModalVisible}
          onBackdropPress={() => setErrorModalVisible(false)}
        >
          <View style={loginStyle.errorModalContainer}>
            <Text style={loginStyle.errorModalTitle}>* Erro *</Text>
            <Text style={loginStyle.errorModalMessage}>
              Email ou Senha incorretos. Tente Novamente!!!
            </Text>
            <TouchableOpacity onPress={() => setErrorModalVisible(false)}>
              <Text style={loginStyle.errorModalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </View>
  );
  
}

export function DashboardScreen({ navigation, route }) {
  const [visible, setVisible] = useState(false);

  const { idFuncionario } = route.params || {};

  const [updatedProdutoId, setUpdatedProdutoId] = useState(route.params?.updatedProdutoId || null);
  const [createdProdutoId, setCreatedProdutoId] = useState(route.params?.createdProdutoId || null);
  

   const [fontsLoaded] = useFonts({
     Roboto_400Regular,
     Roboto_700Bold,
   });

  // console.log("Cód Funcionario: ", idFuncionario);


  const [nomeFuncionario, setNomeFuncionario] = useState("");
  const [sobrenomeFuncionario, setSobrenomeFuncionario] = useState("");
  const [fotoFuncionario, setFotoFuncionario] = useState("");
  const [tipoFuncionario, setTipoFuncionario] = useState("");
  const [totalValorProdutos, setTotalValorProdutos] = useState(0);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [totalFuncionarios, setTotalFuncionarios] = useState(0);
  const [mensagensRecentes, setMensagensRecentes] = useState([]);
  
  // Listener para focar na tela e atualizar parâmetros
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      const storedCreatedProdutoId = await AsyncStorage.getItem('createdProdutoId');
      const storedUpdatedProdutoId = await AsyncStorage.getItem('updatedProdutoId');
      

      if (storedCreatedProdutoId) {
        setCreatedProdutoId(storedCreatedProdutoId);
        await AsyncStorage.removeItem('createdProdutoId');
      }

      if (storedUpdatedProdutoId) {
        setUpdatedProdutoId(storedUpdatedProdutoId);
        await AsyncStorage.removeItem('updatedProdutoId');
      }

    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (idFuncionario) {
          const respostaFuncionario = await axios.get(
            `http://127.0.0.1:8000/api/dashboard/${idFuncionario}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const {
            nome_funcionario,
            sobrenome_funcionario,
            foto_funcionario,
            tipo_funcionario,
          } = respostaFuncionario.data.dadosFuncionario;
          setNomeFuncionario(nome_funcionario);
          setSobrenomeFuncionario(sobrenome_funcionario);
          setFotoFuncionario(foto_funcionario);
          setTipoFuncionario(tipo_funcionario);
          setTotalValorProdutos(respostaFuncionario.data.totalValorProdutos);
          setTotalProdutos(respostaFuncionario.data.totalProdutos);
          setTotalFuncionarios(respostaFuncionario.data.totalFuncionarios);
          setMensagensRecentes(respostaFuncionario.data.mensagensRecentes);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };
  
    fetchData();
  }, [idFuncionario]);

  useEffect(() => {
    const fetchEstatisticas = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (updatedProdutoId || createdProdutoId) {
          const respostaProduto = await axios.get(
            `http://127.0.0.1:8000/api/dashboard/${idFuncionario}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setTotalValorProdutos(respostaProduto.data.totalValorProdutos);
          setTotalProdutos(respostaProduto.data.totalProdutos);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do produto:", error);
      }
    };

    fetchEstatisticas();
  }, [updatedProdutoId, createdProdutoId]);

  const handleLogout = async () => { await AsyncStorage.removeItem('userToken');     
  navigation.navigate('Login'); // Navegar de volta para a tela de login };
}
  



  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <SafeAreaView>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "5%",
            backgroundColor: "#F4F8FF",
          }}
        >
          <View style={dashboardStyle.topDashContainer}>
            <View style={dashboardStyle.topDashInfo}>
              <View           
              >
                {fotoFuncionario && (
                  <Image
                    source={{ uri: fotoFuncionario }}
                    style={{ width: 50, height: 50, borderRadius: 10 }}
                  />
                )}
              </View>

              <View style={{ marginLeft: 10 }}>
                <Text style={dashboardStyle.nomeDash}>
                  {nomeFuncionario} {sobrenomeFuncionario}
                </Text>
                <Text style={dashboardStyle.cargoDash}>{tipoFuncionario}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setVisible(true)}
              style={dashboardStyle.btnNotificacao}>
              <Ionicons name="settings" size={24} color="#FFF"></Ionicons>
            </TouchableOpacity>

            <Modal
              isVisible={visible}
              onBackdropPress={() => setVisible(false, idFuncionario)}
            >
              <View style={dashboardStyle.modalContainerConfig}>
                <TouchableOpacity style={dashboardStyle.modalModalConfigTitle} onPress={() => navigation.navigate("editarPerfil", { idFuncionario })}>
                <Ionicons name="create" size={25} color="#C96DFF" />
                  <View>
                    <Text>Editar o Perfil</Text>
                  </View>
                </TouchableOpacity>
                
                  <TouchableOpacity style={dashboardStyle.modalModalConfigTitle} onPress={handleLogout}>
                  <Ionicons name="log-out-outline" size={25} color="#C96DFF" />
                  <View>
                    <Text>Sair da Conta</Text>
                  </View>
                  </TouchableOpacity>

                {/* <TouchableOpacity
                  onPress={() => setVisible(false)}
                >
                  <Text style={loginStyle.errorModalButtonText}>OK</Text>
                </TouchableOpacity> */}
              </View>
            </Modal>
          </View>

          <View style={dashboardStyle.bannerDash}>
            <View>
              <Text style={dashboardStyle.txtBanner}>Gerenciar</Text>
              <Text style={dashboardStyle.spanBanner}>Produtos</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Menu")}
                style={dashboardStyle.btnBanner}
              >
                <Text style={dashboardStyle.txtBtnBanner}>Acessar</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Image source={require("./assets/bannerDashboard.png")}></Image>
            </View>
          </View>

          <View style={dashboardStyle.boxTituloEstatisticas}>
            <Text style={dashboardStyle.tituloEstatisticas}>Estatísticas</Text>
          </View>

          <View style={dashboardStyle.containerEstatisticas}>
            <View style={dashboardStyle.boxEstatisticas}>
              <Ionicons name="cube" size={22} color="#FFF"></Ionicons>
              <Text style={dashboardStyle.txtBoxEstatisticas}>R$ {totalValorProdutos}</Text>
              <Text style={dashboardStyle.txtBoxEstatisticas}>Valor
              Produtos</Text>
            </View>

            <View style={dashboardStyle.boxEstatisticas}>
              <Ionicons name="ice-cream" size={22} color="#FFF"></Ionicons>
              <Text style={dashboardStyle.txtBoxEstatisticas}>{totalProdutos}</Text>
              <Text style={dashboardStyle.txtBoxEstatisticas}>Produtos</Text>
            </View>

            <View style={dashboardStyle.boxEstatisticas}>
              <Ionicons name="people" size={22} color="#FFF"></Ionicons>
              <Text style={dashboardStyle.txtBoxEstatisticas}>{totalFuncionarios}</Text>
              <Text style={dashboardStyle.txtBoxEstatisticas}>Funcionários</Text>
            </View>
          </View>

          <View style={dashboardStyle.boxTituloMensagem}>
            <Text style={dashboardStyle.tituloMensagem}>
              Mensagens Recentes
            </Text>
          </View>

          {mensagensRecentes.map((mensagem, index) => (
            <View key={index} style={dashboardStyle.boxMensagem}>
              <View style={dashboardStyle.boxMensagemInfo}>
                <Image
                  source={require("./assets/foto_mensagem.png")}
                  style={dashboardStyle.imgMensagem}
                ></Image>

                <View style={StyleSheet.mensagem}>
                  <Text style={dashboardStyle.nomeMensagem}>{mensagem.nomeContato}</Text>
                  <Text style={dashboardStyle.assuntoMensagem}>{mensagem.mensagemContato}</Text>
                </View>
              </View>

              <View style={dashboardStyle.boxhorarioMensagem}>
                <Text style={dashboardStyle.horarioMensagem}>{mensagem.created_at}</Text>
              </View>

            </View>
          ))}

        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

export function MenuScreen({ navigation, route }) {
  const [produtos, setProdutos] = useState([]);
  const [totalValorProdutos, setTotalValorProdutos] = useState(0);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [valorMedioProdutos, setValorMedioProdutos] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const { idFuncionario, updatedProdutoId, createdProdutoId } = route.params || {};

  console.log("Cód Funcionario: ", idFuncionario);
  console.log("Produto Atualizado ID: ", updatedProdutoId);
  console.log("Produto Criado ID: ", createdProdutoId);


  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const resposta = await axios.get('http://127.0.0.1:8000/api/produtos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProdutos(resposta.data.produtos);
        setTotalValorProdutos(resposta.data.totalValorProdutos);
        setTotalProdutos(resposta.data.totalProdutos);
        setValorMedioProdutos(resposta.data.valorMedioProdutos);
      } catch (error) {
        console.error('Erro ao buscar os produtos: ', error);
      }
    };

    fetchProdutos();
  }, [idFuncionario, updatedProdutoId, createdProdutoId]);

  // Função para filtrar produtos com base no texto de busca
  const filterProdutos = (produtos, searchQuery) => {
    if (!searchQuery) return produtos;
    return produtos.filter((produto) =>
      produto.nomeProduto.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F4F8FF" }}>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaView>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              backgroundColor: '#8A19D6',
            }}
          >
            <View style={menuStyle.boxTopoMenu}>
              <Text style={menuStyle.tituloMenu}>Menu</Text>
              <View style={menuStyle.containerEstatisticasMenu}>
                <View style={menuStyle.boxEstatisticasMenu}>
                  <Ionicons name="ice-cream" size={30} color="#FFF" />
                  <Text style={menuStyle.txtBoxEstatisticasMenu}>{totalProdutos}</Text>
                  <Text style={menuStyle.txtBoxEstatisticasMenu}>Produtos</Text>
                </View>

                <View style={menuStyle.boxEstatisticasMenu}>
                  <Ionicons name="logo-usd" size={30} color="#FFF" />
                  <Text style={menuStyle.txtBoxEstatisticasMenu}>R$ {valorMedioProdutos}</Text>
                  <Text style={menuStyle.txtBoxEstatisticasMenu}>Valor Médio</Text>
                </View>

                <View style={menuStyle.boxEstatisticasMenu}>
                  <Ionicons name="cash" size={30} color="#FFF" />
                  <Text style={menuStyle.txtBoxEstatisticasMenu}>R$ {totalValorProdutos}</Text>
                  <Text style={menuStyle.txtBoxEstatisticasMenu}>Valor Total</Text>
                </View>
              </View>
            </View>
            <View style={menuStyle.menuContainer}>
              <View style={menuStyle.buscarMenuContainer}>
                <View style={menuStyle.buscarMenu}>
                  <Ionicons name="search-outline" size={18} />
                  <TextInput
                    style={menuStyle.titleBuscarMenu}
                    placeholder="Buscar..."
                    onChangeText={(text) => setSearchQuery(text)}
                    value={searchQuery}
                  />
                </View>
                <TouchableOpacity
                  style={menuStyle.btnFiltroMenu}
                >
                  <Ionicons name="apps" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: 'center' }}>
                <View style={menuStyle.containerMainmenu}>
                  {filterProdutos(produtos, searchQuery).map((item) => (
                      <View key={item.id} style={menuStyle.boxContainerMenu}>
                        <View>
                          <Image
                            source={{ uri: `http://127.0.0.1:8000/storage/img/produtos/${item.categoriaProduto}/${item.fotoProduto}` }}
                            style={{ width: 120, height: 120, borderRadius: 20 }}
                          />
                          <Text style={menuStyle.precoMenu}>R$ {item.valorProduto}</Text>
                        </View>

                        <View style={menuStyle.cardMenu}>
                          <Text style={menuStyle.tituloCardMenu}>{item.nomeProduto}</Text>
                          <Text style={menuStyle.descricaoCardMenu}>
                            {item.descricaoProduto.length > 35 ? `${item.descricaoProduto.substring(0, 35)}...` : item.descricaoProduto}
                          </Text>

                          <View style={menuStyle.btnCardMenu}>
                            <View style={menuStyle.iconAcaiMenu}>
                              <Ionicons name="ice-cream" size={20} color="#C96DFF" />
                              <Text style={{ fontFamily: 'Roboto_400Regular', color: 'gray' }}>
                                {item.categoriaProduto === 'acai' ? 'Açaí' :
                                  item.categoriaProduto === 'sorvetePote' ? 'Sorvete de Pote' :
                                  item.categoriaProduto === 'picole' ? 'Picolé' :
                                  item.categoriaProduto
                                }
                              </Text>
                            </View>

                            <TouchableOpacity
                              style={menuStyle.btnSetaMenu}
                              onPress={() => navigation.navigate('VisualizarMenu', { idProduto: item.id })}
                            >
                              <Ionicons name="arrow-forward-outline" size={18} color="#FFF" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    )
                  )}
                </View>
              </View>
            </View>
          </View>      
        </SafeAreaView>
      </ScrollView>

      <View
      style={[
        menuStyle.addProduto,
        { position: "absolute", bottom: 20, right: 20 },
      ]}
      >
      <TouchableOpacity
        onPress={() => navigation.navigate('cadastrarMenu', { idFuncionario })}
      >
        <Ionicons name="add-outline" size={24} color="#FFF" />
      </TouchableOpacity>
      </View>
    </View>
  );
}

export function VisualizarMenuScreen({ navigation }) {
  const route = useRoute(); // acessar route.params
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    // Recuperar o ID do produto da rota
    const { idProduto } = route.params;

    const fetchProduto = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const resposta = await axios.get(`http://127.0.0.1:8000/api/produtos/${idProduto}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProduto(resposta.data);
      } catch (error) {
        console.error('Erro ao buscar o produto:', error);
      }
    };

    fetchProduto();
  }, [route.params]);

  if (!produto) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <SafeAreaView>
        <View style={{ flex: 1, justifyContent: 'center', margin: '5%' }}>
          <View style={visualizarMenuStyle.containerVisualizarMenu}>

            {/* Botão Voltar */}
            <View style={{ flexDirection: 'row', width: '90%', alignItems: 'center', marginBottom: '5%'}}>
              <View style={{ width: '17%'}}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#8A19D6', width: 50, height: 50, borderRadius: 9999, }}
                  onPress={() => navigation.goBack()}
                >
                <Ionicons name="arrow-back" size={20} color="#FFF" />
              </TouchableOpacity>
              </View>
              <View style={{ width: '83%',}}>
                <Text style={{ fontSize: 25, textAlign: 'center', fontWeight: 'bold',}}>Detalhes</Text>
              </View>
            </View>

            <View style={visualizarMenuStyle.boxImgVisualizarMenu}>
              <Image
                source={{ uri: `http://127.0.0.1:8000/storage/img/produtos/${produto.categoriaProduto}/${produto.fotoProduto}` }}
                style={{ width: '100%', height: 250, borderRadius: 20, }}
              />
              <Text style={visualizarMenuStyle.precoVisualizarMenu}>R$ {produto.valorProduto}</Text>
            </View>
            <Text style={visualizarMenuStyle.nomeProdutoMenu}>{produto.nomeProduto}</Text>
            <View style={visualizarMenuStyle.boxIcons}>
              <View style={visualizarMenuStyle.iconAcaiVisualizarMenu}>
                <Ionicons name="ice-cream" size={25} color="#C96DFF" />
                <Text>
                  {produto.categoriaProduto === 'acai' ? 'Açaí' :
                  produto.categoriaProduto === 'sorvetePote' ? 'Sorvete de Pote' :
                  produto.categoriaProduto === 'picole' ? 'Picolé' :
                  produto.categoriaProduto
                  }
                </Text>
              </View>
              <View style={menuStyle.iconAcaiMenu}>
              <Ionicons
                name={produto.statusProduto === 'ativo' ? 'checkmark-circle' : 'close-circle'}
                size={25}
                color="#C96DFF"
              />
              <Text>{produto.statusProduto === 'ativo' ? 'Disponível' : 'Indisponível'}</Text>
              </View>
            </View>
            <Text style={visualizarMenuStyle.tituloDescricao}>Descrição</Text>
            <Text style={visualizarMenuStyle.textoDescricao}>
              {produto.descricaoProduto}
            </Text>

            <TouchableOpacity
              style={visualizarMenuStyle.btnEditarMenu}
              onPress={() => navigation.navigate('EditarMenu', { produto })}
            >
              Editar
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

export function EditarMenuScreen({ navigation, route }) {
  const [nomeProduto, setNomeProduto] = useState('');
  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [categoriaProduto, setCategoriaProduto] = useState('');
  const [valorProduto, setValorProduto] = useState('');
  const [statusProduto, setStatusProduto] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const selectedImageBase64Ref = useRef(null);

  console.log(route.params);

  useEffect(() => {
    if (route.params && route.params.produto) {
      const produto = route.params.produto;
      setNomeProduto(produto.nomeProduto);
      setDescricaoProduto(produto.descricaoProduto);
      setCategoriaProduto(produto.categoriaProduto);
      setValorProduto(produto.valorProduto);
      setStatusProduto(produto.statusProduto);
      // carrega a imagem atual do produto, ajuste conforme necessário
      setSelectedImage(`http://127.0.0.1:8000/storage/img/produtos/${produto.categoriaProduto}/${produto.fotoProduto}`);
    }
  }, [route.params]);

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true, // Incluir base64 no resultado
    };

    launchImageLibrary(options, (resposta) => {
      if (resposta.didCancel) {
        console.log('Seleção de imagem cancelada pelo usuário');
      } else if (resposta.error) {
        console.log('Erro ao selecionar imagem: ', resposta.error);
      } else {
        const base64Image = resposta.assets[0].base64;
        const uri = resposta.assets[0].uri;
        console.log('URI da imagem selecionada:', uri);
        console.log('Imagem base64:', base64Image);
        selectedImageBase64Ref.current = base64Image;
        setSelectedImage(uri); // Atualiza a visualização da imagem selecionada
      }
    });
  };

  const handleSaveEdit = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const formData = new FormData();

      formData.append('nomeProduto', nomeProduto);
      formData.append('descricaoProduto', descricaoProduto);
      formData.append('valorProduto', valorProduto);
      formData.append('categoriaProduto', categoriaProduto);
      formData.append('statusProduto', statusProduto);

      if (selectedImageBase64Ref.current) {
        formData.append('fotoProduto', selectedImageBase64Ref.current);
      }

      const resposta = await axios.post(`http://127.0.0.1:8000/api/produtos/${route.params.produto.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (resposta.status === 200) {
        const updatedProdutoId = `${route.params.produto.id}_${Date.now()}`;

        // Salvando no AsyncStorage
        AsyncStorage.setItem('updatedProdutoId', updatedProdutoId.toString())
          .then(() => {
            console.log(`Produto atualizado: ${updatedProdutoId}`);
          })
          .catch(error => {
            console.error('Erro ao salvar o produto no AsyncStorage:', error);
          });
      
        // Navega para a tela Menu com o parâmetro updatedProdutoId
        navigation.navigate('Menu', { updatedProdutoId });
      } else {
        console.error('Erro ao salvar o produto:', resposta.status);
      }
    } catch (error) {
      console.error('Erro ao salvar o produto:', error);
    }
  
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <SafeAreaView>
        <View style={{ flex: 1, justifyContent: 'center', margin: '5%',}}>
          <View style={editarMenuStyle.containerEditarMenu}>
              {/* Botão Voltar */}
              <View style={{ flexDirection: 'row', width: '90%', alignItems: 'center', marginBottom: '5%'}}>
                <View style={{ width: '17%'}}>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#8A19D6', width: 50, height: 50, borderRadius: 9999, }}
                    onPress={() => navigation.goBack()}
                  >
                  <Ionicons name="arrow-back" size={20} color="#FFF" />
                </TouchableOpacity>
                </View>
                <View style={{ width: '83%',}}>
                  <Text style={{ fontSize: 25, textAlign: 'center', fontWeight: 'bold',}}>Editar</Text>
                </View>
              </View>

              <View style={visualizarMenuStyle.boxImgVisualizarMenu}>
                <Image 
                  source={{ uri: selectedImage }} 
                  style={{ width: '100%', height: 250, borderRadius: 20, }}
                />
              </View>
              <TouchableOpacity style={visualizarMenuStyle.boxBtnVisualizarMenu} onPress={handleImagePicker}>
                <Text style={editarMenuStyle.alterarImgEditarMenu}>Trocar Imagem</Text>
              </TouchableOpacity>
              <View style={editarMenuStyle.inputContainer}>
                <TextInput
                  style={editarMenuStyle.inputNomeEditar}
                  placeholder="Título:"
                  placeholderTextColor="gray"
                  value={nomeProduto}
                  onChangeText={setNomeProduto}
                />

                
                <TextInput
                  style={editarMenuStyle.inputDescricaoEditar}
                  placeholder="Descrição:"
                  multiline={true}
                  numberOfLines={4}
                  placeholderTextColor="gray"
                  value={descricaoProduto}
                  onChangeText={setDescricaoProduto}
                />

                <TextInput
                  style={editarMenuStyle.inputNomeEditar}
                  placeholder="Valor:"
                  placeholderTextColor="gray"
                  value={valorProduto}
                  onChangeText={(text) => {
                    const regex = /^[0-9]+(\.[0-9]{0,2})?$/;
                    if (regex.test(text) || text === '') {
                      setValorProduto(text);
                    }
                  }}
                  keyboardType="numeric" 
                  maxLength={7}
                  multiline={false}
                />

                <Picker
                  style={editarMenuStyle.selectMenu}
                  selectedValue={statusProduto}
                  onValueChange={(itemValue) => setStatusProduto(itemValue)}
                >
                  <Picker.Item label="Disponível" value="ativo" />
                  <Picker.Item label="Indisponível" value="inativo" />
                </Picker>
                <View style={editarMenuStyle.containarBtn}>

                    <TouchableOpacity
                      style={editarMenuStyle.btnCancelar}
                      onPress={() => navigation.goBack()}
                    >
                      Cancelar
                    </TouchableOpacity>


                    <TouchableOpacity 
                      style={editarMenuStyle.btnSalvar}
                      onPress={handleSaveEdit}
                    >
                      Salvar
                    </TouchableOpacity>

                </View>
              </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

export function CadastrarMenuScreen({ navigation, route }) {
  const [nomeProduto, setNomeProduto] = useState('');
  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [categoriaProduto, setCategoriaProduto] = useState('');
  const [valorProduto, setValorProduto] = useState('');
  const [statusProduto, setStatusProduto] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const selectedImageBase64Ref = useRef(null);
  const { idFuncionario } = route.params || {};

  console.log("Cód Funcionario: ", idFuncionario);
  console.log(route.params);

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
    };

    launchImageLibrary(options, (resposta) => {
      if (resposta.didCancel) {
        console.log('Seleção de imagem cancelada pelo usuário');
      } else if (resposta.error) {
        console.log('Erro ao selecionar imagem: ', resposta.error);
      } else {
        const base64Image = resposta.assets[0].base64;
        const uri = resposta.assets[0].uri;
        console.log('URI da imagem selecionada:', uri);
        console.log('Imagem base64:', base64Image);
        selectedImageBase64Ref.current = base64Image;
        setSelectedImage(uri);
      }
    });
  };

  const handleSaveAdd = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const formData = new FormData();

      formData.append('nomeProduto', nomeProduto);
      formData.append('descricaoProduto', descricaoProduto);
      formData.append('valorProduto', valorProduto);
      formData.append('categoriaProduto', categoriaProduto);
      formData.append('statusProduto', statusProduto);

      if (selectedImageBase64Ref.current) {
        formData.append('fotoProduto', selectedImageBase64Ref.current);
      }

      const resposta = await axios.post('http://127.0.0.1:8000/api/produtos', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (resposta.status === 201) { // Criando novo produto
        
        const newProdutoId = resposta.data.produto.id; // ID do novo produto sendo armazenado na variável newProdutoId e depois sendo passada como parametro

        // salvando no storage
        AsyncStorage.setItem('createdProdutoId', newProdutoId.toString());

        // console.log(`Status: ${resposta.status} newProdutoId: ${ newProdutoId }`);
        navigation.navigate("Menu", { idFuncionario, createdProdutoId: newProdutoId });
        

      } else {
        console.error('Erro ao cadastrar o produto:', resposta.status);
      }
    } catch (error) {
      console.error('Erro ao cadastrar o produto:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <SafeAreaView>
        <View style={{ flex: 1, justifyContent: 'center', margin: '5%' }}>
          <View style={editarMenuStyle.containerEditarMenu}>
            <View style={{ flexDirection: 'row', width: '90%', alignItems: 'center', marginBottom: '5%' }}>
              <View style={{ width: '17%' }}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#8A19D6', width: 50, height: 50, borderRadius: 9999 }}
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="arrow-back" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
              <View style={{ width: '83%' }}>
                <Text style={{ fontSize: 25, textAlign: 'center', fontWeight: 'bold' }}>Cadastrar</Text>
              </View>
            </View>

            <View style={visualizarMenuStyle.boxImgVisualizarMenu}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} style={{ width: '100%', height: 250, borderRadius: 20 }} />
              ) : (
                <View style={{  width: '100%', height: 250, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'gray', borderStyle: 'dashed', opacity: '5' }}>
                  <Text style={{ textAlign: 'center', color: 'gray' }}>Nenhuma imagem selecionada</Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={visualizarMenuStyle.boxBtnVisualizarMenu} onPress={handleImagePicker}>
              <Text style={editarMenuStyle.alterarImgEditarMenu}>Selecionar Imagem</Text>
            </TouchableOpacity>
            <View style={editarMenuStyle.inputContainer}>
              <TextInput
                style={editarMenuStyle.inputNomeEditar}
                placeholder="Título:"
                placeholderTextColor="gray"
                value={nomeProduto}
                onChangeText={setNomeProduto}
              />

              <TextInput
                style={editarMenuStyle.inputDescricaoEditar}
                placeholder="Descrição:"
                multiline={true}
                numberOfLines={4}
                placeholderTextColor="gray"
                value={descricaoProduto}
                onChangeText={setDescricaoProduto}
              />

              <TextInput
                style={editarMenuStyle.inputNomeEditar}
                placeholder="Valor:"
                placeholderTextColor="gray"
                value={valorProduto}
                onChangeText={(text) => {
                  const regex = /^[0-9]+(\.[0-9]{0,2})?$/;
                  if (regex.test(text) || text === '') {
                    setValorProduto(text);
                  }
                }}
                keyboardType="numeric"
                maxLength={7}
                multiline={false}
              />

              <Picker
                style={editarMenuStyle.selectMenu}
                selectedValue={categoriaProduto}
                onValueChange={(itemValue) => setCategoriaProduto(itemValue)}
              >
                <Picker.Item label="Selecione a categoria" value="" />
                <Picker.Item label="Açaí" value="acai" />
                <Picker.Item label="Picolé" value="picole" />
                <Picker.Item label="Sorvete de Pote" value="sorvetePote" />
              </Picker>

              <Picker
                style={editarMenuStyle.selectMenu}
                selectedValue={statusProduto}
                onValueChange={(itemValue) => setStatusProduto(itemValue)}
              >
                <Picker.Item label="Selecione o status" value="" />
                <Picker.Item label="Disponível" value="ativo" />
                <Picker.Item label="Indisponível" value="inativo" />
              </Picker>
              <View style={editarMenuStyle.containarBtn}>
                <TouchableOpacity
                  style={editarMenuStyle.btnCancelar}
                  onPress={() => navigation.goBack()}
                >
                  Cancelar
                </TouchableOpacity>

                <TouchableOpacity
                  style={editarMenuStyle.btnSalvar}
                  onPress={handleSaveAdd}
                >
                  Salvar
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}


export function MensagensScreen({ navigation }) {
  const [mensagens, setMensagens] = useState([]);
  const [naoRespondidas, setNaoRespondidas] = useState(0);
  const [mensagensRespondidas, setMensagensRespondidas] = useState(0);
  const [mensagensTotais, setMensagensTotais] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMensagens = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const resposta = await axios.get('http://127.0.0.1:8000/api/contatos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMensagens(resposta.data.mensagens);
        setNaoRespondidas(resposta.data.naoRespondidas);
        setMensagensRespondidas(resposta.data.mensagensRespondidas);
        setMensagensTotais(resposta.data.mensagensTotais);
      } catch (error) {
        console.error('Erro ao buscar as mensagens: ', error);
      }
    };

    fetchMensagens();
  }, []);


  const filterMensagens = (mensagens, searchQuery) => {
    if (!searchQuery) return mensagens;
    return mensagens.filter((mensagem) =>
      mensagem.assuntoContato.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };


  return (
    <View style={{ flex: 1, backgroundColor: "#F4F8FF" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaView>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <View style={menuStyle.boxTopoMenu}>
              <Text style={menuStyle.tituloMenu}>Mensagens</Text>
              <View style={dashboardStyle.containerEstatisticas}>
                <View style={menuStyle.boxEstatisticasMenu}>
                  <Ionicons name="chatbubble-outline" size={25} color="#FFF" />
                  <Text>{naoRespondidas}</Text>
                  <Text style={dashboardStyle.txtBoxEstatisticas}>Ativas</Text>
                </View>

                <View style={menuStyle.boxEstatisticasMenu}>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={25}
                    color="#FFF"
                  />
                  <Text>{mensagensRespondidas}</Text>
                  <Text style={dashboardStyle.txtBoxEstatisticas}>
                    Respondidas
                  </Text>
                </View>

                <View style={menuStyle.boxEstatisticasMenu}>
                  <Ionicons name="chatbubbles-outline" size={25} color="#FFF" />
                  <Text>{mensagensTotais}</Text>
                  <Text style={dashboardStyle.txtBoxEstatisticas}>Totais</Text>
                </View>
              </View>
            </View>

            <View style={menuStyle.buscarMenu}>
              <Ionicons name="search-outline" size={18} />
              <TextInput
                style={menuStyle.titleBuscarMenu}
                placeholder="Buscar"
                onChangeText={(text) => setSearchQuery(text)}
                value={searchQuery}
              />
            </View>

            <View style={dashboardStyle.boxTituloMensagem}>
              <Text style={dashboardStyle.tituloMensagem}>
                Todas as Mensagens
              </Text>
            </View>

            {filterMensagens(mensagens, searchQuery).map((mensagem) => (
            <View key={mensagem.id} style={dashboardStyle.boxMensagem}>

              <View style={dashboardStyle.boxMensagemInfo}>
                <Image
                  source={require("./assets/foto_mensagem.png")}
                  style={dashboardStyle.imgMensagem}
                ></Image>

                <View style={StyleSheet.mensagem}>
                  <Text style={dashboardStyle.nomeMensagem}>{mensagem.nomeContato}</Text>
                  <Text style={dashboardStyle.assuntoMensagem}>{mensagem.mensagemContato}</Text>
                </View>
              </View>

              <View style={dashboardStyle.boxhorarioMensagem}>
                <Text style={dashboardStyle.horarioMensagem}>{mensagem.created_at}</Text>
              </View>

            </View>
            ))}

          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

export function EditarPerfilScreen({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tokenSenha, setTokenSenha] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const selectedImageBase64Ref = useRef(null);


  console.log(route.params.funcionario);



  useEffect(() => {
    if (route.params && route.params.idFuncionario) {
      const fetchFuncionario = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          const response = await axios.get(`http://127.0.0.1:8000/api/perfil/${route.params.idFuncionario}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const funcionario = response.data;

          setEmail(funcionario.email);
          setSenha(funcionario.senha);
          setTokenSenha(funcionario.token_lembrete);
          setSelectedImage(`http://127.0.0.1:8000/storage/img/funcionarios/${funcionario.fotoFuncionario}`);
        } catch (error) {
          console.error('Erro ao buscar dados do funcionário:', error);
        }
      };

      fetchFuncionario();
    }
  }, [route.params]);

    const handleImagePicker = () => {
      const options = {
        mediaType: 'photo',
        includeBase64: true, // Incluir base64 no resultado
      };

      launchImageLibrary(options, (resposta) => {
        if (resposta.didCancel) {
          console.log('Seleção de imagem cancelada pelo usuário');
        } else if (resposta.error) {
          console.log('Erro ao selecionar imagem: ', resposta.error);
        } else {
          const base64Image = resposta.assets[0].base64;
          const uri = resposta.assets[0].uri;
          console.log('URI da imagem selecionada:', uri);
          console.log('Imagem base64:', base64Image);
          selectedImageBase64Ref.current = base64Image;
          setSelectedImage(uri); // Atualiza a visualização da imagem selecionada
        }
      });
    };

    const handleSavePerfilEdit = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const formData = new FormData();
  
        formData.append('email', email);
        formData.append('senha', senha);
  
        if (selectedImageBase64Ref.current) {
          formData.append('fotoFuncionario', selectedImageBase64Ref.current);
        }
  
        const response = await axios.post(`http://127.0.0.1:8000/api/perfil/${route.params.idFuncionario}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.status === 200) {
          navigation.navigate('Dashboard');
        } else {
          console.error('Erro ao salvar a atualização:', response.status);
        }
      } catch (error) {
        console.error('Erro ao salvar a atualização:', error);
      }
    };
  
    


  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaView>
          <View style={{flex: 1, justifyContent: 'center',  padding: '5%',}}>
              {/* Botão Voltar */}
              <View style={{ flexDirection: 'row', width: '90%', alignItems: 'center', marginBottom: '5%',}}>
                <View style={{ width: '17%'}}>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#8A19D6', width: 50, height: 50, borderRadius: 9999, }}
                    onPress={() => navigation.goBack()}
                  >
                  <Ionicons name="arrow-back" size={20} color="#FFF" />
                </TouchableOpacity>
                </View>
                <View style={{ width: '83%',}}>
                  <Text style={{ fontSize: 25, textAlign: 'center', fontWeight: 'bold',}}>Editar</Text>
                </View>
              </View>
                      
   
                <View style={visualizarMenuStyle.boxImgVisualizarMenu}>
                  <Image
                    source={{ uri: selectedImage }} 
                    style={{ width: 150, height: 150, borderRadius: 9999, }}
                  />
                </View>


                <TouchableOpacity style={visualizarMenuStyle.boxBtnVisualizarMenu} onPress={handleImagePicker}>
                    <Text style={editarMenuStyle.alterarImgEditarMenu}>Trocar Imagem</Text>
                </TouchableOpacity>
 


                <Text style={{ marginBottom: 5, fontFamily: 'Roboto_700Bold', color: 'gray', }}>E-mail:</Text>
                <View style={{ flexDirection: 'row', height: 40, width: '100%', alignItems: 'center',  borderWidth: 1, borderColor: '#64748B', borderRadius: 10, marginBottom: 10,  }}>
                  <Icon name="mail-outline" size={20} color="gray" style={{ color: '#8A19D6', margin: 10, }} />
                  <TextInput
                    placeholder="E-mail:"
                    placeholderTextColor="gray"
                    style={loginStyle.TextInput}
                    value={email}
                    onChangeText={setEmail}
                    underlineColorAndroid="transparent"
                  />
                </View>

                <Text style={{  marginBottom: 5, fontFamily: 'Roboto_700Bold', color: 'gray', }}>Senha:</Text>
                <View style={{ flexDirection: 'row', height: 40, width: '100%', alignItems: 'center',  borderWidth: 1, borderColor: '#64748B', borderRadius: 10, marginBottom: 10,  }}>
                  <Icon name="lock-closed-outline" size={20} color="gray" style={{ color: '#8A19D6', margin: 10, }} />
                  <TextInput
  
                    placeholder="Senha:"
                    placeholderTextColor="gray"
                    style={loginStyle.TextInput}
                    value={senha}
                    onChangeText={setSenha}
                    underlineColorAndroid="transparent"
                  />
                </View>

                <Text style={{  marginBottom: 5, fontFamily: 'Roboto_700Bold', color: 'gray', }}>Token para recuperação de senha:</Text>
                <View style={{ flexDirection: 'row', height: 40, width: '100%', alignItems: 'center',  borderWidth: 1, borderColor: '#64748B', borderRadius: 10, marginBottom: 10,  }}>
                  <Icon name="key-outline" size={20} color="gray" style={{ color: '#8A19D6', margin: 10, }} />
                  <TextInput
                placeholder="Token:"
                placeholderTextColor="gray"
                style={loginStyle.TextInput}
                value={tokenSenha}
                editable={false}
                underlineColorAndroid="transparent"
              />
                </View>




    

                <View style={editarMenuStyle.containarBtn}>

                  <TouchableOpacity
                    style={editarMenuStyle.btnCancelar}
                    onPress={() => navigation.goBack()}
                  >
                    <Text style={{ color: '#8A19D6', fontFamily: 'Roboto_700Bold', }}>Cancelar</Text>
                  </TouchableOpacity>


                  <TouchableOpacity 
                    style={editarMenuStyle.btnSalvar}
                    onPress={handleSavePerfilEdit}
                  >
                    <Text style={{ color: 'white', fontFamily: 'Roboto_700Bold', }}>Salvar</Text>
                  </TouchableOpacity>

                </View>

          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

export function FuncionarioScreen({ navigation, route }) {
  const [funcionarios, setFuncionarios] = useState([]);
  const [totalFuncionarios, setTotalFuncionarios] = useState(0);
  const [mediaSalarial, setMediaSalarial] = useState(0);
  const [funcionariosInativos, setFuncionariosInativos] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const { idFuncionario } = route.params || {};

  console.log("Cód Funcionario: ", idFuncionario);

  useEffect(() => {
    const fetchFuncionarios = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const resposta = await axios.get('http://127.0.0.1:8000/api/funcionarios', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFuncionarios(resposta.data.funcionarios);
        setTotalFuncionarios(resposta.data.totalFuncionarios);
        setMediaSalarial(resposta.data.mediaSalarial);
        setFuncionariosInativos(resposta.data.funcionariosInativos);
      } catch (error) {
        console.error('Erro ao buscar: ', error);
      }
    };

    fetchFuncionarios();
  }, [idFuncionario]);


  const filterFuncionarios = (funcionarios, searchQuery) => {
    if (!searchQuery) return funcionarios;
    return funcionarios.filter((funcionario) =>
      funcionario.nomeFuncionario.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };


  return (
    <View style={{ flex: 1}}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaView>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              backgroundColor: '#8A19D6', 
            }}
          >
            <View style={menuStyle.boxTopoMenu}>
              <Text style={menuStyle.tituloMenu}>Funcionários</Text>
              <View style={menuStyle.containerEstatisticasMenu}>
                <View style={menuStyle.boxEstatisticasMenu}>
                  <Ionicons name="people" size={25} color="#FFF" />
                  <Text style={menuStyle.txtBoxEstatisticasMenu}>{totalFuncionarios}</Text>
                  <Text style={menuStyle.txtBoxEstatisticasMenu}>Funcionários</Text>
                </View>

                <View style={menuStyle.boxEstatisticasMenu}>
                  <Ionicons name="logo-usd" size={25} color="#FFF" />
                  <Text style={menuStyle.txtBoxEstatisticasMenu}>R$ {mediaSalarial}</Text>
                  <Text style={menuStyle.txtBoxEstatisticasMenu}>
                    Média Salarial
                  </Text>
                </View>

                <View style={menuStyle.boxEstatisticasMenu}>
                  <Ionicons name="eye-off" size={25} color="#FFF" />
                  <Text style={menuStyle.txtBoxEstatisticasMenu}>{funcionariosInativos}</Text>
                  <Text style={menuStyle.txtBoxEstatisticasMenu}>Indisponíveis</Text>
                </View>
              </View>
            </View>

            <View style={menuStyle.menuContainer}>
              <View style={menuStyle.buscarMenuContainer}>
                  <View style={menuStyle.buscarMenu}>
                    <Ionicons name="search-outline" size={18} />
                    <TextInput
                      style={menuStyle.titleBuscarMenu}
                      placeholder="Buscar..."
                      onChangeText={(text) => setSearchQuery(text)}
                      value={searchQuery}
                    />
                  </View>
                  <TouchableOpacity
                    style={menuStyle.btnFiltroMenu}
                  >
                    <Ionicons name="apps" size={20} color="#FFF" />
                  </TouchableOpacity>
              </View>

              <View style={funcionarioStyle.containerFuncionarios}>
              {filterFuncionarios(funcionarios, searchQuery).map((funcionario) => (
                <TouchableOpacity
                  key={funcionario.id}
                  style={funcionarioStyle.boxFuncionario}
                  onPress={() => navigation.navigate('editarFuncionario', { funcionario })}
                >
                  <Image 
                    source={{ uri: `http://127.0.0.1:8000/storage/img/funcionarios/${funcionario.fotoFuncionario}` }}
                    style={{ width: 80, height: 80, borderRadius: 40 }}
                  />
                  <View style={funcionarioStyle.boxNomeFuncionario}>
                    <Text style={funcionarioStyle.nomeFuncionario}>{funcionario.nomeFuncionario}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>

      <View
        style={[
          menuStyle.addProduto,
          { position: "absolute", bottom: 20, right: 20 },
        ]}
      >
        <Ionicons name="add-outline" size={20} color="#FFF" />
      </View>
    </View>
  );
}

export function EditarFuncionarioScreen({ navigation, route }){
  const [nomeFuncionario, setNomeFuncionario] = useState('');
  const [sobrenomeFuncionario, setSobrenomeFuncionario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [foneFuncionario, setFoneFuncionario] = useState('');
  const [dataNascFuncionario , setDataNascFuncionario] = useState('');
  const [enderecoFuncionario, setEnderecoFuncionario] = useState('');
  const [cidadeFuncionario , setCidadeFuncionario] = useState('');
  const [estadoFuncionario, setEstadoFuncionario] = useState('');
  const [cepFuncionario , setCepFuncionario] = useState('');
  const [dataContratacaoFuncionario, setDataContratacaoFuncionario] = useState('');
  const [cargoFuncionario, setCargoFuncionario] = useState('');
  const [salarioFuncionario, setSalarioFuncionario] = useState('');
  const [tipo_funcionario , setTipo_funcionario] = useState('');
  const [statusFuncionario , setStatusFuncionario] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const selectedImageBase64Ref = useRef(null);


  console.log(route.params.funcionario);

  useEffect(() => {
    if (route.params && route.params.funcionario) {
      const usuario = route.params.funcionario;
      setNomeFuncionario(usuario.nomeFuncionario);
      setSobrenomeFuncionario(usuario.sobrenomeFuncionario);
      setEmail(usuario.email);
      setSenha(usuario.senha);
      setFoneFuncionario(usuario.foneFuncionario);
      setDataNascFuncionario(usuario.dataNascFuncionario);
      setEnderecoFuncionario(usuario.enderecoFuncionario);
      setCidadeFuncionario(usuario.cidadeFuncionario);
      setEstadoFuncionario(usuario.estadoFuncionario);
      setCepFuncionario(usuario.cepFuncionario);
      setDataContratacaoFuncionario(usuario.dataContratacaoFuncionario);
      setCargoFuncionario(usuario.cargoFuncionario);
      setSalarioFuncionario(usuario.salarioFuncionario);
      setTipo_funcionario(usuario.tipo_funcionario);
      setStatusFuncionario(usuario.statusFuncionario);
      setSelectedImage(`http://127.0.0.1:8000/storage/img/funcionarios/${usuario.fotoFuncionario}`);
    }
  }, [route.params]);

    const handleImagePicker = () => {
      const options = {
        mediaType: 'photo',
        includeBase64: true, // Incluir base64 no resultado
      };

      launchImageLibrary(options, (resposta) => {
        if (resposta.didCancel) {
          console.log('Seleção de imagem cancelada pelo usuário');
        } else if (resposta.error) {
          console.log('Erro ao selecionar imagem: ', resposta.error);
        } else {
          const base64Image = resposta.assets[0].base64;
          const uri = resposta.assets[0].uri;
          console.log('URI da imagem selecionada:', uri);
          console.log('Imagem base64:', base64Image);
          selectedImageBase64Ref.current = base64Image;
          setSelectedImage(uri); // Atualiza a visualização da imagem selecionada
        }
      });
    };

    const handleSaveFuncionarioEdit = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const formData = new FormData();
  
        formData.append('nomeFuncionario', nomeFuncionario);
        formData.append('sobrenomeFuncionario', sobrenomeFuncionario);
        formData.append('email', email);
        formData.append('senha', senha);
        formData.append('foneFuncionario', foneFuncionario);
        formData.append('dataNascFuncionario', dataNascFuncionario);
        formData.append('enderecoFuncionario', enderecoFuncionario);
        formData.append('cidadeFuncionario', cidadeFuncionario);
        formData.append('estadoFuncionario', estadoFuncionario);
        formData.append('cepFuncionario', cepFuncionario);
        formData.append('dataContratacaoFuncionario', dataContratacaoFuncionario);
        formData.append('cargoFuncionario', cargoFuncionario);
        formData.append('salarioFuncionario', salarioFuncionario);
        formData.append('tipo_funcionario', tipo_funcionario);
        formData.append('statusFuncionario', statusFuncionario);


        if (selectedImageBase64Ref.current) {
          formData.append('fotoFuncionario', selectedImageBase64Ref.current);
        }
  
        const resposta = await axios.post(`http://127.0.0.1:8000/api/funcionarios/${route.params.funcionario.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (resposta.status === 200) {
          navigation.navigate('Funcionários', { idUsuario: route.params.funcionario.id  });
        } else {
          console.error('Erro ao salvar a atualização:', resposta.status);
        }
      } catch (error) {
        console.error('Erro ao salvar a atualização:', error);
      }
    
    };
  
    


  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaView>
          <View style={{flex: 1, justifyContent: 'center',  padding: '5%',}}>
              {/* Botão Voltar */}
              <View style={{ flexDirection: 'row', width: '90%', alignItems: 'center', marginBottom: '5%',}}>
                <View style={{ width: '17%'}}>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#8A19D6', width: 50, height: 50, borderRadius: 9999, }}
                    onPress={() => navigation.goBack()}
                  >
                  <Ionicons name="arrow-back" size={20} color="#FFF" />
                </TouchableOpacity>
                </View>
                <View style={{ width: '83%',}}>
                  <Text style={{ fontSize: 25, textAlign: 'center', fontWeight: 'bold',}}>Editar</Text>
                </View>
              </View>
                      

                <View style={visualizarMenuStyle.boxImgVisualizarMenu}>
                  <Image
                    source={{ uri: selectedImage }} 
                    style={{ width: 150, height: 150, borderRadius: 9999, }}
                  />
                </View>


                <TouchableOpacity style={visualizarMenuStyle.boxBtnVisualizarMenu} onPress={handleImagePicker}>
                    <Text style={editarMenuStyle.alterarImgEditarMenu}>Trocar Imagem</Text>
                </TouchableOpacity>

 

              

                <Text style={{ marginBottom: 5, fontFamily: 'Roboto_700Bold', color: 'gray', }}>Nome:</Text>
                <View style={{ flexDirection: 'row', height: 40, width: '100%', alignItems: 'center',  borderWidth: 1, borderColor: '#64748B', borderRadius: 10, marginBottom: 10,  }}>
                  <Icon name="person-outline" size={20} color="gray" style={{ color: '#8A19D6', margin: 10, }} />
                  <TextInput
                    placeholder="Nome:"
                    placeholderTextColor="gray"
                    style={loginStyle.TextInput}
                    value={nomeFuncionario}
                    onChangeText={setNomeFuncionario}
                    underlineColorAndroid="transparent"
                  />
                </View>

                <Text style={{  marginBottom: 5, fontFamily: 'Roboto_700Bold', color: 'gray', }}>Sobrenome:</Text>
                <View style={{ flexDirection: 'row', height: 40, width: '100%', alignItems: 'center',  borderWidth: 1, borderColor: '#64748B', borderRadius: 10, marginBottom: 10,  }}>
                  <Icon name="person-outline" size={20} color="gray" style={{ color: '#8A19D6', margin: 10, }} />
                  <TextInput
                    placeholder="Sobrenome:"
                    placeholderTextColor="gray"
                    style={loginStyle.TextInput}
                    value={sobrenomeFuncionario}
                    onChangeText={setSobrenomeFuncionario}
                    underlineColorAndroid="transparent"
                  />
                </View>

                <Text style={{ marginBottom: 5, fontFamily: 'Roboto_700Bold', color: 'gray' }}>Email:</Text>
                <View style={{ flexDirection: 'row', height: 40, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#64748B', borderRadius: 10, marginBottom: 10 }}>
                  <Icon name="mail-outline" size={20} color="gray" style={{ color: '#8A19D6', margin: 10 }} />
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor="gray"
                    style={loginStyle.TextInput}
                    value={email}
                    onChangeText={setEmail}
                    underlineColorAndroid="transparent"
                  />
                </View>

                <Text style={{ marginBottom: 5, fontFamily: 'Roboto_700Bold', color: 'gray' }}>Senha:</Text>
                <View style={{ flexDirection: 'row', height: 40, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#64748B', borderRadius: 10, marginBottom: 10 }}>
                  <Icon name="lock-closed-outline" size={20} color="gray" style={{ color: '#8A19D6', margin: 10 }} />
                  <TextInput
                    placeholder="Senha"
                    placeholderTextColor="gray"
                    style={loginStyle.TextInput}
                    value={senha}
                    onChangeText={setSenha}
                    underlineColorAndroid="transparent"
                    secureTextEntry
                  />
                </View>

                <Text style={{ marginBottom: 5, fontFamily: 'Roboto_700Bold', color: 'gray' }}>Telefone:</Text>
                <View style={{ flexDirection: 'row', height: 40, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#64748B', borderRadius: 10, marginBottom: 10 }}>
                  <Icon name="call-outline" size={20} color="gray" style={{ color: '#8A19D6', margin: 10 }} />
                  <TextInput
                    placeholder="Telefone"
                    placeholderTextColor="gray"
                    style={loginStyle.TextInput}
                    value={foneFuncionario}
                    onChangeText={setFoneFuncionario}
                    underlineColorAndroid="transparent"
                  />
                </View>

                <Text style={{ marginBottom: 5, fontFamily: 'Roboto_700Bold', color: 'gray' }}>Data de Nascimento:</Text>
                <View style={{ flexDirection: 'row', height: 40, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#64748B', borderRadius: 10, marginBottom: 10 }}>
                  <Icon name="calendar-outline" size={20} color="gray" style={{ color: '#8A19D6', margin: 10 }} />
                  <TextInput
                    placeholder="Data de Nascimento"
                    placeholderTextColor="gray"
                    style={loginStyle.TextInput}
                    value={dataNascFuncionario}
                    onChangeText={setDataNascFuncionario}
                    underlineColorAndroid="transparent"
                  />
                </View>

                <Text style={{ marginBottom: 5, fontFamily: 'Roboto_700Bold', color: 'gray' }}>Endereço:</Text>
                <View style={{ flexDirection: 'row', height: 40, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#64748B', borderRadius: 10, marginBottom: 10 }}>
                  <Icon name="location-outline" size={20} color="gray" style={{ color: '#8A19D6', margin: 10 }} />
                  <TextInput
                    placeholder="Endereço"
                    placeholderTextColor="gray"
                    style={loginStyle.TextInput}
                    value={enderecoFuncionario}
                    onChangeText={setEnderecoFuncionario}
                    underlineColorAndroid="transparent"
                  />
                </View>

                <Text style={{ marginBottom: 5, fontFamily: 'Roboto_700Bold', color: 'gray' }}>Cidade:</Text>
                <View style={{ flexDirection: 'row', height: 40, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#64748B', borderRadius: 10, marginBottom: 10 }}>
                  <Icon name="business-outline" size={20} color="gray" style={{ color: '#8A19D6', margin: 10 }} />
                  <TextInput
                    placeholder="Cidade"
                    placeholderTextColor="gray"
                    style={loginStyle.TextInput}
                    value={cidadeFuncionario}
                    onChangeText={setCidadeFuncionario}
                    underlineColorAndroid="transparent"
                  />
                </View>

                <Text style={{ marginBottom: 5, fontFamily: 'Roboto_700Bold', color: 'gray' }}>Estado:</Text>
                <View style={{ flexDirection: 'row', height: 40, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#64748B', borderRadius: 10, marginBottom: 10 }}>
                  <Icon name="business-outline" size={20} color="gray" style={{ color: '#8A19D6', margin: 10 }} />
                  <TextInput
                    placeholder="Estado"
                    placeholderTextColor="gray"
                    style={loginStyle.TextInput}
                    value={estadoFuncionario}
                    onChangeText={setEstadoFuncionario}
                    underlineColorAndroid="transparent"
                  />
                </View>

                <Text style={{ marginBottom: 5, fontFamily: 'Roboto_700Bold', color: 'gray' }}>CEP:</Text>
                <View style={{ flexDirection: 'row', height: 40, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#64748B', borderRadius: 10, marginBottom: 10 }}>
                  <Icon name="location-outline" size={20} color="gray" style={{ color: '#8A19D6', margin: 10 }} />
                  <TextInput
                    placeholder="CEP"
                    placeholderTextColor="gray"
                    style={loginStyle.TextInput}
                    value={cepFuncionario}
                    onChangeText={setCepFuncionario}
                    underlineColorAndroid="transparent"
                  />
                </View>

                <Text style={{ marginBottom: 5, fontFamily: 'Roboto_700Bold', color: 'gray' }}>Data de Contratação:</Text>
                <View style={{ flexDirection: 'row', height: 40, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#64748B', borderRadius: 10, marginBottom: 10 }}>
                  <Icon name="calendar-outline" size={20} color="gray" style={{ color: '#8A19D6', margin: 10 }} />
                  <TextInput
                    placeholder="Data de Contratação"
                    placeholderTextColor="gray"
                    style={loginStyle.TextInput}
                    value={dataContratacaoFuncionario}
                    onChangeText={setDataContratacaoFuncionario}
                    underlineColorAndroid="transparent"
                  />
                </View>

                <Text style={{ marginBottom: 5, fontFamily: 'Roboto_700Bold', color: 'gray' }}>Cargo:</Text>
                <View style={{ flexDirection: 'row', height: 40, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#64748B', borderRadius: 10, marginBottom: 10 }}>
                  <Icon name="briefcase-outline" size={20} color="gray" style={{ color: '#8A19D6', margin: 10 }} />
                  <TextInput
                    placeholder="Cargo"
                    placeholderTextColor="gray"
                    style={loginStyle.TextInput}
                    value={cargoFuncionario}
                    onChangeText={setCargoFuncionario}
                    underlineColorAndroid="transparent"
                  />
                </View>

                <Text style={{ marginBottom: 5, fontFamily: 'Roboto_700Bold', color: 'gray' }}>Salário:</Text>
                <View style={{ flexDirection: 'row', height: 40, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#64748B', borderRadius: 10, marginBottom: 10 }}>
                  <Icon name="cash-outline" size={20} color="gray" style={{ color: '#8A19D6', margin: 10 }} />
                  <TextInput
                    placeholder="Salário"
                    placeholderTextColor="gray"
                    style={loginStyle.TextInput}
                    value={salarioFuncionario}
                    onChangeText={setSalarioFuncionario}
                    underlineColorAndroid="transparent"
                  />
                </View>

                <View style={{ flexDirection:'row', marginBottom: 10, justifyContent: 'space-between'}}>
                  <View style={{ width: '48%' }}>
                    <Text style={{ marginBottom: 5, fontFamily: 'Roboto_700Bold', color: 'gray', }}>Função:</Text>
                    <View style={{ flexDirection: 'row', height: 40, width: '100%', alignItems: 'center',  borderWidth: 1, borderColor: '#64748B', borderRadius: 10, }}>
                      <Icon name="mail-outline" size={20} color="gray" style={{ color: '#8A19D6', margin: 10, }} />
                      <Picker
                        style={{ borderWidth: '0', }}
                        selectedValue={tipo_funcionario}
                        onValueChange={(itemValue) => setTipo_funcionario(itemValue)}
                      >
                        <Picker.Item label="Administrador" value="administrador" />
                        <Picker.Item label="Assistente" value="assistente" />
                      </Picker>
                    </View>
                  </View>
                  <View style={{ width: '48%' }}>
                    <Text style={{ marginBottom: 5, fontFamily: 'Roboto_700Bold', color: 'gray', }}>Disponibilidade:</Text>
                    <View style={{ flexDirection: 'row', height: 40, width: '100%', alignItems: 'center',  borderWidth: 1, borderColor: '#64748B', borderRadius: 10, }}>
                      <Icon name="mail-outline" size={20} color="gray" style={{ color: '#8A19D6', margin: 10, }} />
                      <Picker
                        style={{ borderWidth: '0', }}
                        selectedValue={statusFuncionario}
                        onValueChange={(itemValue) => setStatusFuncionario(itemValue)}
                      >
                        <Picker.Item label="Disponível" value="ativo" />
                        <Picker.Item label="Indisponível" value="inativo" />
                      </Picker>
                    </View>                  
                  </View>
                </View>



    

                <View style={editarMenuStyle.containarBtn}>

                  <TouchableOpacity
                    style={editarMenuStyle.btnCancelar}
                    onPress={() => navigation.goBack()}
                  >
                    <Text style={{ color: '#8A19D6', fontFamily: 'Roboto_700Bold', }}>Cancelar</Text>
                  </TouchableOpacity>


                  <TouchableOpacity 
                    style={editarMenuStyle.btnSalvar}
                    onPress={handleSaveFuncionarioEdit}
                  >
                    <Text style={{ color: 'white', fontFamily: 'Roboto_700Bold', }}>Salvar</Text>
                  </TouchableOpacity>

                </View>

          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}


// export function EsqueciSenhaScreen({ navigation }) {
//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <View style={loginStyle.boxFundo}>
//         <ImageBackground
//           source={require("./assets/fundoLogin.png")}
//           style={loginStyle.img}
//         ></ImageBackground>
//       </View>

//       {/* <StatusBar style="auto" /> */}

//       <View style={loginStyle.container2}>
//         <text style={loginStyle.txtLogin}>Recuperar Senha</text>
//         <TextInput
//           placeholder="Informe seu Email:"
//           placeholderTextColor="gray"
//           style={loginStyle.TextInput}
//         />

//         <TextInput
//           secureTextEntry={true}
//           placeholder="Informe o Token:"
//           placeholderTextColor="gray"
//           style={[loginStyle.TextInput]}
//         />

//         {/* <button style={loginStyle.btn} onPress={() => navigation.navigate('Dashboard')}>ENTRAR</button> */}

//         <TouchableOpacity
//           onPress={() => navigation.navigate("dashboard")}
//           style={loginStyle.btnLogin}
//         >
//           <Text style={loginStyle.entrarLogin}>Recuperar</Text>
//         </TouchableOpacity>

//         <Text style={loginStyle.txtcodeForge}>
//           Desenvolvido por CodeForge @2024
//         </Text>
//       </View>
//     </View>
//   );
// }


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MyTab({ route }) {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#8A19D6', // Cor do texto e ícone quando selecionado (roxo)
        inactiveTintColor: '#D1D1D1', // Cor do texto e ícone quando não selecionado
      }}
    >
      <Tab.Screen
        name="Início"
        component={DashboardScreen}
        initialParams={{ 
          idFuncionario: route.params.idFuncionario,
          updatedProdutoId: route.params.updatedProdutoId,
          createdProdutoId: route.params.createdProdutoId }}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        initialParams={{ idFuncionario: route.params.idFuncionario }}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Mensagens"
        component={MensagensScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Funcionários"
        component={FuncionarioScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="editarPerfil"
        component={EditarPerfilScreen}     
        options={{
          tabBarButton: () => null, 
          tabBarVisible: false,
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="editarFuncionario"
        component={EditarFuncionarioScreen}     
        options={{
          tabBarButton: () => null, 
          tabBarVisible: false,
          headerShown: false,
        }}
      />

    </Tab.Navigator>

    
  );
}

function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="EsqueciSenha"
        component={EsqueciSenhaScreen}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="dashboard"
        component={MyTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MenuTab"
        component={MyTab}
        options={{ headerShown: false }}
      />

      <Stack.Screen 
        name="VisualizarMenu" 
        component={VisualizarMenuScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Estoque"
        component={MyTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="editarPerfil"
        component={EditarPerfilScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Funcionários"
        component={MyTab}
        options={{ headerShown: false }}
      />


      <Stack.Screen
        name="EditarMenu"
        component={EditarMenuScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="cadastrarMenu"
        component={CadastrarMenuScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
}
