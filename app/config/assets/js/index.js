/**
 * Responsible for rendering the select region/sector/tabanca screen.
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

var selReg, selTab, selAss, selDay, selMon, selYea, btnControl, btnRoutine, regions;
var t = []; // This will hold the tabancas read from database

function display() {    
    selReg = $('#selRegion');
    selTab = $('#selTabanca');
    selAss = $('#selAssistant');
    selDay = $('#selDateDay');
    selMon = $('#selDateMonth');
    selYea = $('#selDateYear');
    doSanityCheck();
    loadTabancas();
    initButtons();
    // Set the background to be a picture.
    // var body = $('#main');
    // body.css('background-image', 'url(img/bafata.jpg)');
    $('body').first().css('background', 'url(img/bafata.jpg) fixed');
    
    console.log("We got:" + ass + ", " + tab + ", " + reg + ", " + day + ", " + mon + ", " + yea);
    var ass = window.localStorage.getItem('ass');
    if (ass) selAss.val(ass);
    var tab = window.localStorage.getItem('tab');
    if (tab) selTab.val(tab);
    var reg = window.localStorage.getItem('reg');
    if (reg) selReg.val(reg);
    var day = window.localStorage.getItem('day');
    if (day) selDay.val(day);
    var mon = window.localStorage.getItem('mon');
    if (mon) selMon.val(mon);
    var yea = window.localStorage.getItem('yea');
    if (yea) selYea.val(yea);
}

function loadTabancas() {
    console.log("Querying database...");
    var successFn = function( result ) {
        console.log("Found " + result.getCount() + " tabancas");
        for (var row = 0; row < result.getCount(); row++) {
            //var id = result.getData(row,"_id"); // or _row_etag
            var REG = result.getData(row,"REG");
            var REGNOME =  result.getData(row,"REGNOME");
            var TAB =  result.getData(row,"TAB");
            var TABNOME =  result.getData(row,"TABNOME");            
            t.push({regId: REG, regName: REGNOME, tabId: TAB, tabName: TAB + ' - ' + TABNOME});
        }
        var regNames = [ ...new Set(t.map(x=>x.regName)) ];
        var regIds = [ ...new Set(t.map(x=>x.regId)) ];
        regions = []
        if (regNames.length != regIds.length) {
            alert('Unable to load regions (duplicate region id with different region name?)');
            return;
        }
        for (var i=0;i<regNames.length;i++) {
            regions.push({REG: regIds[i], REGNOME: regNames[i]});
        }
        initDrops();
        return;
    }

    var failureFn = function( errorMsg ) {
        console.error('Failed to get tabancas from database: ' + errorMsg);
        alert('Failed to get tabancas from database: ' + errorMsg);
    }

    var sql = 'SELECT DISTINCT REG, REGNOME, TAB, TABNOME FROM MORLIST ORDER BY REGNOME, TAB';
    odkData.arbitraryQuery('MORLIST', sql, null, null, null, successFn, failureFn);
}

function doSanityCheck() {
    console.log("Checking things");
    console.log(odkData);
}

function initButtons() {
    btnRoutine = $('#btnRoutine');
    btnRoutine.on("click", function() {
        var date = "D:" + selDay.val() + ",M:" + selMon.val() + ",Y:" + selYea.val();
        var assistant = selAss.val();
        if (!assistant || assistant < 0) {
            selAss.css('background-color','pink');
            return false;
        }
        var region = selReg.val();
        var tabanca = selTab.val();    
        var visitType = "routine";
        var queryParams = util.setQuerystringParams(region, tabanca, assistant, visitType, date);
        if (util.DEBUG) top.location = 'listClusters.html' + queryParams;
        odkTables.launchHTML(null,  'config/assets/listClusters.html' + queryParams);
        console.log(queryParams)
    });

    btnControl = $('#btnControl');
    btnControl.on("click", function() {
        var date = "D:" + selDay.val() + ",M:" + selMon.val() + ",Y:" + selYea.val();  
        var assistant = selAss.val();
        if (!assistant || assistant < 0) {
            selAss.css('background-color','pink');
            return false;
        }
        var region = selReg.val();
        var tabanca = selTab.val();  
        var visitType = "control";
        var queryParams = util.setQuerystringParams(region, tabanca, assistant, visitType, date);
        if (util.DEBUG) top.location = 'listClusters.html' + queryParams;
        odkTables.launchHTML(null,  'config/assets/listClusters.html' + queryParams);
    });
    btnRoutine.attr("disabled","disabled");
    btnControl.attr("disabled","disabled");

    // var btnControl = document.createElement("button");
    // btnControl.setAttribute("id", "btnControl");
    // btnControl.innerHTML = "Rutina";

    // btnControl.onclick = function() {
    //     odkTables.launchHTML(null,  'config/assets/controlVisit.html');
    // }
    // document.getElementById("wrapper").appendChild(btnControl);

}

function initDrops() {
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

    selAss.append($("<option />").val(-1).text(""));
    $.each(assistants, function() {
        selAss.append($("<option />").val(this.no).text(this.name));
    })

    selReg.append($("<option />").val(-1).text(""));
    $.each(regions, function() {
        selReg.append($("<option />").val(this.REG).text(this.REGNOME));
    });

    selTab[0].options.length = 0;
    selTab.append($("<option />").val(-1).text(""));
    selTab.add(getOption("Tabanca",0));
    selTab.attr('disabled', 'disabled');
    
    selReg.on("change", function() {
        populateTabancas(selReg.val());
        console.log("Setting reg..");
        window.localStorage.setItem('reg', selReg.val());
    });

    selTab.on("change", function() {
        // console.log("Go ahead with " + selReg.val());
        window.localStorage.setItem('tab', selTab.val());
        window.localStorage.setItem('ass', selAss.val());
        btnRoutine.removeAttr("disabled");
        btnControl.removeAttr("disabled");
    });
}

function populateTabancas(reg) {
    selTab[0].options.length = 0;
    selTab.append($("<option />").val(-1).text(""));
    var tabs = t.filter(x => x.regId == reg);
    $.each(tabs, function() {
        selTab.append($("<option />").val(this.tabId).text(this.tabName));
    });
    
    selTab.removeAttr("disabled");
    
    btnRoutine.attr("disabled","disabled");
    btnControl.attr("disabled","disabled");
    
}

function getOption(name,valle) {
    var option = document.createElement("option");
    option.text = name;
    option.value = valle;
    return option;
}

// Get assistants from CSV
var assistants = [];
$.ajax({
    url: 'assistants.csv',
    dataType: 'text',
  }).done(getAssistants);

  function getAssistants(data) {
    var allRows = data.split(/\r?\n|\r/);
    for (var row = 1; row < allRows.length; row++) {  // start at row = 1 to skip header
        var rowValues = allRows[row].split(",");
        var p = {no: rowValues[0], name: rowValues[1]};
        assistants.push(p);
    }
    console.log('Rows in CSV', allRows);
    console.log('Assistants', assistants);
  }