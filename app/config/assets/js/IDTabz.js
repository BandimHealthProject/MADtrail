/**
 * Responsible for rendering children included this day for changing ID or Tabz
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
    var varNames = "_id, NOMECRI, DATINC, ID, TABZ"
    var sql = "SELECT " + varNames + 
        " FROM MADTRIAL_INC " +
        " WHERE DATINC = '" + todayAdate + "' AND INC = 1 " +
        " ORDER BY NOMECRI ASC";
    children = [];
    console.log("Querying database for included children...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " children");
        for (var row = 0; row < result.getCount(); row++) {
            var rowId = result.getData(row,"_id").slice(5);
            var NOMECRI = result.getData(row,"NOMECRI"); // Despite obviously bad naming, this is actually the Person ID
            var DATINC = titleCase(result.getData(row,"DATINC"));
            var ID = result.getData(row,"ID");
            var TABZ = result.getData(row,"TABZ");

            var p = { type: 'child', rowId, NOMECRI, DATINC, ID, TABZ };
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
        
        ul.append($("<li />").append($("<button />").attr('id',this.rowId).attr('class','' + ' btn ' + this.type).text(this.NOMECRI)));
                
        var btn = ul.find('#' + this.rowId);
        btn.on("click", function() {
            openForm(that.rowId, that);
        })
    });
}


function openForm(rowId, child) {
    console.log("Preparing form for ", child);
    var rowId = "uuid:" + rowId;

    console.log("Opening form with:", rowId);
    odkTables.editRowWithSurvey(
            null,
            "MADTRIAL_INC",
            rowId,
            "MADTRIAL_INC",
            null,);
}

function titleCase(str) {
    if (!str) return str;
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }