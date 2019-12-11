/**
 * Responsible for rendering children to visit follow-up
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
    
    var varNames = "i.NUMEST, i._id, i.CAMO, i.CAMOONDE, i.DATINC, i.DOB, i.ID, i.IDADEANO, i.IDADEMES, i.INC, i.NOMECRI, i.NOMERESP, i.SEX, i.TABZ, DATSEGUI1, DATSEGUI2, DATSEGUI3, ESTADOCRI, FOLLOWUP, INFORMADOR, LASTFUSUC, SUCCEED1, SUCCEED2, SUCCEED3, BCG, FEBAMAREL, PCV1, PCV2, PCV3, PENTA1, PENTA2, PENTA3, POLIO1, POLIO2, POLIO3, POLIONAS, ROX1, ROX2, SARAMPO1, VACOU1, VACOU1TIPO, VACOU2, VACOU2TIPO, VACOU3, VACOU3TIPO, VACOU4, VACOU4TIPO, VACOU5, VACOU5TIPO, VPI, MADTRIAL_FU_VIS._id AS FUrowId "
    var sql = "SELECT " + varNames + 
        " FROM MADTRIAL_INC AS i " +
        " LEFT JOIN MADTRIAL_FU_VIS ON i._id = MADTRIAL_FU_VIS.IDINC " + // join on tablet generated IDs
        " WHERE i.INC = 1 AND i.TABZ IS NOT NULL " +
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
            
            var CAMO = result.getData(row,"CAMO");
            var CAMOONDE = result.getData(row,"CAMOONDE");
            var DATINC = result.getData(row,"DATINC");
            var DOB = result.getData(row,"DOB");
            var ID = result.getData(row,'ID');
            var IDADEANO = result.getData(row,"IDADEANO");
            var IDADEMES = result.getData(row,"IDADEMES");
            var INC = result.getData(row,"INC");
            var NOMECRI = titleCase(result.getData(row,"NOMECRI"));
            var NOMERESP = titleCase(result.getData(row,"NOMERESP"));
            var SEX = result.getData(row,"SEX");
            var TABZ = result.getData(row,"TABZ");
            var DATSEGUI1 = result.getData(row,"DATSEGUI1");
            var DATSEGUI2 = result.getData(row,"DATSEGUI2");
            var DATSEGUI3 = result.getData(row,"DATSEGUI3");
            var ESTADOCRI = result.getData(row,"ESTADOCRI");
            var FOLLOWUP = Number(result.getData(row,"FOLLOWUP")); // variabel for followup - made into integer
            var INFORMADOR = result.getData(row,"INFORMADOR");
            var LASTFUSUC = result.getData(row,"LASTFUSUC");
            var SUCCEED1 = result.getData(row,"SUCCEED1");
            var SUCCEED2 = result.getData(row,"SUCCEED2");
            var SUCCEED3 = result.getData(row,"SUCCEED3");

            var BCG = result.getData(row,"BCG");
            var FEBAMAREL = result.getData(row,"FEBAMAREL");
            var PCV1 = result.getData(row,"PCV1");
            var PCV2 = result.getData(row,"PCV2");
            var PCV3 = result.getData(row,"PCV3");
            var PENTA1 = result.getData(row,"PENTA1");
            var PENTA2 = result.getData(row,"PENTA2");
            var PENTA3 = result.getData(row,"PENTA3");
            var POLIO1 = result.getData(row,"POLIO1");
            var POLIO2 = result.getData(row,"POLIO2");
            var POLIO3 = result.getData(row,"POLIO3");
            var POLIONAS = result.getData(row,"POLIONAS");
            var ROX1 = result.getData(row,"ROX1");
            var ROX2 = result.getData(row,"ROX2");
            var SARAMPO1 = result.getData(row,"SARAMPO1");
            var VACOU1 = result.getData(row,"VACOU1");
            var VACOU1TIPO = result.getData(row,"VACOU1TIPO");
            var VACOU2 = result.getData(row,"VACOU2");
            var VACOU2TIPO = result.getData(row,"VACOU2TIPO");
            var VACOU3 = result.getData(row,"VACOU3");
            var VACOU3TIPO = result.getData(row,"VACOU3TIPO");
            var VACOU4 = result.getData(row,"VACOU4");
            var VACOU4TIPO = result.getData(row,"VACOU4TIPO");
            var VACOU5 = result.getData(row,"VACOU5");
            var VACOU5TIPO = result.getData(row,"VACOU5TIPO");
            var VPI = result.getData(row,"VPI");

            var p = { type: 'child', NUMEST, rowId, FUrowId, CAMO, CAMOONDE, DATINC, DOB, ID, IDADEANO, IDADEMES, INC, NOMECRI, NOMERESP, SEX, TABZ, DATSEGUI1, DATSEGUI2, DATSEGUI3, ESTADOCRI, FOLLOWUP, INFORMADOR, LASTFUSUC, SUCCEED1, SUCCEED2, SUCCEED3, BCG, FEBAMAREL, PCV1, PCV2, PCV3, PENTA1, PENTA2, PENTA3, POLIO1, POLIO2, POLIO3, POLIONAS, ROX1, ROX2, SARAMPO1, VACOU1, VACOU1TIPO, VACOU2, VACOU2TIPO, VACOU3, VACOU3TIPO, VACOU4, VACOU4TIPO, VACOU5, VACOU5TIPO, VPI };
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
    // Here we need to do the sorting into 4 lists.
    // FU1: First follow-up not completed
    // FU2: Second follow-up not completed
    // FU3: Third follow-up not completed¨
    // FU4: Fourth follow-up not completed

    var FU1 = [];
    var FU2 = [];
    var FU3 = [];
    var FU4 = [];
    children.forEach(function(child) {
        if (child.DATSEGUI1 != todayAdate & child.DATSEGUI2 != todayAdate) {
            if (child.FOLLOWUP == 0 ) {
                FU1.push(child);
            } else if (child.FOLLOWUP == 1 & (child.INFORMADOR == null | child.ESTADOCRI == null) & child.DATSEGUI2 == null) {
                FU1.push(child);
            } else if (child.FOLLOWUP == 1 & ((child.INFORMADOR != null & child.ESTADOCRI != null) | child.DATSEGUI2 != null)) {
                FU2.push(child);
            } else if (child.FOLLOWUP == 2 & (child.INFORMADOR == null | child.ESTADOCRI == null) & child.DATSEGUI3 == null) {
                FU2.push(child);
            } else if (child.FOLLOWUP == 2 & ((child.INFORMADOR != null & child.ESTADOCRI != null) | child.DATSEGUI3 != null)) {
                FU3.push(child);
            } else if (child.FOLLOWUP == 3 & (child.INFORMADOR == null | child.ESTADOCRI == null) & child.DATSEGUI3 == null) {
                FU3.push(child);
            } else if (child.FOLLOWUP == 3 & ((child.INFORMADOR != null & child.ESTADOCRI != null) | child.DATSEGUI3 != null)) {
                FU4.push(child);
            } else if (child.FOLLOWUP == 4 & (child.INFORMADOR == null | child.ESTADOCRI == null) & child.DATSEGUI3 == null) {
                FU4.push(child);
            }
        }
    });

    console.log("FU1:",FU1);
    console.log("FU2:",FU2);
    console.log("FU3:",FU3);
    console.log("FU4:",FU4);

    var ul1 = $('#fu1');
    var ul2 = $('#fu2');
    var ul3 = $('#fu3');
    var ul4 = $('#fu4');

    // First follow-up
    $.each(FU1, function() {
        console.log(this);
        var that = this;      
        
        // Set date/time contraint
        var incD = Number(this.DATINC.slice(2, this.DATINC.search("M")-1));
        var incM = this.DATINC.slice(this.DATINC.search("M")+2, this.DATINC.search("Y")-1);
        var incY = this.DATINC.slice(this.DATINC.search("Y")+2);  
        var incDate2d = new Date(incY, incM-1, incD + 2);
        console.log("inc + 2d", incDate2d);
        console.log("today", today);

        if (incDate2d <= today) {
        ul1.append($("<li />").append($("<button />").attr('id',this.rowId).attr('class','' + ' btn ' + this.type).text(this.NUMEST)));
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
        
        // Set date/time contraint
        var incD = Number(this.DATINC.slice(2, this.DATINC.search("M")-1));
        var incM = this.DATINC.slice(this.DATINC.search("M")+2, this.DATINC.search("Y")-1);
        var incY = this.DATINC.slice(this.DATINC.search("Y")+2);   
        var incDate4d = new Date(incY, incM-1, incD + 4);
        console.log("inc + 2d", incDate4d);
        console.log("today", today);

        if (incDate4d <= today) {
        ul2.append($("<li />").append($("<button />").attr('id',this.rowId).attr('class','' + ' btn ' + this.type).text(this.NUMEST)));
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
        
        // Set date/time contraint
        var incD = Number(this.DATINC.slice(2, this.DATINC.search("M")-1));
        var incM = this.DATINC.slice(this.DATINC.search("M")+2, this.DATINC.search("Y")-1);
        var incY = this.DATINC.slice(this.DATINC.search("Y")+2);   
        var incDate7d = new Date(incY, incM-1, incD + 7);
        console.log("inc + 7d", incDate7d);
        console.log("today", today);

        if (incDate7d <= today) {
        ul3.append($("<li />").append($("<button />").attr('id',this.rowId).attr('class','' + ' btn ' + this.type).text(this.NUMEST)));
        }
        
        var btn = ul3.find('#' + this.rowId);
        btn.on("click", function() {
            openForm(that);
        })
    });

    // Fourth follow-up
    $.each(FU4, function() {
        console.log(this);
        var that = this;      
        
        // Set date/time contraint
        var incD = Number(this.DATINC.slice(2, this.DATINC.search("M")-1));
        var incM = this.DATINC.slice(this.DATINC.search("M")+2, this.DATINC.search("Y")-1);
        var incY = this.DATINC.slice(this.DATINC.search("Y")+2);   
        var incDate14d = new Date(incY, incM-1, incD + 14);
        console.log("inc + 14d", incDate14d);
        console.log("today", today);

        if (incDate14d <= today) {
        ul4.append($("<li />").append($("<button />").attr('id',this.rowId).attr('class','' + ' btn ' + this.type).text(this.NUMEST)));
        }
        
        var btn = ul4.find('#' + this.rowId);
        btn.on("click", function() {
            openForm(that);
        })
    });
}

function openForm(child) {
    console.log("Preparing form for ", child);
    var rowId = child.FUrowId;
    var tableId = 'MADTRIAL_FU_VIS';
    var formId = 'MADTRIAL_FU_VIS';
    
    if (child.FOLLOWUP > 1) {
        // next try if we haven't tried a third time yet and we don't have answers to INFORMADOR and ESTADOCRI
        if ((child.INFORMADOR == null | child.ESTADOCRI == null) & child.DATSEGUI3 == null) {
            console.log("Opening next try FU:", rowId);
            odkTables.editRowWithSurvey(
                null,
                tableId,
                rowId,
                formId,
                null,);
        } else {
            // Next FU visit
            var defaults = getDefaults(child);
            defaults['LASTFUSUC'] = setLastSucces(child);
            defaults['FOLLOWUP'] = child.FOLLOWUP + 1;
            console.log("Opening first try next FU:", defaults);
            odkTables.addRowWithSurvey(
                null,
                tableId,
                formId,
                null,
                defaults);
        }
    } else if (child.FOLLOWUP == 1) {
        // next try if we haven't tried a third time yet and we don't have answers to INFORMADOR and ESTADOCRI
        if ((child.INFORMADOR == null | child.ESTADOCRI == null) & child.DATSEGUI2 == null) {
            console.log("Opening next try FU:", rowId);
            odkTables.editRowWithSurvey(
                null,
                tableId,
                rowId,
                formId,
                null,);
        } else {
            // Next FU visit
            var defaults = getDefaults(child);
            defaults['LASTFUSUC'] = setLastSucces(child);
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
        defaults['LASTFUSUC'] = setLastSucces(child);
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

function setLastSucces(child) {
    // set lastdate we completed af follow-up visit
    var lastDate = [];
    if (child.FOLLOWUP > 0) {
        if (child.SUCCEED3 == 1) {
            lastDate = child.DATSEGUI3;
        } else if (child.SUCCEED2 == 1) {
            lastDate = child.DATSEGUI2;
        } else if (child.SUCCEED1 == 1) {
            lastDate = child.DATSEGUI1;
        } else {
            lastDate = child.LASTFUSUC;
        }
    } else {
        lastDate = child.DATINC;
    }
    return lastDate;
}

function getDefaults(child) {
    var defaults = {};
    defaults['CAMO'] = child.CAMO;
    defaults['CAMOONDE'] = child.CAMOONDE;
    defaults['DATINC'] = child.DATINC;
    defaults['DOB'] = child.DOB;
    defaults['FOLLOWUP'] = child.FOLLOWUP;
    defaults['ID'] = child.ID;
    defaults['IDADEANO'] = child.IDADEANO;
    defaults['IDADEMES'] = child.IDADEMES;
    defaults['IDINC'] = "uuid:" + child.rowId;
    defaults['NOMECRI'] = child.NOMECRI;
    defaults['NOMERESP'] = child.NOMERESP;
    defaults['NUMEST'] = child.NUMEST;
    defaults['SEX'] = child.SEX;
    defaults['TABZ'] = child.TABZ;
    
    defaults['BCG'] = child.BCG;
    defaults['FEBAMAREL'] = child.FEBAMAREL;
    defaults['PCV1'] = child.PCV1;
    defaults['PCV2'] = child.PCV2;
    defaults['PCV3'] = child.PCV3;
    defaults['PENTA1'] = child.PENTA1;
    defaults['PENTA2'] = child.PENTA2;
    defaults['PENTA3'] = child.PENTA3;
    defaults['POLIO1'] = child.POLIO1;
    defaults['POLIO2'] = child.POLIO2;
    defaults['POLIO3'] = child.POLIO3;
    defaults['POLIONAS'] = child.POLIONAS;
    defaults['ROX1'] = child.ROX1;
    defaults['ROX2'] = child.ROX2;
    defaults['SARAMPO1'] = child.SARAMPO1;
    defaults['VACOU1'] = child.VACOU1;
    defaults['VACOU1TIPO'] = child.VACOU2TIPO;
    defaults['VACOU2'] = child.VACOU2;
    defaults['VACOU2TIPO'] = child.VACOU2TIPO;
    defaults['VACOU3'] = child.VACOU3;
    defaults['VACOU3TIPO'] = child.VACOU3TIPO;
    defaults['VACOU4'] = child.VACOU4;
    defaults['VACOU4TIPO'] = child.VACOU4TIPO;
    defaults['VACOU5'] = child.VACOU5;
    defaults['VACOU5TIPO'] = child.VACOU5TIPO;
    defaults['VPI'] = child.VPI;
    
    return defaults;
}

function titleCase(str) {
    if (!str) return str;
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }