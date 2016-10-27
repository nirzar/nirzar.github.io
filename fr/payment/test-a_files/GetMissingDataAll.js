

/*############################################################################
 * Event handling
 *##########################################################################*/

function getMainEvent(hResponse)
{
    var oa = null;

    var sE1 = hResponse.get("1");
    if ( sE1 == null ) { return null; }

    var iSpace = sE1.indexOf(" ");
    if ( iSpace <= 0 ) { return null; }

    var sEventID = sE1.substr(0, iSpace);
    var sMsg     = sE1.substr(iSpace+1);

    oa = new Array(sEventID, sMsg);

    return oa;
}


/*############################################################################
 * Element handling
 *##########################################################################*/

function getElement(oID)
{
    var o = null;

    // don't use isObject() here for performance
    if ( typeof oID == "object" ) {
        o = oID;
    } else if ( typeof oID == "string" ) {
        o = document.getElementById(oID);
    }

    return o;
}

function getObjectValue(o)
{
    var s = null;

    if ( ! o) { return null; }

    var sType = o.type;
    if ( ! sType ) { return s; }
    if ( "select" == sType || "select-one" == sType ) {
        var i = o.options.selectedIndex;
        if ( typeof(i) == "undefined" ) { i = o.selectedIndex; }
        s = ( i >= 0 ? o.options[i].value : null );
    } else if ( "select-multiple" == sType ) {
        s = getValues(o);
    } else if ( "radio" == sType ) {
        s = getCheckedValue(o);
    } else if ( typeof o.value != "undefined" ) {
        s = o.value;
    }

    return s;
}

function getCheckedValue(o)
{
    var s = null;

    if ( (! o ) || (typeof o.name == "undefined") ) { return null; }

    var oa = document.getElementsByName(o.name);

    var iLength = oa.length;
	if( iLength == undefined) { return null; }

	for( var i = 0; i < iLength; i++ ) 
    {
		if( oa[i].checked) { s = oa[i].value; break }
	}

    return s;
}

function getValue(sID)
{
    if ( ! sID ) { return null; }

    return getObjectValue(getElement(sID));
}

function getValues(o)
{
    var s = null;

    var oa = o.options;
    var l = oa.length;

    for (var i = 0; i < l; i++)
    {
        var oOption = oa[i];

        if ( oOption.selected == false ) { continue; }

        var o = oOption.value;
        s = push(s, o);
    }

    return s;
}

//function hide(sID) { return setDisplay(sID, "none"); }
//function show(sID) { return setDisplay(sID, ""); }

function setDisplay(sID, s)
{
    var o = getElement(sID);
    if ( o ) { o.style.display = s; }
    return ( o != null );
}

function isChecked(o)
{
    if ( typeof o == "string" ) { o = getElement(o); }

    return ( o && (o.checked == true) );
}

function push(s, o)
{
    if ( s == null ) { s = new Array(); }

    s.push(o);

    return s;
}

function setElementValue(sID, sValue)
{
    var oElement = getElement(sID);
    if ( ! oElement ) { return; }

    oElement.value = sValue;
}

function setFocus(s)
{
    var o = getElement(s);
    if ( o ) { setFocusToElement(o); }
}

function setFocusToElement(o)
{
    var b = false;

    if ( o && (typeof o.focus == 'function')
     && ((o.type) && (o.type != "hidden")) ) {
        try {
            o.focus();
            b = true;
        } catch(err) {
            b = false;
        }
    }

    return b;
}

function setSelected(sID, sValue)
{
    var oElement = getElement(sID);
    if ( ! oElement ) { return false; }

    var oOptions = oElement.options;
    if ( ! oOptions ) { return false; }

    var iNumberOfOptions = oOptions.length;
    for ( var i=0; i < iNumberOfOptions; i++)
    {
        var oOption = oOptions[i];
        if ( oOption.value == sValue ) {
            oOption.selected=true;
            return true;
        }
    }

    return false;
}

function turnOnLayer(sLayer)
{
    var o = getElement(sLayer);
    if ( o == null ) { return; }

    if ( o.style.display == "none" ) {
        o.style.display = "block";
    }
}

function turnOffLayer(sLayer)
{
    var o = getElement(sLayer);
    if ( o == null ) { return; }

    if ( o.style.display == "block" ) {
        o.style.display = "none";
    }
}

function switchLayer(sLayer)
{
    var o = getElement(sLayer);
    if ( o == null ) { return; }

    if ( o.style.display == "block") {
        o.style.display = "none";
    } else {
        o.style.display = "block";
    }
}


/*############################################################################
 * Element handling - class management
 *##########################################################################*/

function addClass(sID, sClassName)
{
    var b = false;

    var o = getElement(sID);
    if ( o == null ) { return b; }

    var s = o.className;
    if ( s == null ) {
        o.className = sClassName;
        return b;
    }

    if ( hasClass(o, sClassName) ) { return b; }

    s += " " + sClassName;

    o.className = s;

    b = true;

    return b;
}

function hasClass(sID, sClassName)
{
    var b = false;

    var o = getElement(sID);
    if ( o == null ) { return b; }

    var s = o.className;
    if ( s == null ) { return b; }

    b = ( s.indexOf(sClassName) >= 0 );

    return b;
}

function removeClass(sID, sClassName)
{
    var b = false;

    var o = getElement(sID);
    if ( o == null ) { return b; }

    if ( hasClass(o, sClassName) == false ) { return b; }

    var s = o.className;

    s = s.replace(sClassName, "");
    s = trim(s);

    o.className = s;

    b = true;

    return b;
}

function replaceClass(sID, sClassOld, sClassNew)
{
    var o = getElement(sID);
    if ( o == null ) { return; }

    if ( isEmpty(sClassOld) || isEmpty(sClassNew) ) { return; }

    if ( hasClass(o, sClassOld) ) {
        var s = o.className;

        s = s.replace(sClassOld, sClassNew);

        o.className = s;
    } else {
        addClass(o, sClassNew);
    }
}


/*############################################################################
 * Element handling - hide/show
 *##########################################################################*/

