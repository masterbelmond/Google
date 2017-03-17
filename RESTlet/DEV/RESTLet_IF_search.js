/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */
function getRESTlet(dataIn) {
	
	var context = nlapiGetContext();
	var searchId = nlapiGetContext().getSetting('SCRIPT', 'custscript_if_search_id');

	var searchResult = {
	    result: []
	};

	try
	{
		var search = nlapiSearchRecord('itemfulfillment', searchId);
		
		if(search !== null && search !== '' && searchId !== '')
		{
			logger('Number of Results: ' + search.length);

			for(var i=0; i < search.length; i++)
			{
				var node = [];

				var internalid = search[i].getValue('internalid');
				var trandate = search[i].getValue('trandate');
				var tranid = search[i].getValue('tranid');
				var memo = search[i].getValue('memo');
				var itemid = search[i].getValue('itemid', 'item');
				var quantity = search[i].getValue('quantity');
				var custcol_line_no = search[i].getValue('custcol_line_no');
				var custbody_3pl_shipment = search[i].getValue('custbody_3pl_shipment');
				var name = search[i].getValue('name', 'custbody_if_location');
				var custbody_b2b_so_num = search[i].getValue('custbody_b2b_so_num');
				var custbody_dependent_ia_of_if = search[i].getValue('custbody_dependent_ia_of_if');
				var custbody_if_to_location = search[i].getValue('custbody_if_to_location');
				var line = search[i].getValue('line');

				searchResult.result.push(
					{
						"internalid" : internalid,
						"date" : trandate,
						"document_number" : tranid,
						"memo" : memo,
						"item_name" : itemid,
						"quantity" : quantity,
						"linenum" : custcol_line_no,
						"3pl_shipment" : custbody_3pl_shipment,
						"location_name" : name,
						"salesorder_for_extract" : custbody_b2b_so_num,
						"dependent_ia_of_if" : custbody_dependent_ia_of_if,
						"if_to_location" : custbody_if_to_location,
						"line_id" : line
					}
				);
			}
		}
	}
	catch(ex)
	{
		var error = ex instanceof nlobjError ? ex.getDetails() : 'JavaScript Error: ' + (ex.message !== null ? ex.message : ex);
		getresponsemessage(401, 'Error', 'Error', error, 401, error);
		nlapiLogExecution('ERROR', ex instanceof nlobjError ? ex.getCode() : 'CUSTOM_ERROR_CODE', ex instanceof nlobjError ? ex.getDetails() : 'JavaScript Error: ' + (ex.message !== null ? ex.message : ex));
	}

	if(searchResult !== null || searchResult !== '')
	{
		loggerJSON(JSON.stringify(searchResult));
		return searchResult;
	}
}

/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */
function postRESTlet(dataIn) {

	return {};
}

/**
 * @param {Object} dataIn Parameter object
 * @returns {Void}
 */
function deleteRESTlet(dataIn) {

}

/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */
function putRESTlet(dataIn) {

	return {};
}


var loggerJSON = function(str){
	var d = nlapiDateToString(new Date(), "datetimetz")
	var arrStr = str.match(/.{4000}/g);
	for(var i in arrStr)
	{
		var sequenceNum = 'Datetime: ' + d + ' | ' + (parseInt(i) + 1) + ' of ' + arrStr.length;
		nlapiLogExecution('DEBUG', sequenceNum, arrStr[i])
	}
}

var logger = function(str){
	var d = nlapiDateToString(new Date(), "datetimetz")
	var dateTime = 'Datetime: ' + d;
	nlapiLogExecution('DEBUG', dateTime, str);
}

var getresponsemessage = function(statuscode, type, ID, Message, MessageCode, MessageType) {
	var response = '{' +
	    '"Status Code" :"' + statuscode + '",' +
	    '"Type" : "' + type + '",' +
	    '"Record ID" : "' + ID + '",' +
	    '"Messages": [{' +
	    '"Message": "' + Message + '",' +
	    '"MessageCode": "' + MessageCode + '",' +
	    '"MessageType": "' + MessageType + '"' +
	    '}]' +
	    '}';
	return response;
}