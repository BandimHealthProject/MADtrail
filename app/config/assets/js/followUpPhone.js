/**
 * Responsible for rendering children to phone follow-up
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var children;
// note that persons are the MIFs
function display() {
    console.log("Persons list loading");
    
    // Set the background to be a picture.
    var body = $('body').first();
    body.css('background', 'url(img/form_logo.png) fixed');
    loadChildren();
}

function setAdate() {
    var today = new Date();
    var d = today.getDate();
    var m = today.getMonth()+1;
    var y = today.getFullYear();
    var date = "D:" + d + ",M:" + m + ",Y:" + y;
    return date;
}

function loadChildren() {
    // SQL to get children
    
    var todayAdate = setAdate();
    var varNames = "i.NUMEST, i._id, i.DATINC, i.DOB, i.IDADEANO, i.IDADEMES, i.INC, i.NOMECRI, i.NOMERESP, i.SEX, i.TELEMOVEL1, i.TELEMOVEL2, i.TELEMOVEL3, CHAMADA11, CHAMADA12, CHAMADA13, CHAMADA21, CHAMADA22, CHAMADA23, CHAMADA31, CHAMADA32, CHAMADA33, FU, HOSPI. VITALCRI "
    var sql = "SELECT " + varNames + 
        " FROMMADTRIAL_INC AS i " +
        " LEFT JOIN MADTRIAL_FU_PHONE ON i.NUMEST = MADTRIAL_FU_PHONE.NUMEST " +
        " ORDER BY i.NUMEST ASC";
    children = [];
    console.log("Querying database for included children...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " children");
        for (var row = 0; row < result.getCount(); row++) {
            var NUMEST = result.getData(row,"NUMEST");
            var rowId = result.getData(row,"_id").slice(5);
            
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
            var FU = result.getData(row,"FU"); // variabel for followup
            var HOSPI = result.getData(row,"HOSPI");
            var VITALCRI = result.getData(row,"VITALCRI");

            var p = { type: 'child', NUMEST, rowId, DATINC, DOB, IDADEANO, IDADEMES, INC, NOMECRI, NOMERESP, SEX, TELEMOVEL1, TELEMOVEL2, TELEMOVEL3, CHAMADA11, CHAMADA12, CHAMADA13, CHAMADA21, CHAMADA22, CHAMADA23, CHAMADA31, CHAMADA32, CHAMADA33, FU, HOSPI, VITALCRI };
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

    var ul = $('#persons');
    $.each(children, function() {
        console.log(this);
        var that = this;      
        
        ul.append($("<li />").append($("<button />").attr('id',this.rowId).attr('class','' + ' btn ' + this.type).text(this.NUMEST)));
                
        var btn = ul.find('#' + this.rowId);
        btn.on("click", function() {
            openForm(that.rowId, that);
        })
    });
}

function openForm(rowId, child) {
    console.log("Preparing form for ", child);
    var rowId = "uuid:" + rowId;
    var tableId = 'MADTRIAL_FU_PHONE';
    var formId = 'MADTRIAL_FU_PHONE';
    var defaults = getDefaults(child);

    console.log("Opening form with:", defaults);
    odkTables.addRowWithSurvey(
        null,
        tableId,
        formId,
        null,
        defaults);
}

function getDefaults(child) {
    var defaults = {};
    defaults['DATINC'] = child.DATINC;
    defaults['DOB'] = child.DOB;
    defaults['NOMECRI'] = child.NOMECRI;
    defaults['NOMERESP'] = child.NOMERESP;
    defaults['NUMEST'] = child.NUMEST;
    defaults['SEX'] = child.SEX;
    defaults['TELEMOVEL1'] = child.TELEMOVEL1;
    defaults['TELEMOVEL2'] = child.TELEMOVEL2;
    defaults['TELEMOVEL3'] = child.TELEMOVEL3;
    return defaults;
}

function titleCase(str) {
    if (!str) return str;
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }