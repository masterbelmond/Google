/**
 * The RESTlet will query the saved search:
 * Saved Search name: IT Extract (DO NOT DELETE OR MODIFY)
 * Link: https://system.sandbox.netsuite.com/app/common/search/search.nl?cu=T&e=T&id=252
 * Output will be in JSON format data
  *
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */
function getRESTlet(dataIn) {

	var context = nlapiGetContext();
	var searchId = nlapiGetContext().getSetting('SCRIPT', 'custscript_it_search_id');

	var searchResult = {
	    result: []
	};

	try
	{
		var search = nlapiSearchRecord('inventorytransfer', searchId);

		if(search !== null && search !== '' && searchId !== '')
		{
			logger('Number of Results: ' + search.length);

			for(var i=0; i < search.length; i++)
			{

				var transactionSource = search[i].getText('custbody_transaction_source',null,null);
				var transactionSubType = search[i].getText('custbody_transaction_subtype',null,null);
				var sourceDocumentNumber = search[i].getValue('custbody_source_document_number',null,null);
				var sourceDocLine = search[i].getValue('custbody_source_doc_line',null,null);
				var externalId = search[i].getValue('externalid',null,null);
				var tranId = search[i].getValue('tranid',null,null);
				var item = search[i].getText('item',null,null);
				var _location = search[i].getText('location',null,null);
				var quantity = search[i].getValue('quantity',null,null);
				var line = search[i].getValue('line',null,null);
				var lineSequenceNumber = search[i].getValue('linesequencenumber',null,null);

				searchResult.result.push(
					{
						"transaction_source" : transactionSource,
						"transaction_sub_type" : transactionSubType,
						"source_document_number" : sourceDocumentNumber,
						"source_doc_line" : sourceDocLine,
						"external_id" : externalId,
						"document_number" : tranId,
						"item" : item,
						"inventory_location" : _location,
						"quantity" : quantity,
						"line_id" : line,
						"line_sequence_number" : lineSequenceNumber
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