function hide(sID)
{
    var b = false;

    var o = getElement(sID);
    if ( o == null ) { return b; }

    b = addClass(o, "hidden");

//  if ( bIsIE6 && hasClass(o, "float") ) {
//      showDropDowns(document);
//  }

    setDisplay(sID, "none");

    return b;
}

function isVisible(sID)
{
    var b = false;

    var o = getElement(sID);
    if ( isEmpty(o) ) { return b; }

    b = ( hasClass(o, "hidden") == false );

    return b;
}

function setVisibility(sID, bShow)
{
    var b = false;

    if ( bShow ) { b = show(sID); } else { b = hide(sID); }

    return b;
}

function show(sID)
{
    var b = false;

    var o = getElement(sID);

    b = removeClass(o, "hidden");

//  if ( bIsIE6 && hasClass(o, "float") ) {
//      hideDropDowns(document);
//      showDropDowns(o);
//  }

    setDisplay(sID, "");

    return b;
}


/*############################################################################
 * Utilities
 *##########################################################################*/

function count(o)
{
    var i = 0;

    if ( o == null ) { return i; }

         if ( typeof o == "undefined" ) { i = 0; }
    else if ( typeof o == "string"    ) { i = o.length; }
    else if ( typeof o == "number"    ) { i = o; }
    else if ( typeof o == "boolean"   ) { i = 1; }
    else if ( typeof o == "object"    ) { i = countObject(o); }
    else if ( typeof o == "function"  ) { 
        if ( typeof o.length != "undefined" ) {
            i = o.length; // Safari NodeList?
        } else {
            i = 0;
        }
    }

    return i;
}

function countObject(o)
{
    var i = 0;

         if ( typeof o.size   == "function"  ) { i = o.size(); }
    else if ( typeof o.length != "undefined" ) { i = o.length; }

    return i;
}

function isDigit(c)
{
    var code = (typeof c == 'string' ? c.charCodeAt(0) : c );

    return ((code>=48) && (code<=57));
}

function isEmpty(o)
{
    return (isFilled(o) == false);
}

function isFilled(o)
{
    var b = false;

    if ( o == null ) { return b; }

         if ( typeof o == "undefined" ) { b = false; }
    else if ( typeof o == "function"  ) { b = false; }
    else if ( typeof o == "string"    ) { b = count(o) > 0; }
    else if ( typeof o == "number"    ) { b = true; } // value 0 is filled
    else if ( typeof o == "boolean"   ) { b = true; } // value "false" ''
    else if ( typeof o == "object"    ) { b = isFilledObject(0);
    }

    return b;
}

function isFilledObject(o)
{
    var b = false;

         if ( typeof o.size   == "function"  ) { b = (count(o) > 0); }
    else if ( typeof o.length != "undefined" ) { b = (count(o) > 0); }
    else                                       { b = true; }
 
    return b;
}

function isLetter(c)
{
    var code = (typeof c == 'string' ? c.charCodeAt(0) : c );

    return (((code>=65) && (code<=90)) || ((code>=97) && (code<=122)) );
}

function isLetterOrDigit(c)
{
    return ( isLetter(c) || isDigit(c) );
}

/**
 * Removes blank spaces from the beginning/end of a string.
 * For example:
 *
 * var s = " test  ";
 * s = trim(s); // s == "test" now
 */
function trim(sValue)
{
    if ( typeof sValue != "string" ) { return sValue; }

    return sValue.replace(/^\s+|\s+$/g, "");
}
function emailCheck (sEmailAddress) 
{
    var sEmailPat = /^(.+)@(.+)$/;
    var sSpecialChars = "\\(\\)<>@,;:\\\\\\\"\\.\\[\\]";
    var sValidChars = "\[^\\s" + sSpecialChars + "\]";
    var sQuotedUser = "(\"[^\"]*\")";
    var sIPDomainPat = /^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/;
    var sAtom = sValidChars + '+';
    var sWord = "(" + sAtom + "|" + sQuotedUser + ")";
    var sUserPat = new RegExp("^" + sWord + "(\\." + sWord + ")*$");
    var sDomainPat = new RegExp("^" + sAtom + "(\\." + sAtom +")*$");
    
    var ma = sEmailAddress.match(sEmailPat);
    if ( ma == null ) { return false }
    var user    = ma[1];
    var domain  = ma[2];
    
    if ( user.match(sUserPat) == null ) { return false; }
    
    var IPArray = domain.match(sIPDomainPat);
    if ( IPArray != null ) {
          for ( var i=1; i<=4; i++ ) {
            if ( IPArray[i] > 255 ) { return false; }
        }
        return true;
    }
    
    var domainArray = domain.match(sDomainPat);
    if ( domainArray == null ) { return false; }
    
    var sAtomPat = new RegExp(sAtom, "g");
    var domArr  = domain.match(sAtomPat);
    var len     = domArr.length;
    if ( (domArr[domArr.length-1].length<2) ||
         (domArr[domArr.length-1].length>3) ) { return false; }
    
    if ( len < 2 ) { return false }
    
    return true;
}

function lTrim(s)
{
   var whitespace = new String(" \t\n\r");

   if (whitespace.indexOf(s.charAt(0)) != -1) {
      // We have a string with leading blank(s)...
      var j=0, i = s.length;
      // Iterate from the far left of string until we
      // don't have any more whitespace...
      while (j < i && whitespace.indexOf(s.charAt(j)) != -1)
         j++;
      // Get the substring from the first non-whitespace
      // character to the end of the string...
      s = s.substring(j, i);
   }
   return s;
}

function rTrim(s)
{
   // We don't want to trip JUST spaces, but also tabs,
   // line feeds, etc.  Add anything else you want to
   // "trim" here in Whitespace
   var whitespace = new String(" \t\n\r");

   if (whitespace.indexOf(s.charAt(s.length-1)) != -1) {
      // We have a string with trailing blank(s)...
      var i = s.length - 1;       // Get length of string
      // Iterate from the far right of string until we
      // don't have any more whitespace...
      while (i >= 0 && whitespace.indexOf(s.charAt(i)) != -1)
         i--;
      // Get the substring from the front of the string to
      // where the last non-whitespace character is...
      s = s.substring(0, i+1);
   }
   return s;
}

