const jwt = require("jsonwebtoken")
const { knex } = require("../config/database")

const checkLoggedInUser = async (req, res, next) => {
	const { authorization } = req.headers

	if (!authorization) {
		return res.status(401).json({ mensagem: "Não autorizado." })
	}

	const token = authorization.split(" ")[1]

	try {
		const { id } = jwt.verify(token, process.env.JWT_SECRET)

		const user = await knex("usuarios").where({ id })

		if (user.length < 1) {
			return res.status(401).json({ mensagem: "Não autorizado." })
		}

		req.user = user[0]

		next()
	} catch {
		return res.status(401).json({ mensagem: "Não autorizado." })
	}
}

module.exports = checkLoggedInUser
