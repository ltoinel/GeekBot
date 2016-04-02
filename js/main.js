var recognition;
var convo_id;


/**
 * When the document is ready, we start the voice recognition
 */
$(document).ready(function(){
	
    convo_id = generateUUID();
    
	// Start recognition
	recognition = new webkitSpeechRecognition();
	recognition.continuous = true;
	recognition.interimResults = true;
	recognition.lang = "fr-FR";
	recognition.onend = onRecongnitionEnd;
	recognition.onresult = onRecognitionResult;
	
	// Start the recognition when the document is ready
	chat("Bonjour !");
});


var final_transcript;
	
// When recognition is stopped we can talk
function onRecongnitionEnd (event){
		chat(final_transcript);
}
	
// On recognition result
function onRecognitionResult (event) {
	final_transcript = '';
	interim_transcript = '';
    var isFinal = false;
    
	for (var i = event.resultIndex; i < event.results.length; ++i) {
	  if (event.results[i].isFinal) {
			final_transcript += event.results[i][0].transcript;
			document.querySelector('#text').value = final_transcript;  
            isFinal = true;
		
      } else {
			interim_transcript += event.results[i][0].transcript;
			document.querySelector('#text').value = interim_transcript;  
      }
	}

    if (isFinal){
        // We stop to avoid the bot to respond to him self
        recognition.stop();
    }
};

	
/**
 * Send the text to the chatbot and read the response
 */
function chat(text){
	
    logChat("Moi",text);
		
	$.get("http://labs.geeek.org/chatbot/chatbot/conversation_start.php?convo_id="+convo_id+"&say="+text, function(json, status){
			console.log(json);
			data = JSON.parse(json);
			var botsay = data.botsay.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
			console.log(botsay);
			chrome.tts.speak( botsay, {'lang': 'fr-FR', 'rate': 1.5,  requiredEventTypes: ['end'],
			onEvent: function(event) {
				if(event.type === 'end') {
					recognition.start();
				}
			}});
            logChat("GeekBot",botsay);
    });

}

function logChat(who,text){
        var style;
    
        if (who == "GeekBot"){
            style = "disabled";
        }
    
    	$( "#chatBox" ).prepend('<li class="list-group-item '+style+'">'+who+' : '+text+'</li>' );
}