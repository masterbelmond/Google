/*  userevent script for item fulfilment to pass the Order custom fields to item fulfilment*/
function populateIFFields(type,name)
{
	nlapiLogExecution('DEBUG', 'entered',name);
	if ( (type == 'create')  )  
	{	
		try
		{
			nlapiLogExecution('DEBUG', 'populateIFFields','start');
			var recType  = nlapiGetRecordType();
			var recId =  nlapiGetRecordId();
			var soId = nlapiGetFieldValue('createdfrom');
			var subsidiaryId=nlapiGetFieldValue('subsidiary');
			var ifLocation=nlapiGetFieldValue('custbody_if_location');
			nlapiLogExecution('DEBUG', 'entered', ' soId = ' +soId + ' , recType = ' + recType + ', recId = '+ recId+ ', subsidiaryId = '+ subsidiaryId );
			
			
			var itemCount = nlapiGetLineItemCount('item');
			var lineNum = null;
			for (var i=0;i<itemCount; i++){
				var isChecked = nlapiGetLineItemValue('item','itemreceive',i+1);
				if (isChecked=='T'){
					lineNum = parseInt(i+1);
					break;
				}
			}

			if (soId && lineNum)
			{
				nlapiLogExecution('DEBUG', 'if soId',soId);
				var filters = new Array();
				var columns = new Array();
				filters[0] = new nlobjSearchFilter('internalidnumber',null,'equalto',parseInt(soId) );
				filters[1] = new nlobjSearchFilter('mainline',null,'is','F');
				filters[2] = new nlobjSearchFilter('line',null,'equalto',lineNum);
				
				columns[0] = new nlobjSearchColumn('custbody_cseg_channel');
				columns[1] = new nlobjSearchColumn('custbody_transaction_subtype');
				columns[2] = new nlobjSearchColumn('custbody_transaction_source');
				columns[3] = new nlobjSearchColumn('shipaddress');
				columns[4] = new nlobjSearchColumn('custbody_intg_edi_ship_label');
				columns[5] = new nlobjSearchColumn('custbody_ship_label');
				columns[6] = new nlobjSearchColumn('otherrefnum');
				columns[7] = new nlobjSearchColumn('custbody_vendor_id');
				columns[8] = new nlobjSearchColumn('custbody_imlaccount');
				columns[9] = new nlobjSearchColumn('custbody_tms_hold');
				columns[10] = new nlobjSearchColumn('custbody_signature_req');
				columns[11] = new nlobjSearchColumn('custbody_customer_message');
				columns[12] = new nlobjSearchColumn('custbody_requested_delivery_date');
				columns[13] = new nlobjSearchColumn('custbody_b2b_po_date');
				columns[14] = new nlobjSearchColumn('custbody_3pl_freight_terms');
				columns[15] = new nlobjSearchColumn('shipmethod');
				columns[16] = new nlobjSearchColumn('shipdate');  // ship date on order and custbody_requested_ship_date on IF
				columns[17] = new nlobjSearchColumn('location'); // location on order and custbody_if_location on IF
				columns[18] = new nlobjSearchColumn('number');
				columns[19] = new nlobjSearchColumn('formulatext').setFormula('{currency}');
				columns[20] = new nlobjSearchColumn('custbody_cseg_order_type_2');
				columns[21] = new nlobjSearchColumn('custbody_intended_use');
				columns[22] = new nlobjSearchColumn('shipcountry');
				columns[23] = new nlobjSearchColumn('department');
				
				columns[24] = new nlobjSearchColumn('custcol__requested_delivery_date');
				columns[25] = new nlobjSearchColumn('custcol_delivery_window_from');
				columns[26] = new nlobjSearchColumn('custcol_delivery_window_to');
				columns[27] = new nlobjSearchColumn('custcol_line_ship_method');
				columns[28] = new nlobjSearchColumn('custcol_custom_line_location');
				
				
					
				
				var results = nlapiSearchRecord( 'salesorder',null, filters, columns );
				if (results)
				{
					nlapiLogExecution('DEBUG', 'if results',soId);
					for (var i = 0; i<results.length; i++ )
					{
						if(subsidiaryId!='8'){
						nlapiLogExecution('DEBUG', 'for loop ',i);
						var IFFields = getIFOrderTypeFields( results[i].getValue(columns[20]), results[i].getValue(columns[21]), results[i].getValue(columns[22]));
						var addressfields = ['address1','address2','address3','city','state','country','zip'];
				        var  shipfrom = nlapiLookupField('location',results[i].getValue(columns[17]),addressfields);
						nlapiSubmitField(recType,recId,['trandate',
														'custbody_cseg_channel',
														'custbody_transaction_subtype',
														'custbody_transaction_source',
														'shipaddress',
														'custbody_intg_edi_ship_label',
														'custbody_ship_label',
														'custbody_if_order_nbr',
														'custbody_vendor_id',
														'custbody_imlaccount',
														'custbody_tms_hold',
														'custbody_signature_req',
														'custbody_customer_message',
														'custbody_requested_delivery_date',
														'custbody_b2b_po_date',
														'custbody_3pl_freight_terms',
														'shipmethod',
														'custbody_requested_ship_date',
														'custbody_if_location',
														'custbody_b2b_so_num',
														'custbody_if_currency',
														'custbody_if_order_type',
														'custbody_if_to_location',
														'custbody_if_cost_center',
														'custbody_sales_channel_code',
														'custbody_ship_from_location',
														'custbody_delivery_window_from',
														'custbody_delivery_window_to',
														'custbody_customer_shipping_method'
														],
						                               ['01/01/2000', //trandate
													   results[i].getValue(columns[0]),  //custbody_cseg_channel
													   results[i].getValue(columns[1]),  // custbody_transaction_subtype
													   results[i].getValue(columns[2]),  // custbody_transaction_source
													   results[i].getValue(columns[3]),  // shipaddress
													   results[i].getValue(columns[4]),  // custbody_intg_edi_ship_label
													   results[i].getValue(columns[5]),  // custbody_ship_label
													   results[i].getValue(columns[6]),  //custbody_if_order_nbr
													   results[i].getValue(columns[7]),  //custbody_vendor_id
													   results[i].getValue(columns[8]),  //custbody_imlaccount
													   results[i].getValue(columns[9]),  //custbody_tms_hold
													   results[i].getValue(columns[10]),  //custbody_signature_req
													   results[i].getValue(columns[11]),  //custbody_customer_message
													   results[i].getValue(columns[24]),  //custbody_requested_delivery_date
													   results[i].getValue(columns[13]),  //custbody_b2b_po_date
													   results[i].getValue(columns[14]), //custbody_3pl_freight_terms
													   results[i].getValue(columns[15]),  //shipmethod
													   results[i].getValue(columns[16]), // ship date on order and custbody_requested_ship_date on IF
													   results[i].getValue(columns[28]),  // location on order and custbody_if_location on IF
													   results[i].getValue(columns[18]),  //custbody_b2b_so_num
													   results[i].getValue(columns[19]),  //custbody_if_currency
													   IFFields.ifordertype,  //custbody_if_order_type
													   IFFields.iftolocation,  //custbody_if_to_location
													   results[i].getValue(columns[23]), //custbody_if_cost_center
													   IFFields.sccode, //custbody_sales_channel_code
													   shipfrom.address1+'|'+shipfrom.address2+'|'+shipfrom.address3+'|'+shipfrom.city+'|'+shipfrom.state+'|'+shipfrom.zip+'|'+shipfrom.country, //custbody_ship_from_location
													   results[i].getValue(columns[25]),  //custbody_delivery_window_from
													   results[i].getValue(columns[26]),  //custbody_delivery_window_to
													   results[i].getValue(columns[27])  //custbody_lineshipmethod
													   ]
										,true);
										
						nlapiLogExecution('DEBUG', 'number',results[i].getValue(columns[18]));	
					  }else{
						  // Subsidiary is AUS 
						  
                            
							nlapiLogExecution('DEBUG', 'for loop ',i);
							var IFFields = getIFOrderTypeFields( results[i].getValue(columns[20]), results[i].getValue(columns[21]), results[i].getValue(columns[22]));
							var addressfields = ['address1','address2','address3','city','state','country','zip'];
					        var  shipfrom = nlapiLookupField('location',ifLocation,addressfields); // Get Value from Mapping location
							nlapiSubmitField(recType,recId,[
															'custbody_cseg_channel',
															'custbody_transaction_subtype',
															'custbody_transaction_source',
															'shipaddress',
															'custbody_intg_edi_ship_label',
															'custbody_ship_label',
															'custbody_if_order_nbr',
															'custbody_vendor_id',
															'custbody_imlaccount',
															'custbody_tms_hold',
															'custbody_signature_req',
															'custbody_customer_message',
															'custbody_requested_delivery_date',
															'custbody_b2b_po_date',
															'custbody_3pl_freight_terms',
															'shipmethod',
															'custbody_requested_ship_date',
															'custbody_b2b_so_num',
															'custbody_if_currency',
															'custbody_if_order_type',
															'custbody_if_to_location',
															'custbody_if_cost_center',
															'custbody_sales_channel_code',
															'custbody_ship_from_location',
															'custbody_delivery_window_from',
															'custbody_delivery_window_to',
															'custbody_customer_shipping_method'
															],
							                               [
														   results[i].getValue(columns[0]),  //custbody_cseg_channel
														   results[i].getValue(columns[1]),  // custbody_transaction_subtype
														   results[i].getValue(columns[2]),  // custbody_transaction_source
														   results[i].getValue(columns[3]),  // shipaddress
														   results[i].getValue(columns[4]),  // custbody_intg_edi_ship_label
														   results[i].getValue(columns[5]),  // custbody_ship_label
														   results[i].getValue(columns[6]),  //custbody_if_order_nbr
														   results[i].getValue(columns[7]),  //custbody_vendor_id
														   results[i].getValue(columns[8]),  //custbody_imlaccount
														   results[i].getValue(columns[9]),  //custbody_tms_hold
														   results[i].getValue(columns[10]),  //custbody_signature_req
														   results[i].getValue(columns[11]),  //custbody_customer_message
														   results[i].getValue(columns[24]),  //custbody_requested_delivery_date
														   results[i].getValue(columns[13]),  //custbody_b2b_po_date
														   results[i].getValue(columns[14]), //custbody_3pl_freight_terms
														   results[i].getValue(columns[15]),  //shipmethod
														   results[i].getValue(columns[16]), // ship date on order and custbody_requested_ship_date on IF
														   results[i].getValue(columns[18]),  //custbody_b2b_so_num
														   results[i].getValue(columns[19]),  //custbody_if_currency
														   IFFields.ifordertype,  //custbody_if_order_type
														   IFFields.iftolocation,  //custbody_if_to_location
														   results[i].getValue(columns[23]), //custbody_if_cost_center
														   IFFields.sccode, //custbody_sales_channel_code
														   shipfrom.address1+'|'+shipfrom.address2+'|'+shipfrom.address3+'|'+shipfrom.city+'|'+shipfrom.state+'|'+shipfrom.zip+'|'+shipfrom.country, //custbody_ship_from_location
														   results[i].getValue(columns[25]),  //custbody_delivery_window_from
														   results[i].getValue(columns[26]),  //custbody_delivery_window_to
														   results[i].getValue(columns[27])  //custbody_lineshipmethod
														   ]
											,true);
											
							nlapiLogExecution('DEBUG', 'number',results[i].getValue(columns[18]));	  
					  }
					}
				}	
				//columns[12] = nlobjSearchColumn('custcol_line_no');
				//columns[13] = nlobjSearchColumn('custcol_cust_po_line');
				//columns[14] = nlobjSearchColumn('custbody_transaction_subtype');
			}
			//nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(),'custrecord_external_services_pwd',encrptedPwd);
		}
        catch(e)
        {
			nlapiLogExecution('ERROR','userevent',e.toString());
		}	
	}		
}


