import { useEffect, useRef, useState } from "react";
import {
  Button,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TarefaProps {
  tarefa: string;
  finalizado?: boolean;
  isEditando?: boolean;
}
const TAREFAS_CHAVE = "MeuAPP@tarefas";
export default function App() {
  const [tarefa, setTarefa] = useState("");
  const [tarefas, setTarefas] = useState<TarefaProps[]>([]);
  const [tarefaEditada, setTarefaEditada] = useState("");
  const [indexEditando, setIndexEditando] = useState(-1);
  const editandoRef = useRef<TextInput | null>(null);

  useEffect(() => {
    editandoRef.current?.focus();
  }, [indexEditando]);

  useEffect(() => {
    AsyncStorage.getItem(TAREFAS_CHAVE).then((valor) => {
      if (!valor) return;
      setTarefas(JSON.parse(valor));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(TAREFAS_CHAVE, JSON.stringify(tarefas));
  }, [tarefas]);

  const handleAddTarefa = () => {
    if (tarefa === "") return;
    setTarefas([...tarefas, { tarefa, finalizado: false }]);
    setTarefa("");
  };

  const handleEditarTarefa = (index: number) => {
    const newTarefas = [...tarefas];
    if (newTarefas[index].isEditando) {
      newTarefas[index].tarefa = tarefaEditada;
      setTarefaEditada("");
      setIndexEditando(-1);
    }

    if (!newTarefas[index].isEditando) {
      setTarefaEditada(newTarefas[index].tarefa);
      setIndexEditando(index);
    }

    newTarefas[index].isEditando = !newTarefas[index].isEditando;
    setTarefas(newTarefas);
  };

  const handleFinalizarTarefa = (index: number) => {
    const newTarefas = [...tarefas];
    newTarefas[index].finalizado = !newTarefas[index].finalizado;
    setTarefas(newTarefas);
  };

  const handleRemoveTarefa = (index: number) => {
    const newTarefas = [...tarefas];
    newTarefas.splice(index, 1);
    setTarefas(newTarefas);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tituloContainer}>
        <Text style={styles.titulo}>Lista de Tarefas</Text>
        <Text style={styles.subTitulo}>Suas tarefas</Text>
      </View>
      <View style={styles.tarefasContainer}>
        <View style={styles.formulario}>
          <TextInput
            style={styles.input}
            onChangeText={setTarefa}
            value={tarefa}
            placeholder="Sua tarefa"
          />
          <Button title="Adicionar" onPress={handleAddTarefa} />
        </View>
        <FlatList
          data={tarefas}
          keyExtractor={(_, index: number) => index.toString()}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.lista,
                index % 2 === 0 ? styles.lighbg : styles.darkbg,
              ]}
            >
              {item.isEditando ? (
                <TextInput
                  ref={editandoRef}
                  value={tarefaEditada}
                  onChangeText={setTarefaEditada}
                />
              ) : (
                <Text
                  style={[
                    styles.listaDescricao,
                    item.finalizado ? styles.atividadeFinalizada : null,
                  ]}
                >
                  {item.tarefa}
                </Text>
              )}

              <View style={styles.botoesDeAcao}>
                {indexEditando > -1 && index !== indexEditando ? null : (
                  <Pressable
                    style={[
                      styles.listaBotao,
                      item.isEditando ? styles.botaoSalvar : styles.botaoEditar,
                    ]}
                    onPress={() => handleEditarTarefa(index)}
                  >
                    <Icon
                      name={item.isEditando ? "save" : "edit"}
                      color="#FFF"
                      size={15}
                    />
                  </Pressable>
                )}

                {!item.finalizado ? (
                  <Pressable
                    onPress={() => handleFinalizarTarefa(index)}
                    style={[styles.listaBotao, styles.botaoFinalizar]}
                  >
                    <Icon name="check" color="#FFF" size={15} />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => handleFinalizarTarefa(index)}
                    style={[styles.listaBotao, styles.botaoRFinalizar]}
                  >
                    <Icon name="cross" color="#FFF" size={15} />
                  </Pressable>
                )}
                <Pressable
                  onPress={() => handleRemoveTarefa(index)}
                  style={[styles.listaBotao, styles.botaoDelete]}
                >
                  <Icon name="trash" color="#FFF" size={15} />
                </Pressable>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  lighbg: {
    backgroundColor: "#f0f0f0",
  },
  darkbg: {
    backgroundColor: "#e0e0e0",
  },

  listaBotaoTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
  atividadeFinalizada: {
    textDecorationLine: "line-through",
  },
  botaoSalvar: {
    backgroundColor: "#52FF00",
  },
  botaoEditar: {
    backgroundColor: "#ffd700",
  },
  botaoRFinalizar: {
    backgroundColor: "#87CEFA",
  },
  botoesDeAcao: {
    flexDirection: "row",
    gap: 6,
  },
  botaoFinalizar: {
    backgroundColor: "#6f64ff",
  },
  botaoDelete: {
    backgroundColor: "#ff6464",
  },
  listaBotao: {
    padding: 8,
    borderRadius: 2,
  },
  listaDescricao: {
    fontSize: 20,
  },
  lista: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  tarefasContainer: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "column",
  },
  formulario: {
    flex: 1,
    flexDirection: "row",
    gap: 4,
    maxHeight: 60,
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 5,
  },
  tituloContainer: {
    padding: 4,
    gap: 2,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    width: "78%",
    padding: 4,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
  },
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#6f64ff",
  },
  subTitulo: {
    fontSize: 20,
    color: "#a9a8b8",
  },
});
