const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
	invoiceNo: {
		type: Number,
		required: [true, "Invoice number is required"]
	},
	invoiceDate: {
		type: String,
		required: [true, "Date is required"]
	},
	customerName: {
		type: String,
		required: [true, "Customer name is required"]
	}, 
	productName: {
		type: String, 
		required: [true, "Product name is required"]
	},
	productQuantity: {
		type: Number,
		required: [true, "Product quantity is required"]
	},
	productPrice: {
		type: Number,
		required: [true, "Product price is required"]
	},
	totalInvoiceAmount: {
		type: Number,
		required: [true, "Total invoice amount is required"]
	},
	isActive: {
		type: Boolean,
		default: true
	}

})

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: [true, "First name is required"]
	},
	lastName: {
		type: String,
		required: [true, "Last name is required"]
	},
	email: {
		type: String,
		required: [true, "Email is required"]
	},
	password: {
		type: String,
		required: [true, "Password is required"]
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	invoice: [invoiceSchema]
})

module.exports = mongoose.model("User", userSchema)