function getIFOrderTypeFields(ordertype,intendeduse,shipcountry)
{
	var IFFields = new Object();
	var filters = new Array();
	if (ordertype && shipcountry)
	{
		var allCountriesIds = new Array();
		allCountriesIds = getCountryInternalId();
	    if(shipcountry) var countryId = allCountriesIds[shipcountry];
		nlapiLogExecution('DEBUG', 'result count', countryId );
		filters[0] = new nlobjSearchFilter( 'custrecord_order_type', null, 'anyOf', ordertype );
		filters[1] = new nlobjSearchFilter( 'custrecord_ship_country', null, 'is', countryId );
		nlapiLogExecution('DEBUG', 'result count', shipcountry );
		if (intendeduse) filters[2] = new nlobjSearchFilter( 'custrecord_intended_use_if', null, 'is', intendeduse );
		var columns = new Array();
		columns[0] = new nlobjSearchColumn( 'custrecord_if_order_type' );
		columns[1] = new nlobjSearchColumn( 'custrecord_to_location_if' );
		columns[2] = new nlobjSearchColumn( 'custrecord_sales_channel_code' );
		columns[3] = new nlobjSearchColumn( 'custrecord_ship_country' );
		columns[4] = new nlobjSearchColumn( 'custrecord_order_type' );
		
		var results = nlapiSearchRecord('customrecord_order_type_mapping', null, filters, columns);
		if (results)
		{	
			for ( var i = 0; results != null && i < results.length; i++ )
			   {
				  
				  var res = results[i];
				  nlapiLogExecution('DEBUG', 'result count', res.getValue(columns[3]) );
				  IFFields.ifordertype = (res.getValue(columns[0]));
				  IFFields.iftolocation = (res.getValue(columns[1]));
				  IFFields.sccode = (res.getValue(columns[2]));
				  if (res.getValue(columns[4]) == ordertype && res.getValue(columns[3]) == shipcountry )
				  {
					 break; 
				  }
				  
			   } 
			   return IFFields;
		}   
	}
	 IFFields.ifordertype = '';
	 IFFields.iftolocation = '';
	return IFFields;
}

