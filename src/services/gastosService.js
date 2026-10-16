import gastosGuardados from "../data/gastos.json"
import AsyncStorage from "@react-native-async-storage/async-storage"

const KEY = "@gastos"
let gastos = [...gastosGuardados]

export async function getGastos(){
  try {
    const guardados = await AsyncStorage.getItem(KEY)

    // si ya existe algo trae los gastos 
    // si es null se guardan los ejemplos cargados en el json
    if(guardados !== null){
      gastos = JSON.parse(guardados);
    }else{
      await AsyncStorage.setItem(KEY, JSON.stringify(gastos))
    }
    
  } catch (error) {
    console.log("Error leyendo gastos", error)
  }
  return gastos
}

// Versión síncrona para el primer render (Story 5 + tests).
// Devuelve la copia en memoria sin tocar Storage.
export function getGastosSync() {
  return gastos;
}

export async function addGasto(nuevoGasto){

  if(!nuevoGasto.nombre || nuevoGasto.amount == null) return "Falta llenar campos"
  const nuevo = {
    id: nuevoGasto.id != null ? String(nuevoGasto.id) : Date.now().toString(),
    nombre: nuevoGasto.nombre,
    categoria: nuevoGasto.categoria ?? "Otro",
    amount: Number(nuevoGasto.amount),
  };
  gastos.unshift(nuevo)
  await AsyncStorage.setItem(KEY,JSON.stringify(gastos))

  return nuevo
}

export async function  deleteGasto(id) {
  const idStr = String(id);
  gastos = gastos.filter(g => String(g.id) !== idStr)
  await AsyncStorage.setItem(KEY,JSON.stringify(gastos))
  return gastos
}