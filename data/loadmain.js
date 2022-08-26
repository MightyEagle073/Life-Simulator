//Segment M1: Checks if local storage work
localStorage.setItem("test", 1)
if (localStorage.getItem("test") != 1) {
	document.getElementById("notsupported_overlay").style.display = "block";
}
else {
	localStorage.removeItem("test")
}

//Segment M2: Firefox Cookie Transfer
if(navigator.userAgent.indexOf("Firefox") != -1) {
	if (Cookies.get("transfer") == 1) {
		for (let i = 1; i < database["transfer"].length; i++) {
			localStorage.setItem(database["transfer"][i], Cookies.get(database["transfer"][i]))
		}
		Cookies.set("transfer", 0)
		console.log("Cookie transfer successful")
	}
}
function cookie_transfer() {
	if(navigator.userAgent.indexOf("Firefox") != -1) {
		console.log("Commenced cookie transfer")
		Cookies.set("transfer", 1)
		for (let i = 1; i < database["transfer"]; i++) {
			Cookies.set(database["transfer"][i], localStorage.getItem(database["transfer"][i]))
		}
	}
}

//Segment M3: Initialises Life
if (localStorage.getItem("life_transfer") != null) {
	var life_info = JSON.parse(localStorage.getItem("life_transfer"))
	localStorage.removeItem("life_transfer")
}
else {
	document.getElementById("notstarted_overlay").style.display = "block";
}

//Segment M4: This function changes the theme depending on which one has been chosen by profile.js
switch_theme()

//Segment M5: This segment changes the life information on the diary (top left) and information (top right) tabs
document.getElementById("main_diary_h1").innerHTML = life_info["name"]["first"] + " " + life_info["name"]["last"] + "'s Diary"
document.getElementById("main_info_age").innerHTML = "Age: " + life_info["age"]["years"] + " years " + life_info["age"]["days"] + " days"
switch (life_info["gender"]) {
	case "m":
		document.getElementById("main_info_gender").innerHTML = "Gender: Male"
		break;
	case "f":
		document.getElementById("main_info_gender").innerHTML = "Gender: Female"
		break;
	default:
		document.getElementById("main_info_gender").innerHTML = "Gender: Error! You might want to restart your game."
}
document.getElementById("main_info_birthday").innerHTML = "Birthday:" + " " + dict_to_date(life_info["birthday"])
document.getElementById("main_control_currentdate").innerHTML = dict_to_date(life_info["birthday"])
document.getElementById("main_control_speed").value = 0

//Segment M7: This function creates temporary variables that can later be changed
var volume_temp = parseInt(localStorage.getItem("settings_volume"));
var theme_temp = parseInt(localStorage.getItem("settings_theme"));
var gamespeed_temp = parseInt(localStorage.getItem("settings_gamespeed"));

//Segment M8: This function changes the text on the secondary overlay according to the settings
function settings_sure() {
	document.getElementById("settings2_overlay").style.display = "block";
	volume_temp = document.getElementById("settings_volume").value;
	if (document.getElementById("settings_gamespeed1").checked) {
		gamespeed_temp = 1;
	}
	else if (document.getElementById("settings_gamespeed2").checked) {
		gamespeed_temp = 2;
	}
	else {
		gamespeed_temp = 3;
	}
}

//Segment M9: This function changes the value of the settings theme button
function settings_theme() {
	if (theme_temp == database_theme_names.length - 1) {
		theme_temp = 1
	}
	else {
		theme_temp = theme_temp + 1
	}
	for (let i = 1; i <= database_theme_names.length - 1; i++) {
		if (theme_temp == i) {
			document.getElementById("settings_theme").style.backgroundImage = `url('wallpapers/previews/${database_theme_names[i]}')`;
		}
	}
}

//Segment M11: This function adds the wait function, which tells the program to hold for a given amount of milliseconds
function wait(ms) {
	var d = new Date();
	var d2 = null;
	do { d2 = new Date(); }
	while (d2 - d < ms);
}

//Segment M12: This segment defines diaryreplace(), which replaces the curly brackets inside the quote, defined in the database, with a variable.
function diaryreplace(input) {
	let array_a = input.split(/{|}/)
	for (let i = 1; i < array_a.length; i += 2) {
		let array_b = array_a[i].split(",")
		switch (array_b.length) {
			case 1:
				array_a[i] = life_info[array_b[0]]
				break;
			case 2:
				array_a[i] = life_info[array_b[0]][array_b[1]]
				break;
			case 3:
				array_a[i] = life_info[array_b[0]][array_b[1]][array_b[2]]
				break;
			case 4:
				array_a[i] = life_info[array_b[0]][array_b[1]][array_b[2]][array_b[3]]
				break;
		}
	}
	output = array_a.join("")
	return output
}

