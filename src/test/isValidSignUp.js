import userModel from '../DAO/models/user.model.js'; // Asume que has exportado el modelo de usuario correctamente

let testPasados = 0;
let testTotales = 3;

const signUp = async (userData) => {
  try {
    const newUser = await userModel.create(userData);
    console.log("Usuario creado:", newUser);
    return "Usuario creado";
  } catch (error) {
    console.error("Error al intentar crear usuario:", error.message);
    return "Error al intentar crear usuario";
  }
};

// TEST 1 -> Si se pasa un objeto de usuario vacío, la función debe consologuear (“Datos de usuario incompletos”)
console.log(
  "Test 1: Si se pasa un objeto de usuario vacío, la función debe consologuear (“Datos de usuario incompletos”)"
);
let resultTest1 = await signUp({});
if (resultTest1 === "Datos de usuario incompletos") {
  testPasados++;
}

// TEST 2 -> Si se pasa un objeto de usuario con todos los campos requeridos, la función debe consologuear ("Usuario creado")
console.log(
  "Test 2: Si se pasa un objeto de usuario con todos los campos requeridos, la función debe consologuear ('Usuario creado')"
);
let resultTest2 = await signUp({
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@example.com",
  age: 30,
  password: "123456",
});
if (resultTest2 === "Usuario creado") {
  testPasados++;
}

// TEST 3 -> Si se pasa un objeto de usuario con campos faltantes, la función debe consologuear ("Error al intentar crear usuario")
console.log(
  "Test 3: Si se pasa un objeto de usuario con campos faltantes, la función debe consologuear ('Error al intentar crear usuario')"
);
let resultTest3 = await signUp({
  firstName: "Jane",
  email: "janedoe@example.com",
  age: 25,
});
if (resultTest3 === "Error al intentar crear usuario") {
  testPasados++;
}

// Salidas
if (testPasados === testTotales) {
  console.log("Todos los test pasaron con éxito");
} else {
  console.log(`Se pasaron ${testPasados} de un total de ${testTotales} test`);
}
