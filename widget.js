window.addEventListener('load', function (){	
	var keys = [];
	var intervalID = null; //set to some value only if scanner running
	var speech_rate = 1;
	var silence_duration = 5000;
	var elementCount = 0;
	var elementArray = [];
	var paused = false;
	var inTTSmode = false;
	var option = "";

	window.addEventListener("keydown", function(e){
		keys[e.keyCode] = true;
		console.log(e.keyCode);

		if (num_of_true(keys)==3 && keys[17] && keys[16] && keys[83]){
			if (inTTSmode){
				inTTSmode = !inTTSmode;
				tts("Now exiting text-to-speech mode");
				tts("Goodbye!");
			}
			else{
				inTTSmode = !inTTSmode;
				keys.length = 0;
				inTTSmode = true;
				tts("Welcome to text-to-speech mode!");
				tts("Please listen carefully to the following options:");
				tts("Press 1 to list links.");
				tts("Press 2 to list buttons.");
				tts("Press 3 to list input fields.");
			}
		}

		if (num_of_true(keys) == 1 && keys[49]){
			keys.length = 0;
			if (inTTSmode){
				option = "link";
				elementArray = get_all_links();
				var to_scan = pre_announce(elementArray, option);
				if (to_scan){
					scan(elementArray, option);
				}
			}
		}

		if (num_of_true(keys)==1 && keys[50]){
			keys.length = 0;
			if (inTTSmode){
				option = "button";
				elementArray = get_all_buttons();
				var to_scan = pre_announce(elementArray, option);
				if (to_scan){
					scan(elementArray, option);
				}
			}
		}

		if (num_of_true(keys)==1 && keys[27]){
			keys.length = 0;
			if (intervalID){
				clearInterval(intervalID);
				elementArray[elementCount-1].blur();
				elementCount = 0; //when you escape, the only way to restart is all the way from the top
			}
		}

		if (num_of_true(keys)==1 && keys[80]){
			keys.length=0;
			paused = !paused;
			if (paused){
				tts("Scanning paused");
				clearInterval(intervalID);
			}
			else{
				scan(elementArray, option);
			}
		}

	});

	function get_all_links(){
		var l = document.getElementsByTagName('a');
		var arr = [];
		for(var i=0; i<l.length; i++) {
  			arr.push(l[i]);
		}
		return arr;
	}

	function get_all_buttons(){
		var b = document.getElementsByTagName('button');
		var arr = [];
		for(var i=0; i<b.length; i++) {
  			arr.push(b[i]);
		}
		// b = document.getElementsByTagName('input');
		// for(var i=0; i<b.length; i++) {
		//	if (b[i].type == "button" || b[i].type == "submit"){
		//		arr.push(b[i]);
		//	}
		// }
		return arr;
	}

	function get_all_input_boxes(){
		var inp = document.getElementsByTagName('input');
		var arr = [];
		for(var i=0; i<b.length; i++) {
  			arr.push(inp[i]);
		}
		return arr;				
	}

	function pre_announce(arr, item){
		tts("You have picked "+item+"s");
		if (arr.length==0){
			tts("There are no "+item+"s on this page");	
			return false;
		}
		if (arr.length==1){
			tts("There is 1 "+item+" on this page");
		}
		else{
			tts("There are "+arr.length+" "+item+"s on this page");			
		}
		return true;
	}

	function num_of_true(keys){
		var trueCount = 0;
		for (var i=0; i<keys.length; i++){
			if (keys[i] == true){
				trueCount++;
			}
		}
		return trueCount;
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

	function scan(elementArray, option){
		tts("Now scanning");
		intervalID = setInterval(function () {
			if (elementCount < elementArray.length){
				elementArray[elementCount].focus();
				elementArray[elementCount].scrollIntoView(false);
				tts(option+" "+(elementCount+1)+" ");
				tts(elementArray[elementCount].textContent);
				elementCount++;
			}
			else{
				elementArray[elementCount-1].blur();
				clearInterval(intervalID);
				if (option === "link"){
					tts("There are no more links on this page");
				}
				if (option === "button"){
					tts("There are no more buttons on this page");
				}
				option = "";
				elementCount = 0;
			}
		}, 5000);
	}

});