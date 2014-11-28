window.addEventListener('load', function (){	
	console.log("hehrehrhe");	
	var keys = []
	var currTabIndex = 0; 

	window.addEventListener("keydown", function(e){
		keys[e.keyCode] = true;
		if (keys[17] && keys[16] && keys[83]){
			var focused = find_focused();
			if (focused && focused.text){
				tts(focused.text);
			}
			keys.length = 0;
		}

	});

	window.addEventListener("keyup", function(e){
		keys.length = 0;
	});

	function num_of_true(keys){
		var count = 0;
		for (var i=0; i<keys.length; i++){
			if (keys[i] == true){
				count = count + 1;
			}
		}
		return count;
	}


	function find_focused(){
		var focused = document.activeElement;
		if (!focused || focused == document.body)
    		return null;
		else if (document.querySelector)
    		return document.querySelector(":focus");
    	return null;
	}

	function tts(toSpeak) {
		var utterance = new SpeechSynthesisUtterance(toSpeak);
		utterance.lang = 'en-US';
		utterance.volume = 1;
		utterance.rate = 1;
		utterance.pitch = 1;
		window.speechSynthesis.speak(utterance);
	}

	function scan(){

	}

});

//});