function reserveInventory(type,name)
{
	var selCnt = 0;
	var context = nlapiGetContext();
	var subsidiaryID=nlapiGetFieldValue('subsidiary');
	nlapiLogExecution('DEBUG', 'reserveInventory',type + '     ' + context.getExecutionContext());
	
	if ( (type == 'create') && (context.getExecutionContext() == 'userinterface') && subsidiaryID!='8' )  
	{	
		//nlapiLogExecution('DEBUG', 'reserveInventory',type + '     ' + context.getExecutionContext());
		try
		{
			 nlapiLogExecution('DEBUG', 'reserveInventory','if');
			 var ifRec =  nlapiGetNewRecord();;
			 var soInternalId = nlapiGetFieldValue('createdfrom');
			 var soRec = nlapiLoadRecord('salesorder',soInternalId);
			 var iflinecount = ifRec.getLineItemCount('item');
			 for (var l=1; l<= iflinecount; l++ )
			{
				nlapiLogExecution('DEBUG', 'reserveInventory',l);
				isSelected = ifRec.getLineItemValue('item', 'itemreceive', l);
				iflineno = ifRec.getLineItemValue('item','custcol_line_no',l);
				var onhandQty = soRec.getLineItemValue('item','quantityonhand',iflineno);
				var lineQty = soRec.getLineItemValue('item','quantity',iflineno);
				var iflineQty = ifRec.getLineItemValue('item','quantity',iflineno);
				nlapiLogExecution('DEBUG', 'availableQty', onhandQty + ' ' + lineQty + '   ' + isSelected);
				if (isSelected == 'T')
				{
					if ( parseInt(iflineQty) <= parseInt(onhandQty) )
					{
						soRec.setLineItemValue('item', 'commitinventory', iflineno, 1);   // set line commit to 'Available Qty
						soRec.setLineItemValue('item', 'quantitycommitted', iflineno, parseFloat(iflineQty));  // commit if line quantity
						nlapiLogExecution('DEBUG', 'reserveInventory', iflineQty);
					}	
					else
					{
						ifRec.setLineItemValue('item', 'itemreceive', l,'F');
					}
					selCnt++;
				}
				
					
			}	
			if (selCnt > 0)
			{
				var soid = nlapiSubmitRecord(soRec, true);
				nlapiLogExecution('DEBUG', 'reserveInventory',selCnt);
			}
		}
		catch(e)
		{
			nlapiLogExecution('ERROR','userevent',e.toString());
			
		}
		
		
	}
	
}	

