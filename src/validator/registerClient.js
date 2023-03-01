const yup = require("yup");

const schemaClient = yup.object({
  body: yup.object({
    nome: yup
      .string()
      .required("O nome é obrigatório")
      .trim()
      .min(1, "O nome é obrigatório")
      .typeError("O nome deve ser do tipo texto"),
    email: yup
      .string()
      .email("O email não está em formato válido")
      .required("O email é obrigatório")
      .trim()
      .min(1, "O email é obrigatório")
      .typeError("O email deve ser do tipo texto"),
    cpf: yup
      .string()
      .required("O cpf é obrigatório")
      .trim()
      .min(11, "O cpf deve conter no mínimo 11 caracteres")
      .typeError("O cpf deve ser do tipo texto"),
    telefone: yup
      .string()
      .required("O telefone é obrigatório")
      .trim()
      .min(1, "O telefone é obrigatório")
      .typeError("O telefone deve ser do tipo texto"),
    cep: yup.string().trim().optional(),
    logradouro: yup.string().trim().optional(),
    complemento: yup.string().trim().optional(),
    bairro: yup.string().trim().optional(),
    cidade: yup.string().trim().optional(),
    estado: yup.string().trim().optional(),
  }),
});

module.exports = {
  schemaClient,
};
