module.exports = (req, res, next) => {
    if(req.session.currentUser) res.redirect("/users/profile");
    else next();
  }