function trim(s)
{
   return lTrim(rTrim(s));
}

function removeChars(sNumber)
{
    var s = "";
    for( var k = 0; k < sNumber.length; k++ )
    {
        c = sNumber.charCodeAt(k);
        if ( (c<48) || (c>57) ) { continue; }
        s = s.concat(sNumber.charAt(k));
    }
    return s;
}

/**
 * Check if a value is a BIC (Bank International Code).
 *
 * For BIC a new data type is introduced and the field is checked on
 * length 8 or 11 and the first six characters are always letters and the
 * rest are letters and/or numbers.
 */
function isBIC(s)
{
    var iCount = count(s);

    if ( (iCount != 8) && (iCount != 11) ) { return false; }

    // first six: letters
    // rest is letters and/or numbers
    for (i = 0; i < iCount; i++)
    {
        var c = s.charAt(i);

        var b = ( ( i < 6 ) ? isLetter(c) : isLetterOrDigit(c) );

        if ( b == false ) { return false; }
    }

    // survived checks
    return true;
}

function isElevenProof(s)
{
    var b = false;

    if ( isNaN(s) ) { return false; }

    var iLength = count(s);

    switch ( iLength )
    {
        case  9:
        case 10:
            var iCheckSum   = getCheckSumBAN(s);
            break;
        default:
            //if the length is not 8-10, then return true, no isElevenProofCheck!!
            return ( iLength != 8);
    }

    return b;
}

function getCheckSumBAN(s)
{
    var iLength = count(s);

    var iCheckSum = 0;
    var iDigit    = 0;
    var iWeight   = iLength;

    for (i =0; i < iLength; i++)
    {
        iDigit = s.charCodeAt(i) - 48;
        iCheckSum += (iDigit * iWeight--);
    }

    return iCheckSum;
}

var CNPJ_WEIGHT1 = new Array(5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2);
var CNPJ_WEIGHT2 = new Array(6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2);

function passesCNPJCheck(s)
{
    if ( count(s) != 14 ) { return false; }
     
    // readable format: dd.ddd.ddd/dddd-cc
    // accept readable format as well? => no
     
    var iSum1 = 0; var iSum2 = 0;
     
    for (var i=0; i < 13; i++)
    {
        var c = s.charCodeAt(i);
     
        if ( i < 12 ) { iSum1 += (c - 48) * CNPJ_WEIGHT1[i]; }
        iSum2 += (c - 48) * CNPJ_WEIGHT2[i];
    }
     
    var iRest1 = 11 - (iSum1 % 11);
    var iRest2 = 11 - (iSum2 % 11);
     
    if ( iRest1 >= 10 ) { iRest1 = 0; }
    if ( iRest2 >= 10 ) { iRest2 = 0; }
        
    var iDV1 = (s.charCodeAt(12) - 48);
    var iDV2 = (s.charCodeAt(13) - 48);
        
    // check on 8th digit omitted, since this does not
    // always seem to be a checkdigit of the first 7 digits
    // as is stated above

    return ( (iRest1 == iDV1) && (iRest2 == iDV2) );
}

var m = {};
m["00000000000000"] = "R";
m["11111111111111"] = "R";
m["22222222222222"] = "R";
m["33333333333333"] = "R";
m["44444444444444"] = "R";
m["55555555555555"] = "R";
m["66666666666666"] = "R";
m["77777777777777"] = "R";
m["88888888888888"] = "R";
m["99999999999999"] = "R";
var RESERVED_CPF = m;

function passesCPFCheck(s)
{
   if ( count(s) != 11 ) { return false; }

    // readable format: ddd.ddd.ddd-cc
    // accept readable format as well? => no

    if ( RESERVED_CPF[s] == "R" ) { return false; }

    var iSum1 = 0; var iSum2 = 0;

    for (var i=0; i < 10; i++)
    {
        var c = s.charCodeAt(i);

        if ( i < 9 ) { iSum1 += (c - 48) * (10 - i); }
        iSum2 += (c - 48) * (11 - i);
    }

    var iRest1 = 11 - (iSum1 % 11);
    var iRest2 = 11 - (iSum2 % 11);

    if ( iRest1 >= 10 ) { iRest1 = 0; }
    if ( iRest2 >= 10 ) { iRest2 = 0; }

    var iDV1 = (s.charCodeAt( 9) - 48);
    var iDV2 = (s.charCodeAt(10) - 48);

    return ( (iRest1 == iDV1) && (iRest2 == iDV2) );
}

function passesDateCheck(s)
{
    if ( count(s) < 8) { return false; }

    return true;
}

function passesExpiryDateCheck(oValue)
{
    if ( isNaN(oValue) ) { return false; }

    var currentDate = getCurrentDate();
    var enteredDate = getEnteredDate(oValue);
    if ( ! enteredDate ) { return false; }

    if ( currentDate > enteredDate ) { return false; }

    var iYear = currentDate.getFullYear()+25; // 25 also hardcoded in qv.jar ...
    currentDate.setFullYear(iYear);
    if ( currentDate < enteredDate ) { return false; }

    return true; // survived the checks
}

var LUHN = new Array(0,2,4,6,8,1,3,5,7,9);

function passesLuhnCheck(s)
{
    s = removeChars(s);

    // 0: check input
    var iCount = ( s == null ? 0 : s.length );
    if ( iCount < 1 ) { return false; }

    // 1: initialize the variables
    var iStart = ( ((iCount % 2) == 1) ? 1 : 0 );
    var iSum   = ( (iStart == 1) ? (s.charCodeAt(0) - 48) : 0 );
    var i      = iStart;

    // 2: calculate the sum
    while (i < iCount ) {
        iSum += LUHN[s.charCodeAt(i++) - 48];
        iSum +=      s.charCodeAt(i++) - 48;
    }

    // 3: calculate the remainder (modulo)
    return ((iSum % 10) == 0);
}

