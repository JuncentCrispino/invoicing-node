const User = require("../models/user");
const auth = require("../auth");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

//function for checking duplicate email
module.exports.checkEmail = (body) => {
	return User.find({email: body.email}).then(result => {
		if(result.length > 0){
			return true; // duplicate email exist
		}else{
			return false; // no email duplicate found
		};
	});
};

//function for user registration
module.exports.registerUser = (body) => {
	let newUser = new User({
		firstName: body.firstName,
		lastName: body.lastName,
		email: body.email,
		password: bcrypt.hashSync(body.password, 10)
	});
	return newUser.save().then((user, error) => {
		if(error){
			return false; //did not register the user
		}else{
			return true; //successfully registered the user
		};
	});
};

//function for user login
module.exports.loginUser = (body) => {
	return User.findOne({email: body.email}).then(result => {
		if(result === null){
			return {message: "emailDoesNotExist"}; //user does not exist
		}else{
			const isPasswordCorrect = bcrypt.compareSync(body.password, result.password)

			if(isPasswordCorrect){
				return {access: auth.createAccessToken(result.toObject())};//password authentication success
			}else{
				return {message: "passwordIsIncorrect"}; //password authentication failed
			};
		};
	});
};

//function for getting user details
module.exports.getProfile = (userId) => {
	return User.findById(userId).then(result => {
		result.password = undefined;
		return result;
	});
};

//function for creating an invoice
module.exports.createInvoice = (userId, body) => {
	const invoiceData = {
		invoiceNo: body.invoiceNo,
		invoiceDate: body.invoiceDate,
		customerName: body.customerName,
		productName: body.productName,
		productQuantity: body.productQuantity,
		productPrice: body.productPrice,
		totalInvoiceAmount: body.totalInvoiceAmount
	};
	return User.findById(userId).then(addInvoice => {
		addInvoice.invoice.push(invoiceData)
		return addInvoice.save().then((result, error) => {
			if(error){
				return false;
			}else{
				return true; 
			};
		});
	});
};

module.exports.getAllInvoice = (userId) => {
	return User.findById(userId, 'invoice').then(result => {
		return result;
	});
};

//function for getting all the invoice
module.exports.getPerPageInvoice = (userId, data) => {

	const sortBy = data.sortBy;
	const order = data.order;
	const limit = data.limit;
	const skip = ((data.currentPage - 1) * limit);
	const _id = mongoose.Types.ObjectId(userId)

	return User.aggregate([
		{$match: {_id: _id}},//find the matching document in the collection
		{$unwind: {path: "$invoice"}}, //copies the invoice array field and creates individual top level object in each subdocument.
		{$replaceRoot: {newRoot: '$invoice'}} //the newRoot replaces the top level document by subdocument ('invoice', in this case only) 
		])
		.sort({[sortBy]: order})//enclose the variable by bracket to read the value of the variable declared above
		.skip(skip)
		.limit(limit)
		.then(result => {
			return result;	
		
	});
};

//function for getting specific course
module.exports.getSpecificInvoice = (userId, params) => {
	const invoiceId = params.invoiceId
	return User.findById(userId).then(result => {
		let invoiceArr = result.invoice
		for(let i = 0; i < invoiceArr.length; i++){
			if(invoiceArr[i]._id == invoiceId){
				return invoiceArr[i]
			}
		};	
	});
};

//function for deleting an invoice
module.exports.deleteInvoice = (userId, params) => {
	const invoiceId = params.invoiceId
	return User.findOneAndUpdate({_id: userId}, {$pull: {invoice: {_id: invoiceId}}}, {multi: true}).then((result, error) => {
		if(error){
			return false;
		}else{
			return true;
		};
	});
};

//function for updating an invoice
module.exports.updateInvoice = (userId, params, body) => {
	const invoiceId = params.invoiceId;
	return User.findOneAndUpdate({_id: userId, 'invoice._id': invoiceId}, {$set: {
		'invoice.$.invoiceNo': body.invoiceNo,
		'invoice.$.invoiceDate': body.invoiceDate,
		'invoice.$.customerName': body.customerName,
		'invoice.$.productName': body.productName,
		'invoice.$.productQuantity': body.productQuantity,
		'invoice.$.productPrice': body.productPrice,
		'invoice.$.totalInvoiceAmount': body.totalInvoiceAmount
		}}, {multi: true}).then((result, error) => {
		if(error){
			return false;
		}else{
			return true;
		};
	});
}

