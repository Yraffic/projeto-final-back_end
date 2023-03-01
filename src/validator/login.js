const yup = require("yup")

const loginSchema = yup.object({
  body: yup.object({
    email: yup
      .string("Email ou senha inválidos")
      .email("Email ou senha inválidos")
      .required("O e-mail é obrigatório."),
    senha: yup.string("Senha inválida").required("A senha é obrigatória."),
  }),
})

module.exports = { loginSchema }