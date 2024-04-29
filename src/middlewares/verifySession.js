
const isAuthenticated = (req, res, next) => {
    if (!req.session.passport || !req.session.passport.user) {
      return res.redirect("/");
    }
    next();
};
  
export default isAuthenticated;