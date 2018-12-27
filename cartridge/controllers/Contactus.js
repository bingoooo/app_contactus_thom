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

server.get('Show', function(req, res, next){
	var currentCustomer = req.currentCustomer.profile;
	var currentForm = server.forms.getForm('contactus');
	var actionUrl = URLUtils.url('Contactus-Submit')
	res.render('contactus', {customer: currentCustomer, form: currentForm, actionUrl: actionUrl});
	//res.json({customer: currentCustomer});
	next();
})

server.post('Submit', function(req, res, next){
	res.json({message: 'OK', request: req.form});
	next();
});

module.exports = server.exports();