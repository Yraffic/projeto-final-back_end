const yup = require("yup")

const schemaUser = yup.object({
  body: yup.object({
    nome: yup
      .string()
      .matches(
        /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u,
        "Insira um nome válido."
      )
      .required("O nome é obrigatório."),
    email: yup
      .string("E-mail inválido.")
      .email("E-mail inválido.")
      .required("O e-mail é obrigatório."),
    senha: yup.string("Senha inválida.").required("A senha é obrigatória."),
  }),
})

module.exports = {
    schemaUser
}