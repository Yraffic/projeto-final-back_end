const { isInTheDataBase } = require("../utils/db")
const { knex } = require("../config/database")

const registerClient = async (req, res) => {
	const {
		nome,
		email,
		cpf,
		telefone,
		cep,
		logradouro,
		complemento,
		bairro,
		cidade,
		estado,
	} = req.body

	try {
		const { response: existingEmail } = await isInTheDataBase(
			{ email: email },
			"clientes"
		)

		if (existingEmail) {
			return res.status(400).json({
				erro: {
					email: "Já existe um usuário cadastrado com email informado.",
				},
			})
		}

		const { response: existingCpf } = await isInTheDataBase(
			{ cpf: cpf },
			"clientes"
		)

		if (existingCpf) {
			return res.status(400).json({
				erro: {
					cpf: "Já existe um usuário cadastrado com cpf informado.",
				},
			})
		}

		const newClient = await knex("clientes")
			.insert({
				nome,
				email,
				cpf,
				telefone,
				cep,
				logradouro,
				complemento,
				bairro,
				cidade,
				estado,
			})
			.returning("*")

		return res.status(201).json(newClient[0])
	} catch {
		return res.status(500).json({ mensagem: "Erro interno do servidor!" })
	}
}

const listClients = async (req, res) => {
	const { filter, status } = req.query

	try {
		let query = knex("clientes")

		if (filter) {
			query = query
				.where("nome", "ILIKE", `%${filter}%`)
				.orWhere("email", "ILIKE", `%${filter}%`)
				.orWhere("cpf", "ILIKE", `%${filter}%`)
		}

		const clients = await query
		const currentDate = new Date()

		for (let i = 0; i < clients.length; i++) {
			const charges = await knex("cobrancas").where(
				"id_cliente",
				clients[i].id
			)

			if (charges.length === 0) {
				clients[i] = { ...clients[i], status: "Em dia" }
			}

			for (let j = 0; j < charges.length; j++) {
				if (
					(charges[j].status === "vencido" ||
						charges[j].status === "pendente") &&
					charges[j].vencimento < currentDate
				) {
					clients[i] = { ...clients[i], status: "Inadimplente" }
					break
				} else {
					clients[i] = { ...clients[i], status: "Em dia" }
				}
			}
		}

		if (status) {
			const filteredClients = clients.filter((client) => {
				return client.status === status
			})

			return res.status(200).json(filteredClients)
		}

		return res.status(200).json(clients)
	} catch (error) {
		return res.status(400).json(error.message)
	}
}

const detailClient = async (req, res) => {
	try {
		const { id } = req.params
		const dataFromLoggedUser = req.user
		if (dataFromLoggedUser.id) {
			const getClient = await knex("clientes").where("id", id).first()

			if (!getClient) {
				return res
					.status(200)
					.json({ mensagem: "O cliente informado não foi localizado" })
			}

			return res.status(201).json(getClient)
		}
	} catch {
		res.status(500).json({ mensagem: "Erro interno do servidor" })
	}
}

const updateClient = async (req, res) => {
	const { id } = req.params

	const {
		nome,
		email,
		cpf,
		telefone,
		cep,
		logradouro,
		complemento,
		bairro,
		cidade,
		estado,
	} = req.body

	try {
		const clientData = await knex("clientes").where({ id }).returning("*")

		if (clientData.length < 1) {
			return res
				.status(200)
				.json({ mensagem: "O cliente informado não foi localizado" })
		}

		const { response: responseEmail, data: dataEmail } =
			await isInTheDataBase({ email }, "clientes")

		if (responseEmail && dataEmail.email !== clientData[0].email) {
			return res.status(400).json({
				erro: {
					email:
						"O email informado ja está sendo utilizado por outro cliente.",
				},
			})
		}

		const { response, data } = await isInTheDataBase({ cpf }, "clientes")

		if (response && data.cpf !== clientData[0].cpf) {
			return res.status(400).json({
				erro: {
					cpf: "O cpf informado ja está sendo utilizado por outro cliente.",
				},
			})
		}

		let updateValues = {
			nome,
			email,
			cpf,
			telefone,
			cep,
			logradouro,
			complemento,
			bairro,
			cidade,
			estado,
		}

		if (cpf) {
			updateValues.cpf = cpf
		}
		if (telefone) {
			updateValues.telefone = telefone
		}

		const updatedClient = await knex("clientes")
			.update(updateValues)
			.where({ id })
			.returning("*")

		await knex("cobrancas").update({ nome }).where({ id_cliente: id })

		const { senha: _, ...dataFromUpdatedClient } = updatedClient[0]
		return res.status(201).json(dataFromUpdatedClient)
	} catch {
		return res.status(500).json({ mensagem: "Erro interno do servidor!" })
	}
}

module.exports = {
	registerClient,
	listClients,
	detailClient,
	updateClient,
}
