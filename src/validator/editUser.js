const yup = require("yup");

const editUser = yup.object({
  body: yup.object({
    nome: yup
      .string()
      .required("O nome é obrigatório")
      .trim()
      .min(1, "O nome é obrigatório")
      .typeError("O nome deve ser do tipo texto"),
    email: yup
      .string()
      .email("Email inválido")
      .required("O email é obrigatório")
      .trim()
      .min(1, "O email é obrigatório")
      .typeError("O email deve ser do tipo texto"),
    senha: yup
      .string()
      .trim()
      .optional()
      .typeError("A senha deve ser do tipo texto"),
    cpf: yup.string().trim().optional(),
    telefone: yup.string().trim().optional(),
  }),
});

module.exports = {
  editUser,
};
