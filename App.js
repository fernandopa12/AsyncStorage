import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, TouchableOpacity, View,FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState,useEffect } from 'react';

export default function App() {
  const[nomeProduto,setNomeProduto]=useState('')
  const[precoProduto,setPrecoProduto]=useState('')
  const[listProdutos,setListProdutos]=useState([])

  useEffect(()=>{
    buscarDados()
  },[])

  async function salvar(){
    let produtos = [];
    if (await AsyncStorage.getItem("PRODUTOS") !== null) {
      produtos = JSON.parse(await AsyncStorage.getItem("PRODUTOS"));
    }

    produtos.push({nome:nomeProduto,preco:precoProduto})

    await AsyncStorage.setItem("PRODUTOS",JSON.stringify(produtos))
    alert("PRODUTO SALVO")
    buscarDados()

  }

  async function buscarDados(){
    const p = await AsyncStorage.getItem("PRODUTOS")
    setListProdutos(JSON.parse(p))
  }

  async function deletarProduto(index){
    const tempDados = listProdutos;
    const dados = tempDados.filter((item,ind)=>{
      return ind!=index
    })
    setListProdutos(dados)
    await AsyncStorage.setItem("PRODUTOS",JSON.stringify(dados))
  }

  return (
    <View style={styles.container}>
      <Text>CADASTRO</Text>

      <TextInput 
        placeholder='DIGITE O NOME DO PRODUTO'
        style={styles.input}
        value={nomeProduto}
        onChangeText={(value)=>setNomeProduto(value)}
      />

      <TextInput 
        placeholder='DIGITE O PREÇO DO PRODUTO' 
        style={styles.input}
        value={precoProduto}
        onChangeText={(value)=>setPrecoProduto(value)}
      />

      <TouchableOpacity style={styles.btn} onPress={salvar}>
        <Text style={{color:'white'}}>CADASTRAR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={buscarDados}>
        <Text style={{color:'white'}}>BUSCAR DADOS</Text>
      </TouchableOpacity>

      <FlatList
          //Informar os dados para a FlatLIst
          data={listProdutos}

        /* Renderizando itens para exibir na FlatLIst*/
          renderItem={({item,index})=>{

            return(
              <View style={{
                width:300,
                borderWidth:1,
                borderRadius:15,
                height:80,
                alignItems:'center',
                justifyContent:'center',
                marginVertical:3}}>

                <View>
                  <Text style={{fontSize:18}}>NOME:{item.nome} PREÇO:{item.preco}</Text>                
                </View>

                <TouchableOpacity style={{flexDirection:'column',
                justifyContent:"space-around",alignItems:'center' ,backgroundColor:'red',borderRadius:12,width:100,alignSelf:'flex-end',height:25}} onPress={()=>{
                  deletarProduto(index)
                }}>
                  <Text>EXCLUIR</Text>
                </TouchableOpacity>                
              </View>
            )
          }}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap:10
  },
  input:{
    borderWidth:1,
    height:50,
    width:300,
    borderRadius:15
  },
  btn:{
    borderWidth:1,
    height:50,
    width:300,
    borderRadius:15,
    backgroundColor:'blue',
    justifyContent:'center',
    alignItems:"center"
  }
});