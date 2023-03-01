const yup = require("yup")

const schemaUpdateCharge = yup.object({
	body: yup.object({
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
			.string()
			.required("O campo vencimento é obrigatório")
			.trim()
			.min(1, "O campo vencimento é obrigatório")
			.typeError("O campo vencimento deve ser do tipo texto"),
	}),
})

module.exports = {
	schemaUpdateCharge,
}
