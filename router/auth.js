const { Router } = require("express");
const { check } = require("express-validator");
const { crearUsuario, login, renewToken } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
//path =====> api/login
const router = Router();

//crear usuario
router.post(
  "/new",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El password es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
  ],
  validarCampos,
  crearUsuario
);

//login
router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
  ],
  validarCampos,
  login
);

//revalidar token
router.get("/renew", validarJWT, renewToken);

module.exports = router;
