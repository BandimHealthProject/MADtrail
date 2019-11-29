define(['opendatakit','database','jquery','underscore','moment'],
function(opendatakit,  database,  $,       _, moment) {
return {
    echo: function(str) {
        console.log("****** ECHO CALLED ******");
        alert(str);
    },
    decimalPlaces: function(num) {
        // function for counting decimals
        // https://stackoverflow.com/questions/10454518/javascript-how-to-retrieve-the-number-of-decimals-of-a-string-number
        var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        if (!match) { return 0; }
        return Math.max(
            0,
            // Number of digits right of decimal point.
            (match[1] ? match[1].length : 0)
            // Adjust for scientific notation.
            - (match[2] ? +match[2] : 0));
    },
    studyNumber: function(letters,zeros,num) {
        var number = num + ""
        while (number.length < zeros) {
            number = "0" + number
        };
        return letters + number;
    }
}
});