function getCurrentDate()
{
    var d = new Date();
    d.setDate        (1);
    d.setHours       (0);
    d.setMinutes     (0);
    d.setSeconds     (0);
    d.setMilliseconds(0);

    return d;
}

function getEnteredDate(oValue)
{
    var sMM = oValue.substring(0, 2);
    var sYY = oValue.substring(2, 4);

  //var iMM = parseInt(sMM) -1; // SJN 20060502: parseInt("08") => -1 !!!
    var iMM = 1*sMM -1;         // 1*"08" => 8

    if ( iMM > 12 ) { return null; }

    return new Date("20"+sYY, iMM, "01");
}

function FormValidation()
{
    this.checkObjects               = new Array();
    this.language                   = new Array();
    this.stopValidationOnFirstError = false;
    this.validateHiddenFields       = false;
    this.iErrorHandling             = 2;

    // methods
    this.initMessageStringsEN   = F_initMessageStringsEN;
    this.define                 = F_define;
    this.undefine               = F_undefine;
    this.checkErrors            = F_checkErrors;
    this.checkMinMax            = F_checkMinMax;
    this.checkMinMaxLength      = F_checkMinMaxLength;
    this.checkMinMaxValue       = F_checkMinMaxValue;
    this.checkValue             = F_checkValue;
    this.getDefinition          = F_getDefinition;
    this.getField               = F_getField;
    this.getMessage             = F_getMessage;
    this.getValue               = F_getValue;
    this.handleError            = F_handleError;
    this.isFormValid            = F_isFormValid;
    this.mustCheckField         = F_mustCheckField;
    this.mustCheckObject        = F_mustCheckObject;
    this.clearFields            = F_clearFields;

    this.checkBIC               = F_checkBIC;
    this.checkCPF_CNPJ          = F_checkCPF_CNPJ;
    this.checkBankAccountNumber = F_checkBankAccountNumber;
    this.checkCreditCardNumber  = F_checkCreditCardNumber;
    this.checkDate              = F_checkDate;
    this.checkDecimal           = F_checkDecimal;
    this.checkEmailAddress      = F_checkEmailAddress;
    this.checkExpiryDate        = F_checkExpiryDate;
    this.checkPositiveAmount    = F_checkPositiveAmount;
}

function F_initMessageStringsEN()
{
    // change strings used for error messages
    this.language["accept"]    = "The terms and conditions must be accepted!";
    this.language["invalid"]   = "{0} is invalid!";
    this.language["header"]    = "Attention!";
    this.language["require"]   = "Field {0} is mandatory.";
    this.language["positions"] = "Field {0} must exist of a minimum of {1} and a maximum of {2} characters.";
    this.language["numeric"]   = "Field {0} must contain a number.";
    this.language["minlength"] = "Field {0} has a minimum length of {1} characters.";
    this.language["maxlength"] = "Field {0} has a maximum length of {1} characters.";
    this.language["minvalue"]  = "Field {0} must be at least {1}.";
    this.language["maxvalue"]  = "Field {0} may not exceed {1}.";
    this.language["cvv"]       = "Field {0} is required.";
    this.language["start"]     = ''; // "The following error has occurred:\n";
}

function F_define(sID, sInputFieldName, iInputFieldType, bRequired
                 , sHtmlName, iMinimumLength, iMaximumLength
                 , iMinimumValue, iMaximumValue, doc)
{
    var o = new formResult(sID, sInputFieldName, iInputFieldType, bRequired
                         , sHtmlName, iMinimumLength, iMaximumLength
                         , iMinimumValue, iMaximumValue);

    var l = this.checkObjects.length;

    this.checkObjects[l]   = o;
    this.checkObjects[sID] = l;
}

function F_getDefinition(sID)
{
    return this.checkObjects[this.checkObjects[sID]];
}

function F_isFormValid()
{
    resetErrors();

    var iCheckCount = count(this.checkObjects);
    if ( iCheckCount <= 0 ) { return true; }

    var bFocusHasBeenSet = false;
    var sErrors     = "";

    for (var i = 0; i < iCheckCount; i++)
    {
        var checkObject = this.checkObjects[i];
        if ( this.mustCheckObject(checkObject) == false ) { continue; }

        var field = this.getField(checkObject);
//      if ( this.mustCheckField(field) == false ) { continue; }

        var sID = checkObject.sID;
        var oValue = this.getValue(sID, field, checkObject);

        var sErr = this.checkMinMax(field, oValue, checkObject);
        var bIsValid = isEmpty(sErr);
        if ( bIsValid ) {
            sErr = this.checkValue(oValue, checkObject);
            bIsValid = isEmpty(sErr);
        }

        if ( bIsValid == false ) { sErrors += "\n"; sErrors += sErr; }

        bFocusHasBeenSet = this.handleError(checkObject, field, sID, bIsValid
                                          , bFocusHasBeenSet, sErr);
    }

    return this.checkErrors(sErrors);

    var bErrorsHandled = false;
}

function F_clearFields()
{
    this.checkObjects = new Array();
}

function F_getMessage(sMessage, fields)
{
    var s = this.language[sMessage];

    for ( var i=0; i< count(fields); i++ ) {
        var sRegExp="{"+i+"}";
        s = s.replace(sRegExp, fields[i]);
    }

    return s;
}

function F_undefine(sInputFieldName)
{
    for ( var i = 0; i < this.checkObjects.length; i++ )
    {
        if ( !(this.checkObjects[i]) ) { continue; }
        if ( this.checkObjects[i].sInputFieldName == sInputFieldName ) {
            this.checkObjects[i] = null;
        }
    }
}

function formResult(sID, sInputFieldName, iInputFieldType, bRequired, sHtmlName
                   , iMinimumLength, iMaximumLength, iMinimumValue, iMaximumValue)
{
    this.bRequired       = bRequired;
    this.sID             = sID;
    this.sInputFieldName = sInputFieldName;
    this.iInputFieldType = iInputFieldType;
    this.iMinimumLength  = iMinimumLength;
    this.iMaximumLength  = iMaximumLength;
    this.iMinimumValue   = iMinimumValue;
    this.iMaximumValue   = iMaximumValue;
    this.sHtmlName       = sHtmlName;
}