function getCountryInternalId()
{
	try
	{
		nlapiLogExecution('DEBUG', 'getCountryInternalId', ' start');
		var search = nlapiLoadSearch('customrecord_country_internal_id','customsearch_country_internalid');
		var filter = new  Array();
		var searchResults = search.runSearch();
		var column = search.getColumns();
		var allCountries = new Array();
		if(searchResults && searchResults != null)
		{
		var searchFrom = 0; 
		var searchCount = 999; // Number of records returned in one step (maximum is 1000)
		var resultSet; // Temporary variable used to store the result set
		do 
		{
			resultSet = searchResults.getResults(searchFrom, searchFrom + searchCount);//(0+1000),(1000+1000)..
			resultCount = searchResults.getResults(searchFrom, searchFrom + searchCount).length;
			searchFrom = searchFrom + searchCount;
			nlapiLogExecution('DEBUG', 'getCountryInternalId', 'DO LOOP'  + resultCount);		
			if (resultSet)
			{
				for(var i=0;i<resultSet.length;i++)
				{
					try
					{
						var results = resultSet[i];
						var countryName = results.getValue(column[0]);
						var countryId = results.getValue(column[1]);
						allCountries[countryName] = countryId;	
							
					}
					catch(e) 
					{
								var err_title = 'Unexpected error';
								var err_description = '';
								if (e){
									if ( e instanceof nlobjError ){
										err_description = err_description + ' ' + e.getCode() + '|' + e.getDetails();
									} else {
										err_description = err_description + ' ' + e.toString();
									};
								};
								nlapiLogExecution('ERROR', 'getCountryInternalId ',err_title+' -> ' + err_description);
					};
				}
			}
		} while (resultSet.length > 0);
		nlapiLogExecution('DEBUG', 'getCountryInternalId', ' END' + allCountries.length);		
		}	
		return allCountries;
	}
	catch(e)
	{
	var err_title = 'Unexpected error';
	var err_description = '';
	if (e)
	{
			if ( e instanceof nlobjError ){
				err_description = err_description + ' ' + e.getCode() + '|' + e.getDetails();
			} else {
				err_description = err_description + ' ' + e.toString();
			};
	};
	nlapiLogExecution('ERROR', 'getCountryInternalId' , err_title + '->' + err_description);
	}
}