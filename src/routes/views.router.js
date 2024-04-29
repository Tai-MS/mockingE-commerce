import express from "express";
import userModel from "../DAO/models/user.model.js";
import ticketController from "../controllers/ticket.controller.js";
import UserDTO from "../DTO/user.dto.js";
import isAuthenticated from "../middlewares/verifySession.js";

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/", (req, res) => {
  res.render('login', { user: req.user })
});

router.get("/profile", isAuthenticated, (req, res) => {
  const { firstName, lastName, cart, email, age } = req.session.passport.user;
  const userDTO = new UserDTO(firstName, lastName, cart, email, age)
  console.log("DTO", req.session.passport.user);
  const name = userDTO.fullName().firstName
  const secondName = userDTO.fullName().lastName
  const cartId2 = userDTO.fullName().cartId
  const email2 = userDTO.fullName().email
  const age2 = userDTO.fullName().age
  
  console.log("as", cartId2);
  res.render("profile", { name, secondName, cartId2, email2, age2 });
});


router.get('/products', isAuthenticated, async(req, res) => {
  const queryParams = {
    sort: req.query.sort,
    category: req.query.category,
    page: req.query.page,
    limit: req.query.limit,
    status: req.query.status,
    username: req.cookies['username'] || (req.session.username ? req.session.username : undefined)
  };
  const role = await userModel.findOne({firstName: req.cookies['username']})
  console.log("Views router",role);
  const rol = role.role
  const cart = role.cart
  const userName = role.firstName

if(queryParams.username !== undefined && req.session.passport !== undefined){
    queryParams.cartId = req.session.passport.user.cart
    res.render('products', {queryParams, rol, cart, userName})
}else{
  res.redirect('/')
}
})


router.get('/failregister', async(req, res) => {
  res.send('Mail already in use.')
})

router.get('/faillogin', async(req, res) => {
  res.send('Invalid credentials.')
})

router.get('/changepass', (req, res) => {
  res.render('changePass')
})

router.get('/chat', isAuthenticated,(req, res) => {
  const username = req.session.passport.user.firstName
  res.render('chat', {username})
})

router.get('/cart/:cid', isAuthenticated,async(req, res) => {
  let response = {cid: req.params.cid}
  res.render('cart', response)
})


// router.get('/:cid/purchase', isAuthenticated,async(req, res) => {
//   return res.json(ticketController.generate(req, res))
// })

export default router;