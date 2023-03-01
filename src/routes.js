const express = require("express")
const {
	registerClient,
	listClients,
	detailClient,
	updateClient,
} = require("./controllers/client")
const {
	registerUser,
	loginUser,
	updateUser,
} = require("./controllers/users")
const checkLoggedInUser = require("./middleware/checkToken")
const { editUser } = require("./validator/editUser")
const { loginSchema } = require("./validator/login")
const { schemaClient } = require("./validator/registerClient")
const { schemaUser } = require("./validator/signup")
const { validate } = require("./middleware/validate")
const {
	createCharge,
	listCharges,
	updateCharge,
	deleteCharge,
	detailCharge,
	listChargesBalance
} = require("./controllers/cobrancas")
const { schemaCharge } = require("./validator/registerCharge")
const { schemaUpdateCharge } = require("./validator/updateCharge")
const { checkPaymentDate } = require("./middleware/cobrancas")

const routes = express()

routes.post("/user", validate(schemaUser), registerUser)
routes.post("/login", validate(loginSchema), loginUser)

routes.use(checkLoggedInUser)

routes.patch("/user", validate(editUser), updateUser)
routes.post("/client", validate(schemaClient), registerClient)
routes.get("/clients", listClients)
routes.get("/client/:id", detailClient)
routes.patch("/client/:id", validate(schemaClient), updateClient)
routes.post("/charge", validate(schemaCharge), createCharge)
routes.get("/charges", checkPaymentDate, listCharges)
routes.get("/charges/balance", listChargesBalance)
routes.get("/charges/:id", checkPaymentDate, listCharges)
routes.patch("/charge/:id", validate(schemaUpdateCharge), updateCharge)
routes.delete("/charge/:id", deleteCharge)
routes.get("/charge/:detailId", checkPaymentDate, detailCharge)

module.exports = routes
