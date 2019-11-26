/**
 * Responsible for rendering the select region/sector/tabanca screen.
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

function display() {    
    doSanityCheck();
    initButtons();
    // Set the background to be a picture.
    $('body').first().css('background', 'url(img/form_logo.png) fixed');
}

function doSanityCheck() {
    console.log("Checking things");
    console.log(odkData);
}

function initButtons() {
    btnCrianca = $('#btnCrianca');
    btnCrianca.on("click", function() {
        odkTables.addRowWithSurvey(
            null,
            'MADTRIAL',
            'MADTRIAL',
            null,
            defaults);
    })

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
}