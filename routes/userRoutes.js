// import frameworks
const express = require("express");
const router = express.Router();
const auth = require("../auth");

// import Routes
const userController = require("../controllers/userController");

//Route to check for duplicate emails
router.post("/checkEmail", (req, res) => {
	userController.checkEmail(req.body).then(resultFromEmailExist => res.send(resultFromEmailExist));
});

//Route for user registration
router.post("/register", (req, res) => {
	userController.registerUser(req.body).then(resultFromRegister => res.send(resultFromRegister));
});

//Route for loggin in
router.post("/login", (req, res) => {
	userController.loginUser(req.body).then(resultFromLogin => res.send(resultFromLogin));
});

//Route for getting user details
router.get("/details", auth.verify, (req, res) => {
	const userId = auth.decode(req.headers.authorization).id
	userController.getProfile(userId).then(resultFromGetProfile => res.send(resultFromGetProfile))
});

//routes for creating an invoice
router.post("/createInvoice", auth.verify, (req, res) => {
	const userId = auth.decode(req.headers.authorization).id;
	userController.createInvoice(userId, req.body).then(resultFromCreateInvoice => res.send(resultFromCreateInvoice));
});

//route for getting all the invoice
router.get("/getAllInvoice", auth.verify, (req, res) => {
	const userId = auth.decode(req.headers.authorization).id;
	userController.getAllInvoice(userId).then(resultFromGettingInvoice => res.send(resultFromGettingInvoice))
})

//route for getting per page invoice
router.post("/getPerPageInvoices", auth.verify, (req, res) => {
	const userId = auth.decode(req.headers.authorization).id;
	userController.getPerPageInvoice(userId, req.body).then(resultFromGettingInvoice => res.send(resultFromGettingInvoice))
})

//router for getting a specific invoice
router.get("/getSpecificInvoice/:invoiceId", auth.verify, (req, res) => {
	const userId = auth.decode(req.headers.authorization).id;
	userController.getSpecificInvoice(userId, req.params).then(resultFromGetSpecific => res.send(resultFromGetSpecific))
})
//route for deleting the invoice
router.post('/deleteInvoice/:invoiceId', auth.verify, (req, res) => {
	const userId = auth.decode(req.headers.authorization).id;
	userController.deleteInvoice(userId, req.params).then(resultFromDeleteInvoice => res.send(resultFromDeleteInvoice));
});

//route for updating the invoice
router.post('/updateInvoice/:invoiceId', auth.verify, (req, res) => {
	const userId = auth.decode(req.headers.authorization).id;
	userController.updateInvoice(userId, req.params, req.body).then(resultFromDeleteInvoice => res.send(resultFromDeleteInvoice));
});

module.exports = router;