/**
 * Created by Си on 2015/10/11.
 */

exports.restparser = function() {
    return new RestParser();
};

function RestParser(){}

RestParser.prototype.parser = function(input){
    if(null == input || '' == input) {
        return {

        };
    }

};
