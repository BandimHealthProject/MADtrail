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
    var varNames = "_id, DATINC, DOB, IDADEANO, IDADEMES, NOMECRI, NOMEMAE, SEX"
    var sql = "SELECT " + varNames + 
        " FROM MADTRIAL_INC " +
        " WHERE DATINC = '" + todayAdate + "'" +
        " ORDER BY _savepoint_timestamp ASC";
    children = [];
    console.log("Querying database for included children...");
    console.log(sql);
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " children");
        for (var row = 0; row < result.getCount(); row++) {
            var rowId = result.getData(row,"_id").slice(5);
            
            var DOB = result.getData(row,"DOB");
            var IDADEANO = result.getData(row,"IDADEANO");
            var IDADEMES = result.getData(row,"IDADEMES");
            var NOMECRI = titleCase(result.getData(row,"NOMECRI"));
            var NOMEMAE = titleCase(result.getData(row,"NOMEMAE"));
            var SEX = result.getData(row,"SEX");

            var p = { type: 'child', rowId, DOB, IDADEANO, IDADEMES, NOMECRI, NOMEMAE, SEX };
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
        var idade;
        if (this.DOB == "D:NS,M:NS,Y:NS") {
            idade = "Idade: " + Number(this.IDADEANO) + " ano(s), " + Number(this.IDADEMES) + " mes(es)";
        } else {
            var d = this.DOB.slice(2, this.DOB.search("M")-1);
            var m = this.DOB.slice(this.DOB.search("M")+2, this.DOB.search("Y")-1);
            var y = this.DOB.slice(this.DOB.search("Y")+2);   
            idade = "Nascimento: " + d + "/" + m + "/" + y;
        }
    
        var displayText = "Nome: " + this.NOMECRI + "<br />" + 
            idade + "<br />" + 
            "Mãe: " + this.NOMEMAE;
       
        // list
        ul.append($("<li />").append($("<button />").attr('id',this.rowId).attr('class', '' + ' btn ' + this.type + this.SEX).append(displayText)));
                
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