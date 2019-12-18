/**
 * Responsible for rendering children included this day for changing ID or Tabz
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var children, selDay, selMon, selYea;
function display() {
    console.log("Persons list loading");
    selDay = $('#selDateDay');
    selMon = $('#selDateMonth');
    selYea = $('#selDateYear');
    
    // Set the background to be a picture.
    //var body = $('body').first();
    //body.css('background', 'url(img/form_logo.png) fixed');
    initDrops();
    loadChildren();
}

function initDrops() {
    // Date dropdown
    // Set default date
    var today = new Date();
    var defaultDay = today.getDate();
    var defaultMon = today.getMonth()+1;
    var defaultYea = today.getFullYear();

    // List of date, months, years
    var days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    var months = [1,2,3,4,5,6,7,8,9,10,11,12];
    var years = [defaultYea-1, defaultYea, defaultYea+1];

    $.each(days, function() {
        if (this == defaultDay) {
            selDay.append($("<option />").val(this).text(this).attr("selected",true));
        } else {
            selDay.append($("<option />").val(this).text(this));
        }
    })

    $.each(months, function() {
        if (this == defaultMon) {
            selMon.append($("<option />").val(this).text(this).attr("selected",true));
        } else {
            selMon.append($("<option />").val(this).text(this));
        }
    })

    $.each(years, function() {
        if (this == defaultYea) {
            selYea.append($("<option />").val(this).text(this).attr("selected",true));
        } else {
            selYea.append($("<option />").val(this).text(this));
        }
    })
    selDay.change(function() {
        loadChildren();
    })
    selMon.change(function() {
        loadChildren();
    })
    selYea.change(function() {
        loadChildren();
    })

}

function loadChildren() {
    // SQL to get children
    
    var todayAdate = "D:" + selDay.val() + ",M:" + selMon.val() + ",Y:" + selYea.val();  ;
    var varNames = "_id, CAMO, CAMOONDE, DATINC, ID, NOMECRI, TABZ, REGNO"
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
            
            var CAMO = result.getData(row,"CAMO");
            var CAMOONDE = result.getData(row,"CAMOONDE");
            var DATINC = result.getData(row,"DATINC");
            var ID = result.getData(row,"ID");
            var NOMECRI = titleCase(result.getData(row,"NOMECRI"));
            var TABZ = result.getData(row,"TABZ");
            var REGNO = result.getData(row,"REGNO");

            var p = { type: 'child', rowId, CAMO, CAMOONDE, DATINC, ID, NOMECRI, TABZ, REGNO };
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
    ul.empty();
    $.each(children, function() {
        console.log(this);
        var that = this;      
        
        // Set display text
        var camo;
        if (this.CAMO == 9999) {
            camo = this.CAMOONDE;
        } else {
            camo = this.CAMO;
        }
        
        var tabz;
        if (this.TABZ > 100) {
            tabz = "<b>Não sabe</b>";
        } else {
            tabz = this.TABZ;
        }

        var id;
        if (this.ID == 9999999) {
            id = "<b>Não sabe</b>"
        } else {
            id = this.ID
        }
        var displayText = "TABZ: " + tabz + "; CAMO: " + camo + "<br />" + 
            "ID: " + id + "<br />" +
            "Nome: " + this.NOMECRI + "<br />" + 
            "Regno: " + this.REGNO;
       
        // list
        ul.append($("<li />").append($("<button />").attr('id',this.rowId).attr('class','' + ' btn ' + this.type).append(displayText)));
                
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