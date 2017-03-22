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

				var objInventoryItem = nlapiLoadRecord(nlapiGetRecordType(), itemId);
				var glProductCode = objInventoryItem.getFieldValue('class');
				var b3ProductCode = objInventoryItem.getFieldValue('custitem_b3_product_code');

				var searchFieldChange = hasFieldChanges(itemId);
				var fieldChange = '';

				if(searchFieldChange)
				{
					fieldChange = 'Yes';
				}
				else
				{
					fieldChange = 'No';
				}

				nlapiLogExecution('DEBUG', '--- VALUES ---', 'Has Field Change: ' + fieldChange + ' | Item Internal ID: ' + itemId + ' | B3 Product Code:' + b3ProductCode + ' | GL Product Code :'  + glProductCode);

				if(searchFieldChange && glProductCode != null)
				{
					if(searchFieldChange != null && searchFieldChange != '')
					{

						var glProductCode = objInventoryItem.getFieldValue('class');

						var params = new Array();
						params['custscript_itemid'] = itemId;
						params['custscript_gl_product_code'] = glProductCode;
						params['custscript_b3_product_code'] = b3ProductCode;

						var status = nlapiScheduleScript('customscript_upy_ss_retro_update', 'customdeploy_upy_ss_retro_update', params);
						
						nlapiLogExecution('DEBUG', '--- RUN SCHEDULED UPDATE ---', 'The value of GL Product Code is: ' + glProductCode + ' | Sales Order Field Updates for GL Product Code is Deployed');
            
					}
				}
				else
				{
					nlapiLogExecution('DEBUG', '--- NO SCHEDULED UPDATE---', 'The value of GL Product Code is: ' + glProductCode);
				}

				if(searchFieldChange && b3ProductCode != null)
				{
					if(searchFieldChange != null && searchFieldChange != '')
					{

						var params = new Array();
						params['custscript_itemid'] = itemId;
						params['custscript_gl_product_code'] = glProductCode;
						params['custscript_b3_product_code'] = b3ProductCode;

						var status = nlapiScheduleScript('customscript_upy_ss_retro_update', 'customdeploy_upy_ss_retro_update', params);
						
						nlapiLogExecution('DEBUG', '--- RUN SCHEDULED UPDATE ---', 'The value of B3 Product Code is: ' + b3ProductCode + ' | Sales Order Field Updates for B3 Product Code is Deployed');

					}
				}
				else
				{
					nlapiLogExecution('DEBUG', '--- NO SCHEDULED UPDATE---', 'The value of B3 Product Code is: ' + b3ProductCode);
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
