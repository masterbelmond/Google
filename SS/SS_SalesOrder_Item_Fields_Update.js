var scheduled = function()
{
	var field1 = 'class';

	var filtersForGLProductCode = [
		["status","noneof","SalesOrd:G","SalesOrd:C","SalesOrd:H"],
		"AND",
		["type","anyof","SalesOrd"],
		"AND",
		["mainline","is","F"],
		"AND",
		["item.class","noneof","@NONE@"],
		"AND",
		["class","anyof","@NONE@"],
		"AND",
		["type","anyof","SalesOrd"]
	];

	var field2 = 'custitem_b3_product_code';

	var filtersB3ProductCode = [
   ["status","noneof","SalesOrd:G","SalesOrd:C","SalesOrd:H"],
   "AND",
   ["type","anyof","SalesOrd"],
   "AND",
   ["mainline","is","F"],
   "AND",
   ["custcol_b3_product_code","isempty",""],
   "AND",
   ["item.custitem_b3_product_code","isnot",""],
   "AND",
   ["type","anyof","SalesOrd"]
	];


	var updateGLProductCode = fieldListForUpdate(filtersForGLProductCode, field1);

	if(updateGLProductCode != null && updateGLProductCode != '')
	{
		updateProcess(updateGLProductCode, field1);
	}

	var updateB3ProductCode = fieldListForUpdate(filtersB3ProductCode, field2);

	if(updateB3ProductCode != null && updateB3ProductCode != '')
	{
		updateProcess(updateB3ProductCode, field2);
	}
}

var updateProcess = function(searchResults, field)
{
	if (searchResults != null && searchResults != '')
	{
		for(var j =0; j < searchResults.length; j++)
		{
			var salesOrderValue = searchResults[j];

			var id = salesOrderValue.getValue('internalid');
			var statusref = salesOrderValue.getValue('statusref');
			var line = salesOrderValue.getValue('line');
			var item = salesOrderValue.getValue('item');
			var b3ProductCode = salesOrderValue.getValue('custitem_b3_product_code', 'item');
			var soB3ProductCode = salesOrderValue.getValue('custcol_b3_product_code', 'item');
			var glProductCode = salesOrderValue.getValue('class', 'item');
			var soGlProductCode = salesOrderValue.getValue('class');
			var val = '';

			if (field == 'class') {
				updateField = 'class';
				val = glProductCode;
			}
			else if(field == 'custitem_b3_product_code')
			{
				updateField = 'custcol_b3_product_code';
				val = b3ProductCode;
			}

			try
			{
				if(val != '')
				{
					var updateId = updateSalesOrderField(id, line, item, updateField, val);
					var str = 'SUCCESS: ' + updateId + ' | Item:' + item + ' | Line: ' + line + ' | Field: ' + updateField + ' | Value: ' + val;
					logger(str);
				}
			}
			catch(ex)
			{
				var str = 'FAIL: ' + id + ' | Item:' + item + ' | Line: ' + line + ' | Field: ' + updateField + ' | Value: ' + val;
				logger(str);
				nlapiLogExecution('ERROR', ex instanceof nlobjError ? ex.getCode() : 'CUSTOM_ERROR_CODE', ex instanceof nlobjError ? ex.getDetails() : 'JavaScript Error: ' + (ex.message !== null ? ex.message : ex));
			}

		}
	}
}

var fieldListForUpdate = function(filters, field)
{
	var columns =
	[
	   new nlobjSearchColumn("internalid",null,null),
	   new nlobjSearchColumn("statusref",null,null),
	   new nlobjSearchColumn("line",null,null),
	   new nlobjSearchColumn("item",null,null),
	   new nlobjSearchColumn("custitem_b3_product_code","item",null),
	   new nlobjSearchColumn("custcol_b3_product_code",null,null),
	   new nlobjSearchColumn("class","item",null),
	   new nlobjSearchColumn("class",null,null)
	];

	var retList;
	var search = nlapiCreateSearch('salesorder', filters, columns);

	var resultSet = search.runSearch();
	var startPos = 0, endPos = 1000;

	while (startPos < 100000)
	{
		var currList = resultSet.getResults(startPos, endPos);
		if (currList == null || currList.length <= 0)
			break;
		if (retList == null)
			retList = currList;
		else
			retList = retList.concat(currList);
		if (currList.length < 1000)
			break;
		startPos += 1000;
		endPos += 1000;
	}

	return retList;
}

var logger = function(str){

	var d = nlapiDateToString(new Date(), "datetimetz");

	if(str.length >= 4000)
	{
		var arrStr = str.match(/.{4000}/g);
		for(var i in arrStr)
		{
			var sequenceNum = 'Datetime: ' + d + ' | ' + (parseInt(i) + 1) + ' of ' + arrStr.length;
			nlapiLogExecution('DEBUG', sequenceNum, arrStr[i]);
		}
	}
	else
	{
		var sequenceNum = 'Datetime: ' + d;
		nlapiLogExecution('DEBUG', sequenceNum, str);
	}
}

var updateSalesOrderField = function(id, line, item, field, val)
{
	var obj = nlapiLoadRecord('salesorder', id);
	var count = obj.getLineItemCount('item');
	for(var i = 1; i <= count; i++)
	{
		var objItem = obj.getLineItemValue('item', 'item', i);
		var objLine = obj.getLineItemValue('item', 'line', i);
		if(objItem == item && objLine == line)
		{
			obj.setLineItemValue('item', field, i, val);
		}
	}
	var update = nlapiSubmitRecord(obj, false, false);
	return update;
}

