import express from "express";
import  userController from '../controllers/users.controller.js'
import passport from 'passport'
import ticketController from "../controllers/ticket.controller.js";
import isAuthenticated from "../middlewares/verifySession.js";

const router = express.Router();

router.post('/register', (req, res, next) => {
  userController.createUser(req, res, next)
});

router.post('/login', (req, res) => {
  userController.login(req, res)
})

router.post('/changepass', async(req, res) => {
  userController.changePassword(req, res)
})

router.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  async(req, res) => {
});

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  async(req, res) => {
    req.session.user  = req.user;
    res.cookie('username', req.user, {maxAge: 100000})
    console.log("router session",req.session);
    res.redirect(`/products`)
  });

router.post('/logout', isAuthenticated, (req, res) => {
  userController.logout(req, res)
});

router.post('/:cid/purchase', async(req, res) => {
  ticketController.generate(req, res)
})

router.get('/current', isAuthenticated, (req, res) => {
  userController.current(req, res)
})

export default router;