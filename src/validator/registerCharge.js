const yup = require("yup")

const schemaCharge = yup.object({
	body: yup.object({
		id_cliente: yup
			.string()
			.required("O campo id_cliente é obrigatório")
			.trim()
			.min(1, "O campo id_cliente é obrigatório")
			.typeError("O campo id_cliente deve ser do tipo texto"),
		nome: yup
			.string()
			.required("O campo nome é obrigatório")
			.trim()
			.min(1, "O campo nome é obrigatório")
			.typeError("O campo nome deve ser do tipo texto"),
		descricao: yup
			.string()
			.required("O campo descrição é obrigatório")
			.trim()
			.min(1, "O campo descrição é obrigatório")
			.typeError("O campo descrição deve ser do tipo texto"),
		status: yup
			.string()
			.required("O campo status é obrigatório")
			.trim()
			.min(1, "O campo status é obrigatório")
			.typeError("O campo status deve ser do tipo texto"),
		valor: yup
			.string()
			.required("O campo valor é obrigatório")
			.trim()
			.min(1, "O campo valor é obrigatório")
			.typeError("O campo valor deve ser do tipo texto"),
		vencimento: yup
			.date("Data inválida")
			.required("O campo vencimento é obrigatório")
			.typeError("O campo vencimento deve ser do tipo texto"),
	}),
})

module.exports = {
	schemaCharge,
}
