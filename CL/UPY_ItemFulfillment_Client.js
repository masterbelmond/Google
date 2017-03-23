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
			var selected = getSelectedItemFulfillmentsFields(indexItem);
			var checkedCount = getCheckedCount();

			if(checkedCount > 1)
			{
				//compare
				var isDuplicate = itemFulfillmentFields.indexOf(selected);
				if(isDuplicate === -1)
				{
					alert('You cannot group these items');
					nlapiSetCurrentLineItemValue('item', 'itemreceive', 'F');
				}
			}

			var onHold = getSelectedItemHold(indexItem);
			if (onHold)
			{
				alert('Line is onhold');
				nlapiSetCurrentLineItemValue('item', 'itemreceive', 'F');
			}

			var qtyAvail = getSelectedItemQty(indexItem);
			if (!(qtyAvail))
			{
				alert('Available quantity is not enough');
				nlapiSetCurrentLineItemValue('item', 'itemreceive', 'F');
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
			var lineShipMethod = nlapiGetLineItemValue('item', 'custcol_line_ship_method', i);

			var tempRequestedDeliveryDate = nlapiGetLineItemValue('item', 'custcol__requested_delivery_date', index);
			var requestedDeliveryDate = nlapiDateToString(nlapiStringToDate(tempRequestedDeliveryDate));

			var tempReleaseByDate = nlapiGetLineItemValue('item', 'custcol_release_by_date', index);
			var releaseByDate = nlapiDateToString(nlapiStringToDate(tempReleaseByDate));
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
		var lineShipMethod = nlapiGetLineItemValue('item', 'custcol_line_ship_method', index);
				
		var tempRequestedDeliveryDate = nlapiGetLineItemValue('item', 'custcol__requested_delivery_date', index);
		var requestedDeliveryDate = nlapiDateToString(nlapiStringToDate(tempRequestedDeliveryDate));

		var tempReleaseByDate = nlapiGetLineItemValue('item', 'custcol_release_by_date', index);
		var releaseByDate = nlapiDateToString(nlapiStringToDate(tempReleaseByDate));
	}

	var itemFulfillmentLines = customLineLocation + '|' + requestedDeliveryDate + '|' + lineShipMethod + '|' + releaseByDate;
	return itemFulfillmentLines;
}

//Suseela
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

//Suseela
function getSelectedItemHold(lineno)
 {
       var lineOnHold = nlapiGetLineItemValue("item", "custcol_line_hold", lineno);
		if (lineOnHold)
        return true;
	    else
		return false;
}


function getItemAvailableQty(loc,item)
{
		  //alert ("getItemAvailableQty" + loc + "-"+item);

		  var searchResults = nlapiSearchRecord("item",'customsearch_item_loc_qty_available',
			[
			   ["internalid","anyOf",item],
			   "AND",
			   ["inventorylocation","anyOf",loc]
			],
			[
			   new nlobjSearchColumn("locationquantityavailable",null,null)
			]
		);
		 if (searchResults != null && searchResults != '')
		{
			//alert ("qty"+ searchResults.length+loc+item);
			for(var j =0; j < searchResults.length; j++)
			{
				var salesOrderValue = searchResults[j];
				var qty = salesOrderValue.getValue("locationquantityavailable");
				//alert ("qty"+ qty);
				return qty;
			}
		}
		  return 0;
}

function getSelectedItemQty(lineno)
{

	   var loc = nlapiGetLineItemValue("item", "custcol_custom_line_location", lineno);
       var itm = nlapiGetLineItemValue("item", "item", lineno);
	   var itemQty = nlapiGetLineItemValue("item", "quantity", lineno);
	   var remQty = nlapiGetLineItemValue("item", "quantityremaining", lineno);
	   var sub = nlapiGetFieldValue('subsidiary');

	   if (loc && itm)
	   {
		   var aQty = getItemAvailableQty(loc,itm);
			//alert("sub" +sub);
		  if (itemQty && aQty && parseFloat(itemQty)<=parseFloat(aQty) || sub == 8 )
		  {
			  //alert("itemQty" + itemQty +  "   -- " + aQty);
			  return true;
		  }
		  else
		  {
			 return false;
		  }
	   }
	   else
	   {
		   return false;
	   }
}