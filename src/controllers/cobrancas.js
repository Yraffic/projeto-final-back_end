const { knex } = require("../config/database")

const createCharge = async (req, res) => {
	let { id_cliente, nome, descricao, status, valor, vencimento } = req.body
	const currentDate = new Date()
	vencimento = new Date(vencimento)

	try {
		const clientData = await knex("clientes")
			.where({ id: id_cliente })
			.returning("*")

		if (clientData[0].nome !== nome) {
			return res.status(200).json({
				mensagem:
					"O nome do cliente informado não condiz com o ID encontrado",
			})
		}

		if (status === "pendente" && vencimento < currentDate) {
			status = "vencido"
		}

		const newCharge = await knex("cobrancas")
			.insert({
				id_cliente,
				nome,
				descricao,
				status,
				valor,
				vencimento,
			})
			.returning("*")

		return res.status(201).json(newCharge[0])
	} catch {
		return res.status(500).json({ mensagem: "Erro interno do servidor!" })
	}
}

const listCharges = async (req, res) => {
	return res.status(200).json(req.charges)
}

const updateCharge = async (req, res) => {
	let { descricao, status, valor, vencimento } = req.body
	const { id } = req.params
	vencimento = new Date(vencimento)
	currentDate = new Date()

	try {
		const chargeData = await knex("cobrancas").where({ id }).returning("*")

		if (chargeData.length < 1) {
			return res
				.status(200)
				.json({ mensagem: "A cobrança informado não foi localizada" })
		}

		let updateValues = {
			descricao,
			status:
				status === "pendente" && vencimento < currentDate
					? "vencido"
					: status,
			valor,
			vencimento,
		}

		const updatedCharge = await knex("cobrancas")
			.update(updateValues)
			.where({ id })
			.returning("*")

		return res.status(201).json(updatedCharge[0])
	} catch (error) {
		res.status(500).json({ mensagem: "Erro interno do servidor" })
	}
}

const deleteCharge = async (req, res) => {
	const { id } = req.params

	try {
		const chargeData = await knex("cobrancas").where({ id }).returning("*")

		if (chargeData.length < 1) {
			return res
				.status(200)
				.json({ mensagem: "A cobrança informada não foi localizada" })
		}

		if (chargeData[0].status === "pendente") {
			const deleteCharge = await knex("cobrancas").del().where({ id })

			return res
				.status(201)
				.json({ mensagem: "Cobrança excluida com sucesso!" })
		} else {
			return res
				.status(403)
				.json({ mensagem: "Não é possivel excluir essa cobrança" })
		}
	} catch (error) {
		res.status(500).json({ mensagem: "Erro interno do servidor" })
	}
}

const detailCharge = async (req, res) => {
	const { charges } = req

	if (charges?.length === 0) {
		return res.status(404).json({ mensagem: "Cobrança não encontrada" })
	}

	return res.status(200).json(charges[0])
}

const listChargesBalance = async (_req, res) => {
	try {
		const values = await knex("cobrancas")
			.select("status")
			.sum("valor")
			.groupBy("status")

		if (values.length === 0) {
			return res.status(200).json(values)
		}

		const balance = values.reduce((acumulator, currentValue) => {
			return {
				...acumulator,
				[currentValue.status]: currentValue.sum,
			}
		}, {})

		return res.json(balance)
	} catch {
		return res.status(500).json({ mensagem: "Erro interno do servidor" })
	}
}

module.exports = {
	listChargesBalance,
	createCharge,
	listCharges,
	updateCharge,
	deleteCharge,
	detailCharge,
}