/*
    4.8.1   Error handling

    Depending on parameter ORB_ERRORHANDLING (bitmask)
    1. Error message between and header and fields
    2. Error sign and message right of field (like now)
    4. Put errorclass on fieldname label
    8. Put errorinputfield on inputfield box
*/
function handleFormErrors(sFieldID, sFieldName, sMessage)
{
    switch ( formValidation.iErrorHandling )
    {
        case 1: break;
        case 2:
            var o = getElement("ERRORMESSAGE_" + sFieldID);
            if ( o ) { o.innerHTML = sMessage; }
            turnOnLayer('ERROR_' + sFieldID);
            break;
        case 4:
            var o2 = getElement("LABEL_"+sFieldID);
            if ( o2 ) { o2.style.color = "red"; }
            break;
        case 8: break;
    }
}

function F_mustCheckField(field)
{
    if ( typeof field == 'undefined' ) { return false; }
    if ( field        == null )        { return false; }
    if ( field.type   == "hidden" )    { return false; }

    return true;
}

function F_mustCheckObject(checkObject)
{
    if ( ! checkObject ) { return false; }

    var sID = checkObject.sID;

    var oTR = getElement("FIELD_"+sID);
    if ( ! oTR ) {
        alert("field "+ i +" has no TR, id: " + sID);
        return false;
    }

    var sStyle = oTR.style;
    if ( ! sStyle ) {
        alert("field "+ i +" TR has no style: " + oTR.outerHTML);
        return false;
    }

    var sDisplay = sStyle.display;
    if ( sDisplay == "none" ) { return false; }

    return true;
}

function resetErrors()
{
    var oa = null;

    switch ( formValidation.iErrorHandling )
    {
         case 2:
            oa = document.getElementsByTagName("td");
            break;
         case 4:
            oa = document.getElementsByTagName("span");
            break;
    }

    var iNumberOf = count(oa);

    for (var i = 0; i < iNumberOf; i++)
    {
        var o = oa[i];
        if ( (! o) || (! o.style) ) { continue; }

        var sID = o.id;
        if ( ! sID ) { continue; }

        if ( sID.indexOf("LABEL_") == 0 ) {
            // formValidation.iErrorHandling == 2
            var sColor = o.style.color;
            if ( ! sColor ) { continue; }
            if ( sColor == "red" ) { o.style.color = ""; }
            // cannot set to black! => depends on original color
        } else if ( sID.indexOf("ERRORMESSAGE_") == 0 ) {
            // formValidation.iErrorHandling == 4
            o.innerHTML = "";
            turnOffLayer('ERROR_' + sID.substring(13));
        } 
    }

    var iCheckCount = count(this.checkObjects);
    if ( iCheckCount <= 0 ) { return; }

    for (var i = 0; i < iCheckCount; i++)
    {
        var checkObject = this.checkObjects[i];
        if ( this.mustCheckObject(checkObject) == false ) { continue; }

        var sID = checkObject.sID;
        turnOffLayer("ERROR_"+sID);
    }

    return true;
}

function F_getValue(sID, field, checkObject)
{
    var o = null;

    var iFieldType = checkObject.iInputFieldType;

    if ( (field.type == "select") || (field.type == "select-one")  ) {
         o  = field.options[field.options.selectedIndex].value;
    } else if ( (iFieldType == 10003)
             || (iFieldType == 10004)
             || (iFieldType == 10005) ) {
        if( field.options) {
            var iSelectedIndex = field.options.selectedIndex;
            if ( iSelectedIndex < 0 ) {
                o = "";
            } else {
                o = field.options[field.options.selectedIndex].value;
            }
        } else if ( field.type == "checkbox" ) {
            o  = field.value;
        } else {
            o  = field.value;
        }
    } else if ( iFieldType == 10009 ) {
        o  = ((field.value) ? field.value :"M");
    } else if ( (iFieldType == 10097) || (iFieldType == 1000000) ) {
        if ( field.checked ) { o = field.value; }
    } else if ( (iFieldType == 10117) || (iFieldType == 10118) ) {
        o = getObjectValue(field);
    } else {
        o  = field.value;
        var oObfuscated = getElement(sID+"_OBFUSCATED");

        if ( oObfuscated && (oObfuscated.value == o) ) {
            // not changed => use CLEAR in check
            var oClear = getElement(sID+"_CLEAR");
            if ( oClear ) { o = oClear.value; }
        }
        if ( o && (iFieldType != 10063) && (iFieldType != 10064) ) { o = trim(o); } // GC16511...
    }

    return o;
}

function F_checkMinMax(field, oValue, checkObject)
{
    var sError = this.checkMinMaxLength(field, oValue, checkObject);
    if ( isFilled(sError) ) { return sError; }
    
    return this.checkMinMaxValue(field, oValue, checkObject);
}

function F_checkMinMaxLength(field, oValue, checkObject)
{
    var bRequired = ( (checkObject.bRequired == "y") || (checkObject.bRequired== true) );
    var iFieldLength = count(oValue);

    var sErrors = "";

    if ( bRequired && (iFieldLength <= 0) && (checkObject.iInputFieldType != 10097) ) {
        sErrors += this.getMessage('require',new Array(checkObject.sHtmlName));
    }
    if ( (checkObject.iInputFieldType == 10097 ) && (field.checked == false) ) {
        sErrors += this.getMessage('accept'); //, new Array(checkObject.sHtmlName));
    }
  //if ( (checkObject.iInputFieldType == 1000000 ) && (field.checked == false) ) {
  //    sErrors += this.getMessage('agree', new Array(checkObject.sHtmlName));
  //}
    var iMinimumLength = checkObject.iMinimumLength;
    if ( (bRequired || (iFieldLength>0)) && (iMinimumLength && (iFieldLength < iMinimumLength))) {
        sErrors += this.getMessage('minlength',new Array(checkObject.sHtmlName, iMinimumLength));
    }
    var iMaximumLength = checkObject.iMaximumLength;
    if ( iMaximumLength && (iFieldLength > iMaximumLength)) {
        sErrors += this.getMessage('maxlength',new Array(checkObject.sHtmlName, iMaximumLength));
    }

    return sErrors;
}

