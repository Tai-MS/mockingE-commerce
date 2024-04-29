import userModel from '../DAO/models/user.model.js'; // Asume que has exportado el modelo de usuario correctamente

let user = "coderUser",
  password = "123";

let testPasados = 0;
let testTotales = 5;

const login = async (username, pass) => {
  if (username === "" && pass === "") {
    console.log("No se ha proporcionado un usuario ni un password");
    return "No se ha proporcionado un usuario ni un password";
  } else if (username === "") {
    console.log("No se ha proporcionado un usuario");
    return "No se ha proporcionado un usuario";
  } else if (pass === "") {
    console.log("No se ha proporcionado un password");
    return "No se ha proporcionado un password";
  } else {
    try {
      const user = await userModel.findOne({ email: username, password: pass }).exec();
      if (!user) {
        console.log("Credenciales incorrectas");
        return "Credenciales incorrectas";
      } else {
        console.log("logueado");
        return "logueado";
      }
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
      return "Error al intentar iniciar sesión";
    }
  }
};
//TEST 1 -> Si se pasa un password vacío, la función debe consologuear (“No se ha proporcionado un password”)
console.log(
  "Test 1: Si se pasa un password vacío, la función debe consologuear (“No se ha proporcionado un password”)"
);
let resultTest1 = login("coderUser", "");
if (resultTest1 === "No se ha proporcionado un password") {
    testPasados++;
  }

//TEST 2 -> Si se pasa un usuario vacío, la función debe consologuear (“No se ha proporcionado un usuario”)
console.log(
  "Test 2: Si se pasa un usuario vacío, la función debe consologuear (“No se ha proporcionado un usuario”)"
);
let resultTest2 = login("", "123");
if (resultTest2 === "No se ha proporcionado un usuario") {
    testPasados++;
  }
//TEST 3 -> Si se pasa un password incorrecto, consologuear (“Contraseña incorrecta”)
console.log(
  "Test 3: Si se pasa un password incorrecto, consologuear (“Contraseña incorrecta”)"
);
let resultTest3 = login("coderUser", 321);
if (resultTest3 === "Contraseña incorrecta") {
    testPasados++;
  }
//TEST 4 -> Si se pasa un usuario incorrecto, consologuear (“Credenciales incorrectas”)
console.log(
  "Test 4: Si se pasa un usuario incorrecto, consologuear (“Credenciales incorrectas”)"
);
let resultTest4 = login("Manzana", "123");
if (resultTest4 === "Credenciales incorrectas") {
    testPasados++;
  }
//TEST 5 -> Si  el usuario y contraseña coinciden, consologuear (“logueado”)
console.log(
  "Test 5: Si  el usuario y contraseña coinciden, consologuear (“logueado”)"
);
let resultTest5 = login("coderUser", "123");
if (resultTest5 === "logueado") {
    testPasados++;
  }
//Salidas
if (testPasados === testTotales) {
  console.log("Todos los test pasaron con éxito");
} else {
  console.log(`Se pasaron ${testPasados} de un total de ${testTotales} test`);
}