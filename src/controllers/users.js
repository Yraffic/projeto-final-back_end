const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { isInTheDataBase } = require("../utils/db")
const { knex } = require("../config/database")

const registerUser = async (req, res) => {
	const { nome, email, senha } = req.body

	try {
		const { response } = await isInTheDataBase(
			{ email: email },
			"usuarios"
		)

		if (response) {
			return res.status(400).json({
				erro: {
					email: "Já existe um usuário cadastrado com email informado.",
				},
			})
		}
		const encryptedPassword = await bcrypt.hash(senha, 10)

		const newUser = await knex("usuarios")
			.insert({
				nome,
				email,
				senha: encryptedPassword,
			})
			.returning("*")

		const { senha: _, ...registeredUser } = newUser[0]

		return res.status(201).json(registeredUser)
	} catch {
		return res.status(500).json({ mensagem: "Erro interno do servidor!" })
	}
}

const loginUser = async (req, res) => {
	const { email, senha } = req.body

	try {
		const { response, data: user } = await isInTheDataBase(
			{ email },
			"usuarios"
		)

		if (!response) {
			return res
				.status(400)
				.json({ erro: { email: "Email ou senha inválidos." } })
		}

		const validatePassword = await bcrypt.compare(senha, user.senha)

		if (!validatePassword) {
			return res
				.status(400)
				.json({ mensagem: "Email ou senha inválidos." })
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: "8h",
		})

		const { senha: _, ...userLogged } = user

		return res.json({ usuario: userLogged, token })
	} catch {
		return res.status(500).json({ mensagem: "Erro interno do servidor" })
	}
}

const updateUser = async (req, res) => {
	const { nome, email, senha, cpf, telefone } = req.body

	try {
		const { response: responseEmail, data: dataEmail } =
			await isInTheDataBase({ email }, "usuarios")

		if (responseEmail && dataEmail.email !== req.user.email) {
			return res.status(400).json({
				erro: {
					email:
						"O email informado ja está sendo utilizado por outro usuário.",
				},
			})
		}

		const { response, data } = await isInTheDataBase({ cpf }, "usuarios")

		if (response && data.cpf !== req.user.cpf) {
			return res.status(400).json({
				erro: {
					cpf: "O cpf informado ja está sendo utilizado por outro usuário.",
				},
			})
		}
		const { id, senha: senhaLoggedUser } = req.user

		let encryptedPassword = senhaLoggedUser
		if (senha) {
			encryptedPassword = await bcrypt.hash(senha, 10)
		}

		let updateValues = {
			nome,
			email,
			senha: encryptedPassword,
		}
		if (cpf) {
			updateValues.cpf = cpf
		}
		if (telefone) {
			updateValues.telefone = telefone
		}

		const updatedUser = await knex("usuarios")
			.update(updateValues)
			.where({ id })
			.returning("*")

		const { senha: _, ...dataUpdatedUser } = updatedUser[0]

		return res.status(201).json(dataUpdatedUser)
	} catch (error) {
		return res.status(500).json({ mensagem: "Erro interno do servidor." })
	}
}

module.exports = {
	registerUser,
	loginUser,
	updateUser,
}
