export default class UserDTO {
  constructor(firstName, lastName, cartId, email, age) { // Ajusta el constructor para recibir firstName y lastName
    this.firstName = firstName; // Agrega firstName como propiedad del DTO
    this.lastName = lastName; // Agrega lastName como propiedad del DTO
    this.cartId = cartId
    this.email = email
    this.age = age
  }

  fullName() {

    const userInfo = {firstName: this.firstName, lastName:this.lastName, cartId:this.cartId, email: this.email, age: this.age}
    return userInfo; 
  }
}