function F_checkMinMaxValue(field, oValue, checkObject)
{
    var iFieldType = checkObject.iInputFieldType;
    if ( (iFieldType != 3) && (iFieldType != 10008) ) {
        return null;
    }

    var sErrors = "";

    var iValue = parseInt(oValue);
    var iMinimumValue  = checkObject.iMinimumValue;
    if ( ( iMinimumValue != null ) && ( iValue < iMinimumValue ) ) {
        sErrors += this.getMessage('minvalue',new Array(checkObject.sHtmlName, iMinimumValue));
    }
    var iMaximumValue  = checkObject.iMaximumValue;
    if ( ( iMaximumValue != null ) && ( iValue > iMaximumValue ) ) {
        sErrors += this.getMessage('maxvalue',new Array(checkObject.sHtmlName, iMaximumValue));
    }

    return sErrors;
}

function F_checkValue(o, checkObject)
{
    var s = null;

    var iFieldType = checkObject.iInputFieldType;
    var sHtmlName  = checkObject.sHtmlName;

    switch ( iFieldType )
    {
        case     3:
        case 10063:
        case 10064:
        case 10116:
            s = this.checkDecimal(o, checkObject); break;
        case 10008:
            s = this.checkPositiveAmount(o, checkObject); break;
        case 10007:
            s = this.checkEmailAddress(o, checkObject); break;
        case 20000:
            s = this.checkBankAccountNumber(o, checkObject); break;
        case 10001:
            s = this.checkCreditCardNumber(o, checkObject); break;
        case 10006:
        case 10221:
            s = this.checkExpiryDate(o, checkObject); break;
        case 10010:
            s = this.checkDate(o, checkObject); break;
      //case 10110; // StateCode
      //    break;
        case 10100:
            s = this.checkCPF_CNPJ(o, checkObject); break;
        case 10105:
            s = this.checkBIC(o, checkObject); break;
    }

    return s;
}

function F_handleError(checkObject, field, sID, bIsValid, bFocusHasBeenSet, sError)
{
    if( bIsValid ) { return bFocusHasBeenSet; }

    // else:
    if ( typeof handleFormErrors != 'undefined' ) {
        var sField  = checkObject.sInputFieldName;
        handleFormErrors(sID, sField, sError);
    }

    if( bFocusHasBeenSet == false ) {
        // set focus to the first element causing the error
        if( field && (field.focus) && (field.hidden==false) ) {
            field.focus();
            bFocusHasBeenSet = true;
        }
    }

    return bFocusHasBeenSet;
}

function F_checkErrors(sErrors)
{
    var b = false;

    var oMessageRow = getElement("MESSAGEROW");
    if ( oMessageRow ) { oMessageRow.style.display = "none"; }

    if ( isEmpty(sErrors) ) { return true; }

    // else: errors
    if ( this.iErrorHandling == 1 ) {
        var oElement = getElement("MESSAGETEXT");
        if ( oElement ) {
            oElement.innerHTML = sErrors;
            if ( oMessageRow ) { oMessageRow.style.display = ""; }
        }
    }

    if ( (this.iErrorHandling != 2) && (this.iErrorHandling != 4) ) {
        var s = this.language["header"] + "\n" + sErrors;
        alert(s);
    }

    return b;
}

function F_getField(checkObject)
{
    var sID = checkObject.sID;
    if ( typeof sID != "string" ) { return; }

    var iIndexOfF  = sID.indexOf("F");
    var sIDToCheck = sID.substring(iIndexOfF);

    return getElement(sIDToCheck);
}

function F_checkBIC(oValue, checkObject)
{
    var s = null;
    var iFieldLength = count(oValue);
    if ( (iFieldLength > 0) && !isBIC(oValue) ) {
        s = this.getMessage('invalid',new Array(checkObject.sHtmlName));
    }
    return s;
}

function F_checkBankAccountNumber(oValue, checkObject)
{
    var s = null;
    if ( !isElevenProof(oValue) ) {
        s = this.getMessage('invalid',new Array(checkObject.sHtmlName));
    }
    return s;
}

function F_checkCPF_CNPJ(oValue, checkObject)
{
    var s = null;
    if ( !passesCPFCheck(oValue) && !passesCNPJCheck(oValue) ) {
        s = this.getMessage('invalid',new Array(checkObject.sHtmlName));
    }
    return s;
}

function F_checkCreditCardNumber(oValue, checkObject)
{
    var s = null;
    if ( !passesLuhnCheck(oValue) ) {
        s = this.getMessage('invalid',new Array(checkObject.sHtmlName));
    }
    return s;
}

function F_checkDate(oValue, checkObject)
{
    var s = null;
    var iFieldLength = count(oValue);
    if ( (iFieldLength > 0) && !passesDateCheck(oValue) ) {
        s = this.getMessage('invalid',new Array(checkObject.sHtmlName));
    }
    return s;
}

function F_checkDecimal(oValue, checkObject)
{
    var s = null;
    if ( typeof oValue == "string" ) {
        // TODO: make method out of this
        var n = oValue.length;
        for ( var i = 0; i < n; i++ )
        {
            var c = oValue.charAt(i);
            if ( (' ' == c) || isNaN(c) ) {
              return this.getMessage('numeric',new Array(checkObject.sHtmlName));
            }
        }
    }

    if ( isNaN(oValue) ) {
        // an empty string is interpeted as a number: for isNaN('') returns false
        s = this.getMessage('numeric', new Array(checkObject.sHtmlName));
    }
    return s;
}

function F_checkEmailAddress(oValue, checkObject)
{
    var s = null;
    var iFieldLength = count(oValue);
    if ( (iFieldLength > 0) && (!emailCheck(oValue)) ) {
        var sHtmlName = checkObject.sHtmlName;
        s = this.getMessage('invalid',new Array(sHtmlName));
    }
    return s;
}

