/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 * Search Name: Transfer Order Oracle Export ( DO NOT DELETE OR MODIFY)
 *
 */
function getRESTlet(dataIn) {
	
	var context = nlapiGetContext();
	var searchId = nlapiGetContext().getSetting('SCRIPT', 'custscript_to_search_id');

	var searchResult = {
	    result: []
	};

	try
	{
		var search = nlapiSearchRecord('transferorder', searchId);
		
		if(search !== null && search !== '' && searchId !== '')
		{
			logger('Number of Results: ' + search.length);

			for(var i=0; i < search.length; i++)
			{
				var tranid = search[i].getValue('tranid');
				var item = search[i].getText('item');
				var internalid = search[i].getValue('internalid', 'item');
				var quantity = search[i].getValue('quantity');
				var subsidiary = search[i].getText('subsidiary');
				var _location = search[i].getText('location');
				var statusref = search[i].getText('statusref');
				var fromInventoryLocation = search[i].getValue('namenohierarchy', 'fromLocation');
				var toInventoryLocation = search[i].getValue('namenohierarchy', 'toLocation');
				var lineExtractStatus = search[i].getText('custcol_line_integ_extract_status');
				var lineNum = search[i].getValue('custcol_line_no');
				
				searchResult.result.push(
					{
						"tranid" : tranid,
						"item" : item,
						"internalid" : internalid,
						"quantity" : quantity,
						"subsidiary" : subsidiary,
						"fromLocation" : _location,
						"status" : statusref,
						"fromInventoryLocation" : fromInventoryLocation,
						"toInventoryLocation" : toInventoryLocation,
						"lineExtractStatus" : lineExtractStatus,
						"lineNum" : lineNum
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
	if(str.length > 4000)
	{
		var arrStr = str.match(/.{4000}/g);
		for(var i in arrStr)
		{
			var sequenceNum = 'Datetime: ' + d + ' | ' + (parseInt(i) + 1) + ' of ' + arrStr.length;
			nlapiLogExecution('DEBUG', sequenceNum, arrStr[i])
		}
	}
	else
	{
		var sequenceNum = 'Datetime: ' + d;
		nlapiLogExecution('DEBUG', sequenceNum, str);
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