var https = require('https');

exports.handler = function( event, context ) {
    var say = "";
    var shouldEndSession = false;
    var sessionAttributes = {};
    var myState = "";
    var pop = 0;
    var rank = 0;

    if (event.session.attributes) {
        sessionAttributes = event.session.attributes;
    }
        var IntentName = event.request.intent.name;

        if (IntentName === "Ask") {

            if (event.request.intent.slots.date.value) {

                var dob = event.request.intent.slots.date.value;
                var post_data = {"date": dob};
                var post_options = "https://calculatemyage.000webhostapp.com/api/calculatemyage.php?date="+dob;
				
                    var post_req = https.request(post_options, function(res) {
                        res.setEncoding('utf8');
                        var returnData = "";
                        res.on('data', function (chunk) {
                            returnData += chunk;
                        });
                        res.on('end', function () {
                           
                            pop = JSON.parse(returnData).age;

                            say = "Your Are " + pop+" "+"Year Old";
							
							if (!sessionAttributes.requestList) {
                                sessionAttributes.requestList = [];
                            }
                            sessionAttributes.requestList.push(myState);

                            context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });

                        });
                      });
                post_req.write(JSON.stringify(post_data));
                post_req.end();

            }

        } else if (IntentName === "AMAZON.StopIntent" || IntentName === "AMAZON.CancelIntent") {
            say = "You asked for " + sessionAttributes.requestList.toString() + ". Thanks for using!";
            shouldEndSession = true;
            context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });


        } else if (IntentName === "AMAZON.HelpIntent" ) {
            say = "Just say your date of birth.   Like 12 novermber 1995   or   November 12 1995";
            context.succeed({sessionAttributes: sessionAttributes, response: buildSpeechletResponse(say, shouldEndSession) });

        }
    
};

function buildSpeechletResponse(say, shouldEndSession) {
    return {
        outputSpeech: {
            type: "SSML",
            ssml: "<speak>" + say + "</speak>"
        },
        reprompt: {
            outputSpeech: {
                type: "SSML",
                ssml: "<speak>Please try again. " + say + "</speak>"
            }
        },
        card: {
            type: "Simple",
            title: "Age calculator Skill",
            content: "My Card Content"+say
        },
        shouldEndSession: shouldEndSession
    };
}