function F_checkExpiryDate(oValue, checkObject)
{
    var s = null;
    if ( !passesExpiryDateCheck(oValue) ) {
        s = this.getMessage('invalid',new Array(checkObject.sHtmlName));
    }

    return s;
}

function F_checkPositiveAmount(oValue, checkObject)
{
    var sHtmlName = checkObject.sHtmlName;
    if ( isNaN(oValue) ) {
        // an empty string is interpeted as a number: for isNaN('') returns false
        return this.getMessage('numeric',new Array(sHtmlName));
    }
    if ( oValue < 0 ) {
        return this.getMessage('invalid',new Array(sHtmlName));
    }
    if ( checkObject.minValue && checkObject.maxValue
         && (checkObject.valInt < checkObject.minValue || checkObject.valInt > checkObject.maxValue) ) {
        return this.getMessage('minmax',new Array(sHtmlName,checkObject.minValue,checkObject.maxValue));
    }
    return null;
}

function getPaymentField(oElement)
{
    if ( ! oElement ) { return null; }

    var sID = oElement.id;

    var iIndexOfF = sID.indexOf("F");
    if ( (! iIndexOfF) || (iIndexOfF < 0) ) { return null; }

    return sID.substring(iIndexOfF+1);
}

function getPaymentProduct(oElement)
{
    if ( ! oElement ) { return null; }

    var sID = oElement.id;

    var iIndexOfP = sID.indexOf("P");
    if ( (! iIndexOfP) || (iIndexOfP < 0) ) { return null; }

    var iIndexOfF = sID.indexOf("F");
    if ( (! iIndexOfF) || (iIndexOfF < 0) ) { return null; }

    return sID.substring(iIndexOfP+1, iIndexOfF);
}

function getMonth(sPPID, sPFID) { return getShowValueXX(sPPID, sPFID); }  
function getYear (sPPID, sPFID) { return getShowValueXX(sPPID, sPFID); }

function getShowValueXX(sPPID, sPFID)
{
    var sID = ( sPPID ? "P"+sPPID : "" ) + "F" + sPFID;

    var o = getValueById(sID);

    var s = ( isNaN(o) ? "--" : o );

    if ( s.length == 1 ) { s = "0"+s; }

    return s;
}

function setMonth(oElement, oEvent)
{
    if ( ! oElement ) { return; }

    var sPPID  = getPaymentProduct(oElement);
    var sPFID  = getPaymentField  (oElement);

    var sMonth = getMonth(sPPID, sPFID);
    var sYear  = getYear (sPPID, sPFID);

    var oElement = getElement("EXPIRYDATE");

    oElement.value = sMonth + sYear;
}

// hide fields that are from other products, show fields of this product
function setProduct(oElement, oEvent)
{
    var bIsNetscape = (!document.all);

    if ( ! oEvent ) { oEvent = window.event; }

    var sPPID = getObjectValue(oElement);
    if ( ! sPPID ) { return false; }

    var oPPID = getElement("PAYMENTPRODUCTID");
    if ( oPPID ) { oPPID.value = sPPID; }

    showProductFields(sPPID);
}

function showProductFields(sPPID)
{
    var oTRs = document.getElementsByTagName("tr");
    if ( ! oTRs ) { return false; }

    var iNumberOfRows = ( oTRs ? oTRs.length : 0 );

    for ( var r = 0; r < iNumberOfRows; r++ )
    {
        var oTR = oTRs[r];

        var sID = oTR.id;   // e.g. FIELD_P1F1009 => PPID=1,PFID=1009
        if ( ! sID ) { continue; }

        // id's must start with a letter, or underscore, ...,
        // but not with a number

        // FIELD_Fx

        var iIndexOfRow = sID.indexOf("FIELD_");
        if ( iIndexOfRow < 0 ) { continue; }

        var iIndexOfFieldID = sID.indexOf("F",6);
        if ( iIndexOfFieldID < 0 ) { continue; }

        var sRowPPID = sID.substring(7, iIndexOfFieldID);
        if ( ! sRowPPID ) { continue; }

        var sDisplay = ( (sRowPPID == sPPID) ? "" : "none" );

        oTR.style.display = sDisplay;
    }
}

function NewWindow(mypage,myname,w,h,scroll,pos,sFullWindow)
{
    if ( mypage.indexOf("http") < 0 ) { mypage = "/orb/jsp" + mypage; }

    if( sFullWindow == null ) { sFullWindow='yes'; }

    if( pos == "random" ) {
        LeftPosition=(screen.width)?Math.floor(Math.random()*(screen.width-w)):100;
        TopPosition=(screen.height)?Math.floor(Math.random()*((screen.height-h)-75)):100;
    } else if(pos == "center") {
        LeftPosition=(screen.width)?(screen.width-w)/2:100;
        TopPosition=(screen.height)?(screen.height-h)/2:100;
    } else {
        LeftPosition=0;TopPosition=20
    }
    settings='width='+w +',height='+h +',top='+TopPosition
            +',left='+LeftPosition +',scrollbars='+scroll
            +',location='+sFullWindow +',directories=no,status='+sFullWindow
            +',menubar='+sFullWindow +',toolbar='+sFullWindow +',resizable='+sFullWindow;

  //var wind = "win" + new Date().getTime();

    window.open(mypage,myname,settings);
}

function onBeforePrint()
{
    hide("MODULES");

    var i = 0;
    while ( true )
    {
        if ( hide("MODULE_BUTTON_"+i) == false ) { break; }
        i++;
    }

    hide("MODULE4");
}

/*
    FireFox handles the sequence:

    "onBeforePrint(); javascript:window.print(); onAfterPrint();"

    different than Internet Explorer. window.print() has no return value
    , so FireFox will handle window.print() and onAfterPrint();
    simultaneously. It has been reported that this can even cause
    Firefox to crash.

    Until a good solution is known, I will hold the customer bizzy
    with an extra alert. In the meantime some div's that are made
    invisible by the onBeforePrint call stay invisible during the
    printing process.
*/
function onAfterPrint()
{
    alert("<%= sPrintPressToContinue %>");

    show("MODULES");

    var i = 0;
    while ( true )
    {
        if ( show("MODULE_BUTTON_"+i) == false ) { break; }
        i++;
    }

    show("MODULE4");
}

