function clientPageInit(a) {}

function clientSaveRecord() {}

function clientValidateField(a, b, d) {
    return !0
}

function clientFieldChanged(a, b, d) {
    "item" == a && "T" == nlapiGetCurrentLineItemValue("item", "itemreceive") && (   (b = nlapiGetCurrentLineItemIndex("item"), a = getItemFulfillmentsFields(b), b = getSelectedItemFulfillmentsFields(b), 1 < getCheckedCount() && -1 === a.indexOf(b) && (alert("You cannot group these items"), nlapiSetCurrentLineItemValue("item", "itemreceive", "F")))
     ||  (b = nlapiGetCurrentLineItemIndex("item"),  c = getSelectedItemHold(b), c && (alert("Line is on Hold"), nlapiSetCurrentLineItemValue("item", "itemreceive", "F"))) 
	 ||  (b = nlapiGetCurrentLineItemIndex("item"),  qtyAvail = getSelectedItemQty(b), !qtyAvail && (alert("Available Quantity is not enough"), nlapiSetCurrentLineItemValue("item", "itemreceive", "F")))
	 )
	}

function clientPostSourcing(a, b) {}

function clientLineInit(a) {}

function clientValidateLine(a) {
    return !0
}

function clientRecalc(a) {}

function clientValidateInsert(a) {
    return !0
}

function clientValidateDelete(a) {
    return !0
}
var getItemFulfillmentsFields = function(a) {
        for (var b = [], d = nlapiGetLineItemCount("item"), c = 1; c <= d; c++) {
            if ("T" == nlapiGetLineItemValue("item", "itemreceive", c) && c != a) var e = nlapiGetLineItemValue("item", "custcol_custom_line_location", c),
                f = nlapiGetLineItemValue("item", "custcol__requested_delivery_date", c),
                g = nlapiGetLineItemValue("item", "custcol_line_ship_method", c),
                h = nlapiGetLineItemValue("item", "custcol_release_by_date", c);
            b.push(e + "|" + f + "|" + g + "|" + h)
        }
        return b
    },
    getSelectedItemFulfillmentsFields = function(a) {
        if ("T" ==
            nlapiGetLineItemValue("item", "itemreceive", a)) var b = nlapiGetLineItemValue("item", "custcol_custom_line_location", a),
            d = nlapiGetLineItemValue("item", "custcol__requested_delivery_date", a),
            c = nlapiGetLineItemValue("item", "custcol_line_ship_method", a),
            e = nlapiGetLineItemValue("item", "custcol_release_by_date", a);
        return b + "|" + d + "|" + c + "|" + e
    },
	getSelectedItemHold = function(a) {
        if ("T" ==
            nlapiGetLineItemValue("item", "itemreceive", a)) var b = nlapiGetLineItemValue("item", "custcol_line_hold", a);
		if (b)	
        return true;
	    else
		return false;	
    },
	getItemAvailableQty = function(loc,item) {
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
   },
	getSelectedItemQty = function(a) {
	  
	  if ("T" ==
            nlapiGetLineItemValue("item", "itemreceive", a)) var loc = nlapiGetLineItemValue("item", "custcol_custom_line_location", a),
            itm = nlapiGetLineItemValue("item", "item", a),
			itemQty = nlapiGetLineItemValue("item", "quantity", a),
			remQty = nlapiGetLineItemValue("item", "quantityremaining", a),
			aQty = getItemAvailableQty(loc,itm);
			//alert("itemQty" + itemQty +  "   -- " + aQty);
	  if (itemQty && aQty && parseFloat(itemQty)<=parseFloat(aQty) ) 
	  {
		  //alert("itemQty" + itemQty +  "   -- " + aQty);
		  return true;
	  } 
 	  else 
	  {
		 return false;	   
	  } 
		  
   },
    getCheckedCount = function() {
        for (var a = nlapiGetLineItemCount("item"), b = 0, d = 1; d <= a; d++) "T" == nlapiGetLineItemValue("item", "itemreceive", d) && b++;
        return b
    };