//Segment M13: This segment defines progress(), which forwards the game by one day, and determines what happens during that day. Instead of dividing this into subsegments, this segment will be divided into tasks. This version (0.3.0) will perform 8 tasks for each iteration, and will be labelled as such. Future versions may perform more and more tasks per iteration. Not all tasks may be performed in an iteration. 
function progress() {
	if (breakfn == 0) {
		//Task 1: Upon starting the game, player's life begins, log birth into diary. Only performed during first day of player's life.
		if (life_info["dsb"] == 0) {
			life_info["diary"] = dict_to_date(life_info["date"]) + database["diary_entries"]["born"]
		}
		//Task 2: Advances time by one day
		life_info["date"] = date_add(life_info["date"], 1)
		//Task 3: Player gets older by one day. If the month and day of the current day and the month and day of the character's birthday matches, the age goes up by 1. Else, the days goes up by 1.
		if (life_info["date"]["month"] == life_info["birthday"]["month"] && life_info["date"]["day"] == life_info["birthday"]["day"]) {
			life_info["age"]["years"]++
			life_info["age"]["days"] = 0
		}
		else {
			life_info["age"]["days"]++
		}
		//Task 4: Active days since birth goes up by one. DSB is never displayed to the player.
		life_info["dsb"]++
		//Task 5: Determines whether the player will die naturally today. If so, end the game. Chances will get higher and higher based on the DSB of player.
		var death_x = Math.random()
		if (Math.pow(10, (life_info["dsb"]) * 0.0001) >= 10000000 * death_x) {
			breakfn = 2
			life_info["status"] = 2
			console.log("Dead at " + life_info["age"]["years"] + " years " + life_info["age"]["days"] + " days due to a death_x of " + death_x.toString())
			life_info["diary"] = life_info["diary"] + dict_to_date(life_info["date"]) + diaryreplace(database["diary_entries"]["death"])
			document.getElementById("main_audio_death").volume = localStorage.getItem("settings_volume") / 100
			document.getElementById("main_audio_death").play()
			document.getElementById("death_overlay").style.display = "block";
			document.getElementById("death_died").innerHTML = life_info["name"]["first"] + " " + life_info["name"]["last"] + " has died on " + dict_to_date(life_info["date"]) + " due to natural causes."
			switch (life_info["gender"]) {
				case "m":
					document.getElementById("death_age").innerHTML = "He was at an age of " + life_info["age"]["years"] + " years " + life_info["age"]["days"] + " days."
					break;
				case "f":
					document.getElementById("death_age").innerHTML = "She was at an age of " + life_info["age"]["years"] + " years " + life_info["age"]["days"] + " days."
					break;
			}
		}
		//Task 6: Updates information throughout the HTML
		document.getElementById("main_control_currentdate").innerHTML = dict_to_date(life_info["date"])
		document.getElementById("main_info_age").innerHTML = "Age: " + life_info["age"]["years"] + " years " + life_info["age"]["days"] + " days"
		document.getElementById("main_diary_p").innerHTML = life_info["diary"]
		//Task 7: Wait a period of time before advancing to the next day.
		wait(1000 * (Math.pow(10, (-0.03 * document.getElementById("main_control_speed").value))) - 1)
	}
}

//Segment M14: This function tells the program what to do when the start and pause buttons are pressed
var breakfn = 1
function timestart() {
	if (breakfn == 1) {
		breakfn = 0
	}
	for (let i = 0; i < 50000; i++) {
		setTimeout(function () { progress() }, 0);
	}
}
function timepause() {
	breakfn = 1;
}

//Segment M15: This function ends the life of the current player without saving
function endlife() {
	cookie_transfer()
	window.location.href = "../home.html"
}

//Segment M16: This function changes the text on the inside of the save life div
document.getElementById("save_overlay").style.display = "block";
for (let i = 1; i <= 10; i++) {
	if (JSON.parse(localStorage.getItem("current_info"))[i]["status"] == 1) {
		document.getElementById(`save_div_${i}`).innerHTML = `Life ${i}: ` + JSON.parse(localStorage.getItem("current_info"))[i]["name"]["first"] + " " + JSON.parse(localStorage.getItem("current_info"))[i]["name"]["last"];
	}
}

//Segment M17: This function changes the text on the inside of the preserve life div
function preserve() {
	document.getElementById("preserve_overlay").style.display = "block";
	for (let i = 1; i <= 30; i++) {
		if (JSON.parse(localStorage.getItem("past_info"))[i]["status"] == 2) {
			document.getElementById(`preserve_div_${i}`).innerHTML = `Life ${i}: ` + JSON.parse(localStorage.getItem("past_info"))[i]["name"]["first"] + " " + JSON.parse(localStorage.getItem("past_info"))[i]["name"]["last"];
		}
	}
}

//Segment M18: This function saves the life into the continue lives tab
function save_life(life_no) {
	life_info["life_no"] = life_no
	localStorage.setItem("life_transfer", JSON.stringify(life_info))
	cookie_transfer()
	window.location.href = "../home.html"
}

//Segment M19: This function saves the life into the pasts lives tab
function preserve_life(life_no) {
	life_info["life_no"] = life_no
	localStorage.setItem("life_transfer", JSON.stringify(life_info))
	cookie_transfer()
	window.location.href = "../home.html"
}

//Segment M20: Following code makes final adjustments to page
overlay("save_overlay", "none");