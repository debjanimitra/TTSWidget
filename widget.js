window.addEventListener('load', function (){	
	var keys = []; 
	var intervalID = null; // set to some value only if scanner running
	var elementCount = 0; // index of element currently in focus
	var elementArray = []; // array containing elements
	var inTTSmode = false; // self-explanatory
	var option = ""; // whether link, button or text input selected, or none
	var is_scanning = false; // whether in the middle of the scan or no
	var selected_option = false; // user has selected to scan (auto or man) one of links, buttons input fields
	var to_scan = false; // auto scan only if the page has at least 1
	var tab_mode = false; // user chose man
	var valid_inputs = [17, 16, 83, 49, 50, 51, 90, 77, 9, 52, 27]; // set of keys that are part or whole of a keybaord command

	window.addEventListener("keydown", function(e){
		curr_key = e.which || e.keyCode;
		if (valid_inputs.indexOf(curr_key)>-1){ 
			keys[curr_key] = true;
		}
		if (inTTSmode && curr_key == 9){
			e.preventDefault();
		}

		// enter and exit TTS mode via Ctrl+Shift+S
		if (num_of_true(keys)==3 && keys[17] && keys[16] && keys[83]){
			window.speechSynthesis.cancel();
			keys.length = 0;
			selected_option = false;
			if (inTTSmode){
				stop_scan(true);
				inTTSmode = !inTTSmode;
				tts("Now exiting text-to-speech mode");
				tts("Goodbye!");
			}
			else{
				inTTSmode = !inTTSmode;
				keys.length = 0;
				inTTSmode = true;
				tts("Welcome to text-to-speech mode!");
				tts("Please listen carefully to the menu options:");
				say_options();
			}
		}

		// Say the links out loud
		if (num_of_true(keys) == 1 && keys[49]){
			window.speechSynthesis.cancel();
			keys.length = 0;
			if (inTTSmode){
				tab_mode = false;
				selected_option = true;
				stop_scan(true);
				option = "link";
				elementArray = get_all_links();
				to_scan = pre_announce(elementArray, option);
			}
		}

		// Say the button names out loud
		if (num_of_true(keys)==1 && keys[50]){
			window.speechSynthesis.cancel();
			keys.length = 0;
			if (inTTSmode){
				tab_mode = false;
				selected_option = true;
				stop_scan(true);
				option = "button";
				elementArray = get_all_buttons();
				to_scan = pre_announce(elementArray, option);
			}
		}

		// Say the input field names out loud 
		if (num_of_true(keys)==1 && keys[51]){
			window.speechSynthesis.cancel();
			keys.length = 0;
			if (inTTSmode){
				tab_mode = false;
				selected_option = true;
				stop_scan(true);
				option = "input field";
				elementArray = get_all_input_boxes();
				to_scan = pre_announce(elementArray, option);
			}
		}

		if (num_of_true(keys)==1 && keys[90]){
			window.speechSynthesis.cancel();
			keys.length = 0;
			if (inTTSmode){
				tab_mode = false;
				if (selected_option){
					if(to_scan){
						stop_scan(false);
						automatic_scan(elementArray, option);
					}
				}
			}
		}

		if (num_of_true(keys)==1 && keys[77]){
			window.speechSynthesis.cancel();
			keys.length = 0;
			if (inTTSmode){
				if (selected_option){
					if(to_scan){
						if (!tab_mode){
							tts("You have chosen to scan manually");
						}
						stop_scan(false);
						tab_mode = true;
						tts("Press tab to manually go through the "+option+"s on this page");
					}
				}
			}
		}

		if (num_of_true(keys)==1 && keys[9]){
			window.speechSynthesis.cancel();
			keys.length = 0;
			if (inTTSmode){
				if (selected_option){
					if (to_scan){
						if (tab_mode){
							manual_scan(elementArray, option);
						}
					}
				}
			}
		}

		// Say the options out loud
		// 1 to scan links
		// 2 to scan buttons
		// 3 to scan input fields
		// 4 to repeat options
		if (num_of_true(keys)==1 && keys[52]){
			window.speechSynthesis.cancel();
			keys.length = 0;
			if (inTTSmode){
				stop_scan(true);
				say_options();
			}			
		}

		// Stop scan, if currently scanning
		if (num_of_true(keys)==1 && keys[27]){
			window.speechSynthesis.cancel();
			keys.length = 0;
			if (inTTSmode){
				if (is_scanning){
					tts("Stopping scan");
				}
				else{
					tts("There is no automatic scan to stop");
				}
				stop_scan(false);
			}
		}

	});

	function say_options(){
		tts("Press 1 to list links.");
		tts("Press 2 to list buttons.");
		tts("Press 3 to list input fields.");
		tts("Press 4 to hear the menu options again");
	}

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
		return arr;
	}

	function get_all_input_boxes(){
		var inp = document.getElementsByTagName('input');
		var arr = [];
		for(var i=0; i<inp.length; i++) {
  			if (inp[i].type == "text"){
  				arr.push(inp[i]);
  			}
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
		tts("Press Z to scan automatically");
		tts("Press M to scan manually")
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

	function stop_scan(change_option){
		console.log("In stop scan")
		if (intervalID){
			clearInterval(intervalID);
		}
		if (elementArray[elementCount-1]){
			elementArray[elementCount-1].blur();
		}
		is_scanning = false;
		elementCount = 0;
		if (change_option){
			elementArray.length = 0;
			option = "";
		}		
	}

	function manual_scan(elementArray, option){
		if (elementCount < elementArray.length){
			elementArray[elementCount].focus();
			elementArray[elementCount].scrollIntoView(false);
			tts(option+" "+(elementCount+1)+" ");
			if (option === "input field"){
				tts(elementArray[elementCount].name);
			}
			else{
				tts(elementArray[elementCount].textContent);
			}
			elementCount++;
		}
		else {
			finish_scan(option);
		}
	}

	function automatic_scan(elementArray, option){
		tts ("You have chosen to scan automatically");
		tts("Now scanning");
		intervalID = setInterval(function () {
			if (elementCount < elementArray.length){
				is_scanning = true;
				elementArray[elementCount].focus();
				elementArray[elementCount].scrollIntoView(false);
				tts(option+" "+(elementCount+1)+" ");
				if (option === "input field"){
					tts(elementArray[elementCount].name);
				}
				else{
					tts(elementArray[elementCount].textContent);
				}
				elementCount++;
			}
			else{
				clearInterval(intervalID);
				is_scanning = false;
				finish_scan(option);
			}
		}, 3000);
	}

	function finish_scan(option){
		if (elementArray[elementCount-1]){
			elementArray[elementCount-1].blur();
		}
		tts("There are no more "+option+"s on this page");
		elementCount = 0;
		tts ("Press Z to scan "+option+"s automatically");
		tts ("Press M to scan "+option+"s manually");
		tts("Press 4 to hear menu options");
	}
});

