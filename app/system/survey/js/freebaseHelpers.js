define(['opendatakit','database','jquery','underscore','moment'],
function(opendatakit,  database,  $,       _, moment) {
return {
    echo: function(str) {
        console.log("****** ECHO CALLED ******");
        alert(str);
    }
}
});