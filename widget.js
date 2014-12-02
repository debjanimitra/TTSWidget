window.addEventListener('load', function (){	
	var keys = [];
	var intervalID = null; //set to some value only if scanner running
	var speech_rate = 1;
	var silence_duration = 5000;

	window.addEventListener("keydown", function(e){
		keys[e.keyCode] = true;
		if (num_of_true(keys)==3 && keys[17] && keys[16] && keys[83]){
			keys.length = 0;
			if (intervalID){
				clearInterval(intervalID); //if already scanning, stop and restart
			}
			var l = document.getElementsByTagName('a'), elementArray = [];
			for(var i=0; i<l.length; i++) {
  				elementArray.push(l[i]);
			}
			scan(elementArray);
		}

		if (num_of_true(keys)==1 && keys[27]){
			keys.length = 0;
			if (intervalID){
				clearInterval(intervalID);
			}
		}

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

	function scan(elementArray){
		var count = 0;
		intervalID = setInterval(function () {
			if (count < elementArray.length){
				elementArray[count].focus();
				elementArray[count].scrollIntoView(false);
				tts(elementArray[count].text);
				count++;
			}
			else{
				elementArray[count-1].blur();
				clearInterval(intervalID);
				tts("There are no more links on this page");
			}
		}, 5000);
	}

});