/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
* @ FILENAME       : UE_ItemFieldChange_Update_SalesOrder.js
* @ AUTHOR         : eliseo@upayasolutions.com
* @ DATE           : Mar 17, 2017
* @ DESCRIPTION    :	The script will detect the change in the following fields:
* 										GL Product Code (class)
*  									 	B3 Product Code (custitem_b3_product_code)
* 									- Execute only on 'Edit Mode'
* 									- This script will look if the value of B3 Product Code or GL Product is assigned a value (from previous blank state)
* 									- If the field is assigned a value, it will initiate the "Scheduled Script Field Retro-Update" (scheduled script)
* 									- The scheduled script will take care of updating the Sales Order records.
*
*
* Copyright (c) 2012 Upaya - The Solution Inc.
* 10530 N. Portal Avenue, Cupertino CA 95014s
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
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only)
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function userEventAfterSubmit(type){
	try
	{
		if(type == 'edit')
		{
			var context = nlapiGetContext();
			var isUserInterface = context.getExecutionContext();

			if(isUserInterface == 'userinterface')
			{
				//Detect if there is any changes to GL Product Code or B3 Product Code
				var itemId = nlapiGetRecordId();
				var searchFieldChange = hasFieldChanges(itemId);

				if(searchFieldChange)
				{
					if(searchFieldChange != null && searchFieldChange != '')
					{
						
						var objInventoryItem = nlapiLoadRecord(nlapiGetRecordType(), itemId);
						var b3ProductCode = objInventoryItem.getFieldValue('custitem_b3_product_code');
						var glProductCode = objInventoryItem.getFieldValue('class');
						
						var params = new Array();
						params['custscript_itemid'] = itemId;
						params['custscript_b3_product_code'] = b3ProductCode;
						params['custscript_gl_product_code'] = glProductCode;

						var status = nlapiScheduleScript('customscript_upy_ss_retro_update', 'customdeploy_upy_ss_retro_update', params);
            if (status == 'QUEUED')
            {
                nlapiLogExecution('DEBUG', 'QUEUED', 'Sales Order Field Updates is Deployed');
            }
					}
				}
			}
		}
	}
	catch(ex)
	{
		nlapiLogExecution('ERROR', ex instanceof nlobjError ? ex.getCode() : 'CUSTOM_ERROR_CODE', ex instanceof nlobjError ? ex.getDetails() : 'JavaScript Error: ' + (ex.message !== null ? ex.message : ex));
	}
}

var hasFieldChanges = function(itemId)
{
	var itemSearch = nlapiSearchRecord("item",null,
		[
		   ["systemnotes.field","anyof","CUSTITEM_B3_PRODUCT_CODE","INVTITEM.KCLASS"],
		   "AND",
		   ["systemnotes.oldvalue","isempty",""],
		   "AND",
		   ["systemnotes.newvalue","isnotempty",""],
		   "AND",
		   ["systemnotes.date","onorafter","today"],
		   "AND",
		   ["internalid","anyof",itemId]
		],
		[
		   new nlobjSearchColumn("itemid",null,null).setSort(false),
		   new nlobjSearchColumn("displayname",null,null),
		   new nlobjSearchColumn("salesdescription",null,null),
		   new nlobjSearchColumn("type",null,null),
		   new nlobjSearchColumn("baseprice",null,null)
		]
	);

	return itemSearch;
}
