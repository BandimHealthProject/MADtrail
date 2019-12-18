/**
 * Responsible for rendering children to phone follow-up
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var children, date;
// note that persons are the MIFs
function display() {
    console.log("Persons list loading");
    date = util.getQueryParameter('date');

    console.log(date);
    // Set the background to be a picture.
    //var body = $('body').first();
    //body.css('background', 'url(img/form_logo.png) fixed');
    loadChildren();
}

function loadChildren() {
    // SQL to get children
    
    var varNames = "i.NUMEST, i._id, i.DATINC, i.DOB, i.IDADEANO, i.IDADEMES, i.INC, i.NOMECRI, i.NOMERESP, i.SEX, i.TELEMOVEL1, i.TELEMOVEL2, i.TELEMOVEL3, CHAMADA11, CHAMADA12, CHAMADA13, CHAMADA21, CHAMADA22, CHAMADA23, CHAMADA31, CHAMADA32, CHAMADA33, DATSEGUI1, DATSEGUI2, DATSEGUI3, FOLLOWUP, HOSPI, VITALCRI, MADTRIAL_FU_PHONE._id AS FUrowId "
    var sql = "SELECT " + varNames + 
        " FROM MADTRIAL_INC AS i " +
        " LEFT JOIN MADTRIAL_FU_PHONE ON i._id = MADTRIAL_FU_PHONE.IDINC " + // join on tablet generated IDs
        " WHERE i.INC = 1" +
        " GROUP BY i._id HAVING MAX(FOLLOWUP) OR FOLLOWUP IS NULL " + // This makes sure the most recent follup up is shown
        " ORDER BY i.NUMEST ASC";
    children = [];
    console.log("Querying database for included children...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " children");
        for (var row = 0; row < result.getCount(); row++) {
            var NUMEST = result.getData(row,"NUMEST");
            var rowId = result.getData(row,"_id").slice(5); // tablet ID from INC
            var FUrowId = result.getData(row,"FUrowId"); // tablet ID from FU_Phone
            
            var DATINC = result.getData(row,"DATINC");
            var DOB = result.getData(row,"DOB");
            var IDADEANO = result.getData(row,"IDADEANO");
            var IDADEMES = result.getData(row,"IDADEMES");
            var INC = result.getData(row,"INC");
            var NOMECRI = titleCase(result.getData(row,"NOMECRI"));
            var NOMERESP = titleCase(result.getData(row,"NOMERESP"));
            var SEX = result.getData(row,"SEX");
            var TELEMOVEL1 = result.getData(row,"TELEMOVEL1");
            var TELEMOVEL2 = result.getData(row,"TELEMOVEL2");
            var TELEMOVEL3 = result.getData(row,"TELEMOVEL3");
            var CHAMADA11 = result.getData(row,"CHAMADA11");
            var CHAMADA12 = result.getData(row,"CHAMADA12");
            var CHAMADA13 = result.getData(row,"CHAMADA13");
            var CHAMADA21 = result.getData(row,"CHAMADA21");
            var CHAMADA22 = result.getData(row,"CHAMADA22");
            var CHAMADA23 = result.getData(row,"CHAMADA23");
            var CHAMADA31 = result.getData(row,"CHAMADA31");
            var CHAMADA32 = result.getData(row,"CHAMADA32");
            var CHAMADA33 = result.getData(row,"CHAMADA33");
            var DATSEGUI1 = result.getData(row,"DATSEGUI1");
            var DATSEGUI2 = result.getData(row,"DATSEGUI2");
            var DATSEGUI3 = result.getData(row,"DATSEGUI3"); 
            var FOLLOWUP = Number(result.getData(row,"FOLLOWUP")); // variabel for followup
            var HOSPI = result.getData(row,"HOSPI");
            var VITALCRI = result.getData(row,"VITALCRI");

            var p = { type: 'child', NUMEST, rowId, FUrowId, DATINC, DOB, IDADEANO, IDADEMES, INC, NOMECRI, NOMERESP, SEX, TELEMOVEL1, TELEMOVEL2, TELEMOVEL3, CHAMADA11, CHAMADA12, CHAMADA13, CHAMADA21, CHAMADA22, CHAMADA23, CHAMADA31, CHAMADA32, CHAMADA33, DATSEGUI1, DATSEGUI2, DATSEGUI3, FOLLOWUP, HOSPI, VITALCRI };
            console.log(p);
            children.push(p);
        }
        console.log("loadChildren:", children)
        populateView();
        return;
    }
    var failureFn = function( errorMsg ) {
        console.error('Failed to get children from database: ' + errorMsg);
        console.error('Trying to execute the following SQL:');
        console.error(sql);
        alert("Program error Unable to look up persons.");
    }

    odkData.arbitraryQuery('MADTRIAL_INC', sql, null, null, null, successFn, failureFn);
}

function populateView() {
    console.log("CHILDREN:", children);
    var today = new Date(date);

    // Set today's date as adate for easy comparing
    var d = today.getDate();
    var m = today.getMonth()+1;
    var y = today.getFullYear();
    var todayAdate = "D:" + d + ",M:" + m + ",Y:" + y;
    console.log("adate",todayAdate);
    // Here we need to do the sorting into 3 lists.
    // FU1: First follow-up not completed
    // FU2: Second follow-up not completed
    // FU3: Third follow-up not completed

    var FU1 = [];
    var FU2 = [];
    var FU3 = [];
    children.forEach(function(child) {
        var visitedToday;
        if (child.DATSEGUI1 == todayAdate | child.DATSEGUI2 == todayAdate | child.DATSEGUI3 == todayAdate) {
            visitedToday = true;
        }

        if (child.FOLLOWUP == 0 ) {
            FU1.push(child);
        } else if (child.FOLLOWUP == 1 & ((child.VITALCRI == null | child.HOSPI == null) & child.DATSEGUI3 == null | visitedToday == true)) {
            FU1.push(child);
        } else if (child.FOLLOWUP == 1 & ((child.VITALCRI != null & child.HOSPI != null) | child.DATSEGUI3 != null)) {
            FU2.push(child);
        } else if (child.FOLLOWUP == 2 & ((child.VITALCRI == null | child.HOSPI == null) & child.DATSEGUI3 == null | visitedToday == true)) {
            FU2.push(child);
        } else if (child.FOLLOWUP == 2 & ((child.VITALCRI != null & child.HOSPI != null) | child.DATSEGUI3 != null)) {
            FU3.push(child);
        } else if (child.FOLLOWUP == 3 & ((child.VITALCRI == null | child.HOSPI == null) & child.DATSEGUI3 == null | visitedToday == true)) {
            FU3.push(child);
        }
    });

    console.log("FU1:",FU1);
    console.log("FU2:",FU2);
    console.log("FU3:",FU3);

    var ul1 = $('#fu1');
    var ul2 = $('#fu2');
    var ul3 = $('#fu3');

    // First follow-up
    $.each(FU1, function() {
        console.log(this);
        var that = this;      
        
        // Check if visited today
        var visited = '';
        if (this.DATSEGUI1 == todayAdate | this.DATSEGUI2 == todayAdate | this.DATSEGUI3 == todayAdate) {
            visited = "visited";
        };
        
        // Set date/time contraint
        var incD = this.DATINC.slice(2, this.DATINC.search("M")-1);
        var incM = this.DATINC.slice(this.DATINC.search("M")+2, this.DATINC.search("Y")-1);
        var incY = this.DATINC.slice(this.DATINC.search("Y")+2);  
        var incDate3m = new Date(incY, incM-1 + 3, incD);
        console.log("inc + 3m", incDate3m);
        console.log("today", today);

        if (incDate3m <= today) {
        ul1.append($("<li />").append($("<button />").attr('id',this.rowId).attr('class', visited + ' btn ' + this.type).text(this.NUMEST)));
        }

        var btn = ul1.find('#' + this.rowId);
        btn.on("click", function() {
            openForm(that);
        })
    });

    // second follow-up
    $.each(FU2, function() {
        console.log(this);
        var that = this;      
        
        // Check if visited today
        var visited = '';
        if (this.DATSEGUI1 == todayAdate | this.DATSEGUI2 == todayAdate | this.DATSEGUI3 == todayAdate) {
            visited = "visited";
        };
        
        // Set date/time contraint
        var incD = this.DATINC.slice(2, this.DATINC.search("M")-1);
        var incM = this.DATINC.slice(this.DATINC.search("M")+2, this.DATINC.search("Y")-1);
        var incY = this.DATINC.slice(this.DATINC.search("Y")+2);   
        var incDate6m = new Date(incY, incM-1 + 6, incD);
        console.log("inc + 6m", incDate6m);
        console.log("today", today);

        if (incDate6m <= today) {
        ul2.append($("<li />").append($("<button />").attr('id',this.rowId).attr('class', visited + ' btn ' + this.type).text(this.NUMEST)));
        }
        
        var btn = ul2.find('#' + this.rowId);
        btn.on("click", function() {
            openForm(that);
        })
    });

    // Third follow-up
    $.each(FU3, function() {
        console.log(this);
        var that = this;      
        
        // Check if visited today
        var visited = '';
        if (this.DATSEGUI1 == todayAdate | this.DATSEGUI2 == todayAdate | this.DATSEGUI3 == todayAdate) {
            visited = "visited";
        };
        
        // Set date/time contraint
        var incD = this.DATINC.slice(2, this.DATINC.search("M")-1);
        var incM = this.DATINC.slice(this.DATINC.search("M")+2, this.DATINC.search("Y")-1);
        var incY = this.DATINC.slice(this.DATINC.search("Y")+2);   
        var incDate12m = new Date(incY, incM-1 + 12, incD);
        console.log("inc + 12m", incDate12m);
        console.log("today", today);

        if (incDate12m <= today) {
        ul3.append($("<li />").append($("<button />").attr('id',this.rowId).attr('class', visited + ' btn ' + this.type).text(this.NUMEST)));
        }
        
        var btn = ul3.find('#' + this.rowId);
        btn.on("click", function() {
            openForm(that);
        })
    });
}

function openForm(child) {
    console.log("Preparing form for ", child);
    var rowId = child.FUrowId;
    var tableId = 'MADTRIAL_FU_PHONE';
    var formId = 'MADTRIAL_FU_PHONE';
    
    if (child.FOLLOWUP != 0) {
        // next try if we haven't called 3 times yet and we don't have answers to VITALCRI and HOSPI
        if ((child.VITALCRI == null | child.HOSPI == null) & child.DATSEGUI3 == null) {
            console.log("Opening next try FU:", rowId);
            odkTables.editRowWithSurvey(
                null,
                tableId,
                rowId,
                formId,
                null,);
        } else {
            // Next FU-call
            var defaults = getDefaults(child);
            defaults['FOLLOWUP'] = child.FOLLOWUP + 1;
            console.log("Opening first try next FU:", defaults);
            odkTables.addRowWithSurvey(
                null,
                tableId,
                formId,
                null,
                defaults);
        }
    } else {
        // First FU-call
        var defaults = getDefaults(child);
        defaults['FOLLOWUP'] = 1;
        console.log("Opening first try FU:", defaults);
        odkTables.addRowWithSurvey(
            null,
            tableId,
            formId,
            null,
            defaults);
    }
}

function getDefaults(child) {
    var defaults = {};
    defaults['DATINC'] = child.DATINC;
    defaults['DOB'] = child.DOB;
    defaults['FOLLOWUP'] = child.FOLLOWUP;
    defaults['IDADEANO'] = child.IDADEANO;
    defaults['IDADEMES'] = child.IDADEMES;
    defaults['IDINC'] = "uuid:" + child.rowId;
    defaults['NOMECRI'] = child.NOMECRI;
    defaults['NOMERESP'] = child.NOMERESP;
    defaults['NUMEST'] = child.NUMEST;
    defaults['SEX'] = child.SEX;
    defaults['TELEMOVEL1'] = child.TELEMOVEL1;
    defaults['TELEMOVEL2'] = child.TELEMOVEL2;
    defaults['TELEMOVEL3'] = child.TELEMOVEL3;
    
    // status on phone numbers - 4: incorrect number
    if (child.CHAMADA11 == 4 | child.CHAMADA12 == 4 | child.CHAMADA13 == 4) {
        defaults['chamada1'] = 4
    }
    if (child.CHAMADA21 == 4 | child.CHAMADA22 == 4 | child.CHAMADA23 == 4) {
        defaults['chamada2'] = 4
    }
    if (child.CHAMADA31 == 4 | child.CHAMADA32 == 4 | child.CHAMADA33 == 4) {
        defaults['chamada3'] = 4
    }
    return defaults;
}

function titleCase(str) {
    if (!str) return str;
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }