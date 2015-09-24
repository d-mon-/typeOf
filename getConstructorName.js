/**
 * Created by GUERIN Olivier, on 14/09/2015.
 * Twitter: @MisterRaton
 */
module.exports = function (value) {
    var cons = value.constructor;
    if (cons.name !== undefined) {
        return cons.name || '#Anonymous';
    } else {
        var cons_str = cons.toString();
        var index = cons_str.indexOf('(', 9);
        return (index === 9) ? '#Anonymous' : cons_str.slice(9, index);
    }
};