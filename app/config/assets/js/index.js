/**
 * Responsible for rendering the select region/sector/tabanca screen.
 */
'use strict';
/* global odkTables, util, odkCommon, odkData */

function display() {    
    doSanityCheck();
    initButtons();
}

function doSanityCheck() {
    console.log("Checking things");
    console.log(odkData);
}

function initButtons() {
    // New inclusion
    var btnCrianca = $('#btnCrianca');
    btnCrianca.on("click", function() {
        odkTables.addRowWithSurvey(
            null,
            'MADTRIAL_INC',
            'MADTRIAL_INC',
            null,
            null);
    });
    // Follow-up
    var btnFU = $('#btnFU');
    btnFU.on("click", function() {
        odkTables.launchHTML(null, 'config/assets/followUp.html');
    });
    // Edit ID or TABZ
    var btnEdit = $('#btnEdit');
    btnEdit.on("click", function() {
        odkTables.launchHTML(null, 'config/assets/IDTabz.html');
    });
    // Sync
    var btnSync = $('#btnSync');
    btnSync.on("click", function() {
        odkCommon.doAction(null, "org.opendatakit.services.sync.actions.activities.SyncActivity", {"componentPackage": "org.opendatakit.services", "componentActivity": "org.opendatakit.services.sync.actions.activities.SyncActivity"});   
    });
}