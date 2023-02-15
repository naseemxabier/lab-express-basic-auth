const router = require("express").Router();
const User = require("../models/User.model")
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
/* GET home page */
router.get("/", isLoggedOut, (req, res, next) => {
res.render("users/signin")
})
router.post("/", isLoggedOut, (req, res, next) => {
  let {username, password}= req.body
  if(username == "" || password == "") {
    res.render("users/signin", {mensajeError: "Values needed!"})
}

User.find({username})
.then(result => {
  console.log(result)
  if(result.length !=0) {
    res.render("users/signin", {mensajeError: "Existent user!"})
  }
})
.catch(err => next(err))
let salt = bcrypt.genSaltSync(saltRounds);
let passwordEncriptado = bcrypt.hashSync(password, salt)

User.create({
  username: username,
  password: passwordEncriptado
})
.then(result => {
  res.redirect("/users/login")
})
.catch(err => next(err))
})
router.get("/users/login", isLoggedOut, (req, res, next) => {
  res.render("users/login")
})

router.post("/users/login", isLoggedOut, (req, res, next)=> {
  let {username, password} = req.body
if(username == "" || password == "") {
res.render("users/profile", {mensajeError: "Values needed!"})}

User.find({username})
.then(result => {
if(result.length != 0) {
  res.render("users/profile")
}

if(bcrypt.compareSync(password, result[0].password)) {
  req.session.currentUser = username;
  res.redirect("/users/profile");
} else {
  res.render("users/login", { mensajeError: "Incorrect!!" });
}
})
.catch(err => next(err))

})

router.get("/users/profile", isLoggedIn, (req, res, next) => {
  res.render("users/profile")
})

router.get("/users/logout", isLoggedIn, (req, res, next)=>{
  req.session.destroy(err => {
    if(err) next(err);
    else res.redirect("/users/login");
  });
});


module.exports = router;