function openCVVHelpWindow(sURL)
{
    NewWindow(sURL, '_blank', '500', '300', 'no', 'center', 'no');
    return false;
}

function returnToMerchant(sFormName)
{
    var oActionElement = getElement("ACTION");
    if ( ! oActionElement ) {
        alert("Exception: hidden element 'ACTION' not found in document");
        return false;
    }
    oActionElement.value = "RETURN_TO_MERCHANT";

    var oFormElement = getElement(sFormName);
    if ( ! oFormElement ) {
        alert("Exception: form '" + sFormName + "' not found in document");
        return false;
    }

    oFormElement.submit();

    return true;  // OK after submit ?
}

var m_hBBAN_IBAN = null;

/*############################################################################
 * Public methods
 *##########################################################################*/

// onsubmit event on submit button
function doContinuePayment()
{
    if ( m_bIsAlreadySubmitted ) {
        alert(m_sMessageFormSubmitted);
        return false;
    }

    // copy values to hidden fields (if multiple products)
    try {
        doSetHiddenFields();
    } catch (e) {
        alert("[doSetHiddenFields] Exception: " + e);
        return false;
    }

    try {
        var bIsFormValid = formValidation.isFormValid();
        if ( bIsFormValid ) {
            m_bIsAlreadySubmitted = true;
            hide("MISSING");
            show("PROGRESS");
            return true;
        }
    } catch (e) {
        alert("[formValidation.isFormValid] Exception: " + e);
        return false;
    }

    return false;
}

// remember initial BBAN/IBAN mandatory-ness
function setBBAN_IBAN(sKey)
{
    if ( isEmpty(sKey) || ("null" == sKey) ) { return; } // QUAD-614

    updateFormValidation(sKey);
    updateCaptions      (sKey);
}

function updateCaptions(sKey)
{
    var sa = ["ACCOUNTNUMBER","BANKACCOUNTNUMBER"
            , "BANKCHECKDIGIT","BANKCODE","BRANCHCODE"
            , "IBAN", "BIC"];

    for (var i = 0; i < sa.length; i++)
    {
        var sName = sa[i];

        var oa = m_hBBAN_IBAN[sName];
        if ( ! oa ) { continue; }

        var sMarker = oa[4];
        if ( ! sMarker ) { continue; }

        var bIsMandatory = isMandatory(sKey, sName, oa[2]);

        var sID = oa[0];

        var oElement = getElement("MANDATORY_"+sID);
        if ( ! oElement ) { continue; }

        var sText = ( bIsMandatory ? sMarker : "&nbsp;" );

        oElement.innerHTML = sText;
    }
}

function updateFormValidation(sKey)
{
    var sa = ["ACCOUNTNUMBER"
            , "BANKACCOUNTNUMBER", "BANKCHECKDIGIT","BANKCODE","BRANCHCODE"
            , "IBAN", "BIC"];

    for (var i = 0; i < count(sa); i++)
    {
        var sName = sa[i];

        var oa = m_hBBAN_IBAN[sName];
        if ( ! oa ) { continue; }

        var bIsMandatory = isMandatory(sKey, sName, oa[2]);
        var iMinLength = ( bIsMandatory ? oa[3] : 0 );

        var sID = oa[0];

        var oValidation = formValidation.getDefinition(sID);
        if ( ! oValidation ) { continue; }

        oValidation.bRequired      = bIsMandatory;
        oValidation.iMinimumLength = iMinLength;
    }
}


/*############################################################################
 * Private methods
 *##########################################################################*/

/**
 * This function is only relevant if multiple products are available.
 * Only then are hidden paymentfields used.
 */
function doSetHiddenFields()
{
    var sPPID = getValue("PAYMENTPRODUCTID");

    // getElementsByTagName is case-sensitive ?
    var oaInput = document.getElementsByTagName("INPUT");

    var iNumberOfInput = count(oaInput);

    for (var i = 0; i < iNumberOfInput; i++)
    {
        var oInput = oaInput[i];
        if ( ! oInput ) { continue; }

        var sType = oInput.type;

        if ( (!sType) || (sType != "hidden") ) { continue; }

        var sID   = oInput.id;
        var sName = oInput.name;

        if ( (typeof sID == "string") && (sID.indexOf("_OLD") > 0) ) { continue; }

        setValue(oInput, sPPID, sID, sName);
    }
}

function isMandatory(sKey, sName, b)
{
    return ((("IBAN" == sKey) && ("IBAN" == sName))
         || (("BBAN" == sKey) && (b == true)));
}

function onSubmit()
{
    return true;
}

function setExpiryValue(oInput, sPPID, sID, sName)
{
    var oElementMM = getElement("P"+sPPID+sID+"_MM");
    var oElementYY = getElement("P"+sPPID+sID+"_YY");

    if ( (!oElementMM) || (!oElementYY) ) { 
        oElementMM = getElement(sID+"_MM");
        oElementYY = getElement(sID+"_YY");
    }

    if ( (!oElementMM) || (!oElementYY) ) { return; }

    var oMM = getObjectValue(oElementMM);
    var oYY = getObjectValue(oElementYY);

    oInput.value = oMM + oYY;
}

function setHiddenValue(oSourceElement, sTargetID)
{
    if ( ! sTargetID ) { return; }

    var oTargetElement = getElement(sTargetID);
    if ( ! oTargetElement ) { return; }

    var oSourceValue = oSourceElement.value;
    if ( typeof oSourceValue == "undefined" ) { return; }

    oTargetElement.value = oSourceValue;
}

function setValue(oInput, sPPID, sID, sName)
{
    if ( ("ACTION" == sName) || ("PAYMENTPRODUCTID" == sName) ) {
        return;
    }

    if ( "EXPIRYDATE" == sName ) {
        setExpiryValue(oInput, sPPID, sID, sName);
        return;
    }

    // else: other fields
    var oElement = getElement("P"+sPPID+sID);
    if ( !oElement ) { return; }
    var oValue = getObjectValue(oElement);
    oInput.value = oValue;
}
