/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* @ FILENAME       : UPY_ItemFulfillment_Client.js
* @ AUTHOR         : eliseo@upayasolutions.com
* @ DATE           :
* @ DESCRIPTION    :
*
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
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment.
 * @appliedtorecord recordType
 *
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function clientPageInit(type){

}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment.
 * @appliedtorecord recordType
 *
 * @returns {Boolean} True to continue save, false to abort save
 */
function clientSaveRecord(){
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment.
 * @appliedtorecord recordType
 *
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Boolean} True to continue changing field value, false to abort value change
 */
function clientValidateField(type, name, linenum){

    return true;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment.
 * @appliedtorecord recordType
 *
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
function clientFieldChanged(type, name, linenum)
{
	if(type == 'item')
	{
		var itemReceive = nlapiGetCurrentLineItemValue('item', 'itemreceive');
		if(itemReceive == 'T')
		{
			var indexItem = nlapiGetCurrentLineItemIndex('item');
			var itemFulfillmentFields = getItemFulfillmentsFields(indexItem);
			//alert('Index: ' + indexItem);
			var selected = getSelectedItemFulfillmentsFields(indexItem);
			//alert(selected);
			var checkedCount = getCheckedCount();

			if(checkedCount > 1)
			{
				//compare
				var isDuplicate = itemFulfillmentFields.indexOf(selected);
				//alert('Item Fulfillment Fields: ' + itemFulfillmentFields);
				//alert('Is Duplicate: ' + isDuplicate);
				if(isDuplicate === -1)
				{
					alert('You cannot group these items');
					nlapiSetCurrentLineItemValue('item', 'itemreceive', 'F');
				}
			}
		}
	}
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment.
 * @appliedtorecord recordType
 *
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @returns {Void}
 */
function clientPostSourcing(type, name) {

}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment.
 * @appliedtorecord recordType
 *
 * @param {String} type Sublist internal id
 * @returns {Void}
 */
function clientLineInit(type) {

}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment.
 * @appliedtorecord recordType
 *
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to save line item, false to abort save
 */
function clientValidateLine(type){

    return true;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment.
 * @appliedtorecord recordType
 *
 * @param {String} type Sublist internal id
 * @returns {Void}
 */
function clientRecalc(type){

}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment.
 * @appliedtorecord recordType
 *
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to continue line item insert, false to abort insert
 */
function clientValidateInsert(type){

    return true;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment.
 * @appliedtorecord recordType
 *
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to continue line item delete, false to abort delete
 */
function clientValidateDelete(type){

    return true;
}


var getItemFulfillmentsFields = function(indexItem)
{
	var itemFulfillmentLines = [];
	var itemCount = nlapiGetLineItemCount('item');

	for(var i = 1; i <= itemCount; i++)
	{
		var isChecked = nlapiGetLineItemValue('item', 'itemreceive', i);
		if(isChecked == 'T' && i != indexItem)
		{
			var customLineLocation = nlapiGetLineItemValue('item', 'custcol_custom_line_location', i);
			var requestedDeliveryDate = nlapiGetLineItemValue('item', 'custcol__requested_delivery_date', i);
			var lineShipMethod = nlapiGetLineItemValue('item', 'custcol_line_ship_method', i);
			var releaseByDate = nlapiGetLineItemValue('item', 'custcol_release_by_date', i);
		}

		itemFulfillmentLines.push(customLineLocation + '|' + requestedDeliveryDate + '|' + lineShipMethod + '|' + releaseByDate);
	}

	return itemFulfillmentLines;
}

var getSelectedItemFulfillmentsFields = function(index)
{
	var isChecked = nlapiGetLineItemValue('item', 'itemreceive', index);
	if(isChecked == 'T')
	{
		var customLineLocation = nlapiGetLineItemValue('item', 'custcol_custom_line_location', index);
		var requestedDeliveryDate = nlapiGetLineItemValue('item', 'custcol__requested_delivery_date', index);
		var lineShipMethod = nlapiGetLineItemValue('item', 'custcol_line_ship_method', index);
		var releaseByDate = nlapiGetLineItemValue('item', 'custcol_release_by_date', index);
	}

	var itemFulfillmentLines = customLineLocation + '|' + requestedDeliveryDate + '|' + lineShipMethod + '|' + releaseByDate;
	return itemFulfillmentLines;
}

var getCheckedCount = function()
{
	var itemFulfillmentLines = [];
	var itemCount = nlapiGetLineItemCount('item');
	var checkedCount = 0;

	for(var i = 1; i <= itemCount; i++)
	{
		var itemReceive = nlapiGetLineItemValue('item', 'itemreceive', i);
		if(itemReceive == 'T')
		{
			checkedCount++;
		}
	}

	return checkedCount;
}