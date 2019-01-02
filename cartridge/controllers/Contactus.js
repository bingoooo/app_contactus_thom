/**
* Description of the Controller and the logic it provides
*
* @module  controllers/Contactus
*/

'use strict';

// HINT: do not put all require statements at the top of the file
// unless you really need them for all functions

/**
* Description of the function
*
* @return {String} The string 'myFunction'
*/
// var myFunction = function(){
//     return 'myFunction';
// }

/* Exports of the controller */
///**
// * @see {@link module:controllers/Contactus~myFunction} */
//exports.MyFunction = myFunction;

var server = require('server');
var URLUtils = require('dw/web/URLUtils');
var Resource = require('dw/web/Resource');
var Template = require('dw/util/Template');

function getSubject(id)
{
	var number = id.split('.');
	var intPart = number[0];
	/*if (id == "1")
		{
			return Resource.msg("contactus.questionone", "contactus", null);
		}
	if (id == "2")
	{
		return Resource.msg("contactus.questiontwo", "contactus", null);
	}
	if (id == "3")
	{
		return Resource.msg("contactus.questionthree", "contactus", null);
	}*/
	return Resource.msg("contactus.questions." + intPart, "contactus", null);
}

function getEmail(id)
{
	if (id == "1")
		{
			return Resource.msg("contactus.emailone", "emails", null);
		}
	if (id == "2")
	{
		return Resource.msg("contactus.emailtwo", "emails", null);
	}
	if (id == "3")
	{
		return Resource.msg("contactus.emailthree", "emails", null);
	}
}

function sendMail(mailInfos, template)
{
	var template = new Template("mail/contactus.isml");

	var infos = new dw.util.HashMap();
	infos.put("firstname", mailInfos.customer.firstname);
	infos.put("lastname", mailInfos.customer.lastname);
	infos.put("email", mailInfos.customer.email);
	infos.put("phone", mailInfos.customer.phone);
	infos.put("message", mailInfos.customer.message);

	var content = template.render(infos);
	var mail = new dw.net.Mail();
	mail.addTo(mailInfos.email);
	mail.setFrom(mailInfos.customer.email);
	mail.setSubject(mailInfos.subject + " " + mailInfos.customer.order);
	mail.setContent(content);
	//mail.setContent(mailInfos.customer.firstname + " " + mailInfos.customer.lastname + "\n" + mailInfos.customer.message);

	mail.send();
}

function getQuestions(field, file)
{
	var result = [];
	var index = 0;
	for (var i = 1; i < 32; i++)
		{
			if (Resource.msg(field + '.' + i, file, null) == field + '.' + i)
				{
				 break;
				}
			result.push(Resource.msg(field + '.' + i, file, null));
			index++;
		}
	return result;
}

server.get('Show', function(req, res, next){
	var currentCustomer = req.currentCustomer.profile;
	//var currentForm = server.forms.getForm('test');
	var currentForm = server.forms.getForm('contactus');
	var actionUrl = URLUtils.url('Contactus-Submit')
	var questions = getQuestions('contactus.questions', 'contactus');
	res.render('contactus', {customer: currentCustomer, form: currentForm, actionUrl: actionUrl, questions: questions});
	//res.json({questions: questions});
	next();
})

server.post('Submit', function(req, res, next){
	try
	{
		if (!dw.web.CSRFProtection.validateRequest()){
			/*var currentCustomer = req.currentCustomer.profile;
			var currentForm = server.forms.getForm('contactus');
			var actionUrl = URLUtils.url('Contactus-Submit');
			res.render('contactus', {csrfError: Resource.msg('error.csrf.token.mismatch', 'common', null), customer: currentCustomer, form: currentForm, actionUrl: actionUrl});
			*/
			res.redirect(URLUtils.url('Contactus-Show'));
			next();
			return;
		}
		var subject = getSubject(req.form.question);
		var email = getEmail(req.form.question);
		var template = 'mail/contactus.isml';
		if (req.form) {
			//sendMail({customer: req.form, subject: subject, email: email}, template);
		}
		res.json({message: 'OK', request: req.form, subject: subject, email: email});
		//res.render('mail/contactus', {customer: req.form, subject: subject, email: email});
		next();
	}
	catch (error){
		res.json({error: error, request: req});
		next();
	}
});

module.exports = server.exports();