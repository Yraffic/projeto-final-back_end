const { knex } = require("../config/database")

const checkPaymentDate = async (req, res, next) => {
	const { id, detailId } = req.params
	const { filter, status } = req.query
	const conditions = {}

	if (id) {
		conditions.id_cliente = id
	}

	if (detailId) {
		conditions.id = detailId
	}

	if (status) {
		conditions.status = status
	}

	try {
		let query = knex("cobrancas")
			.where(conditions)
			.orderBy("id", "asc")
			.orderBy("nome", "asc")

		if (filter) {
			query = query.orWhere("nome", "ILIKE", `%${filter}%`)

			if (!isNaN(Number(filter))) {
				query = query.orWhere("id", filter)
			}
		}
		const charges = await query

		const currentDate = new Date()

		const updatedListCharges = []
		const overDueChargesId = []

		for (let charge of charges) {
			if (
				charge.status === "pendente" &&
				charge.vencimento < currentDate
			) {
				charge.status = "vencido"
				overDueChargesId.push(charge.id)
			}

			updatedListCharges.push(charge)
		}

		await knex("cobrancas")
			.update({ status: "vencido" })
			.where(conditions)
			.whereIn("id", overDueChargesId)

		req.charges = updatedListCharges
		return next()
	} catch {
		res.status(500).json({ mensagem: "Erro interno do servidor" })
	}
}

module.exports = {
	checkPaymentDate,
}
