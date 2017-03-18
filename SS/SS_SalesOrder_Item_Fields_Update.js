/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* @ FILENAME       : SS_SalesOrder_Item_Fields_Update.js
* @ AUTHOR         : eliseo@upayasolutions.com
* @ DATE           : Mar 13, 2017
* @ DESCRIPTION    :
* 									- The script is triggered on-demand by UE Inventory Item Update Sales Order (deployed in Inventory Records).
* 									- This will receive the following parameters: Item Internal ID, B3 Product Code, GL Product Code value.
* 									- It will look for Sales Order record where one or more of the item line is equal to the parameter: Item Internal ID
* 									- For each line items in Sales Order record where the B3 Product Code and GL Product Code does not match the passed parameter, modify the line item.
*										- Exclude the following status: Sales Order: Billed, Sales Order: Cancelled, Sales Order: Closed
* Copyright (c) 2012 Upaya - The Solution Inc.
* 10530 N. Portal Avenue, Cupertino CA 95014
* All Rights Reserved.
*
* This software is the confidential and proprietary information of
* Upaya - The Solution Inc. ("Confidential Information"). You shall not
* disclose such Confidential Information and shall use it only in
* accordance with the terms of the license agreement you entered into
* with Upaya.
* object
*/

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
var scheduledFieldUpdate = function(type)
{
	var paramItemID = nlapiGetContext().getSetting('SCRIPT', 'custscript_itemid');
	var paramB3ProductCode = nlapiGetContext().getSetting('SCRIPT', 'custscript_b3_product_code');
	var paramGlProductCode = nlapiGetContext().getSetting('SCRIPT', 'custscript_gl_product_code');

	nlapiLogExecution('DEBUG', '--- VALUES ---', 'Item Internal ID: ' + paramItemID + ' | B3 Product Code:' + paramB3ProductCode + ' | GL Product Code :'  + paramGlProductCode);

	if(paramItemID != null && paramItemID != ''){}

	var searchResults = nlapiSearchRecord("salesorder",null,
		[
		   ["status","noneof","SalesOrd:G","SalesOrd:C","SalesOrd:H"], //Exclude Sales Order: Billed, Sales Order: Cancelled, Sales Order: Closed
		   "AND",
		   ["type","anyof","SalesOrd"],
		   "AND",
		   ["mainline","is","F"],
		   "AND",
		   ["item.internalidnumber","equalto", paramItemID],
		   "AND",
		   ["type","anyof","SalesOrd"]
		],
		[
		   new nlobjSearchColumn("internalid",null,null),
		   new nlobjSearchColumn("statusref",null,null),
		   new nlobjSearchColumn("line",null,null),
		   new nlobjSearchColumn("item",null,null),
		   new nlobjSearchColumn("custitem_b3_product_code","item",null),
		   new nlobjSearchColumn("custcol_b3_product_code",null,null),
		   new nlobjSearchColumn("class","item",null),
		   new nlobjSearchColumn("class",null,null)
		]
	);

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

			try
			{
				if(paramGlProductCode != soGlProductCode)
				{
					var updateId = updateSalesOrderField(id, line, item, 'class', paramGlProductCode);
					var str = 'SUCCESS: Sales Order ID: ' + updateId + ' | Item:' + item + ' | Line: ' + line + ' | Field: class | Value: ' + paramGlProductCode;
					logger(str);
				}

				if(paramB3ProductCode != soB3ProductCode)
				{
					var updateId = updateSalesOrderField(id, line, item, 'custcol_b3_product_code', paramB3ProductCode);
					var str = 'SUCCESS: Sales Order ID: ' + updateId + ' | Item:' + item + ' | Line: ' + line + ' | Field: custcol_b3_product_code | Value: ' + paramB3ProductCode;
					logger(str);
				}

			}
			catch(ex)
			{
				var str = 'FAIL: Sales Order ID: ' + id + ' | Item:' + item + ' | Line: ' + line;
				logger(str);
				nlapiLogExecution('DEBUG', ex instanceof nlobjError ? ex.getCode() : 'CUSTOM_ERROR_CODE', ex instanceof nlobjError ? ex.getDetails() : 'JavaScript Error: ' + (ex.message !== null ? ex.message : ex));
			}

		}
	}

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
	try
	{
		var update = nlapiSubmitRecord(obj, false, false);
	}
	catch(ex)
	{
		nlapiLogExecution('DEBUG', ex instanceof nlobjError ? ex.getCode() : 'CUSTOM_ERROR_CODE', ex instanceof nlobjError ? ex.getDetails() : 'JavaScript Error: ' + (ex.message !== null ? ex.message : ex));
	}
	return update;
}

