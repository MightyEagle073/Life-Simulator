// This script is used to load main.html, and is run after all the html elements
// of main.html has been initialised.

// Segment H1: Checks if user is using an unsupported browser
if (navigator.userAgent.indexOf("Firefox") != -1) {
    displayType("notSupported_overlay", "block");
}

localStorage.setItem("test", 1);
if (localStorage.getItem("test") != 1) {
    displayType("notSupported_overlay", "block");
}
localStorage.removeItem("test");

// Segment H2: Sets local storage values to default values if not already set
if (!localStorage.getItem("firstLaunch")) {
    // Segment H2a: Sets default local storage values except for current and past life
    localStorage.setItem("settings", JSON.stringify(database.settings));
    // Segment H2b: Sets current and past life local storage values
    let current_temp = {};
    for (let i = 1; i <= 10; i++) {
        // TODO Change 10 to a database variable (40%)
        current_temp[i] = database.lifeInformation;
    }
    localStorage.setItem("currentInfo", JSON.stringify(current_temp));
    let past_temp = {};
    for (let i = 1; i <= 30; i++) {
        // TODO Change 30 to a database variable (40%)
        past_temp[i] = database.lifeInformation;
    }
    localStorage.setItem("pastInfo", JSON.stringify(past_temp));
    console.log("All Local Storage set to default values");
    localStorage.setItem("firstLaunch", 1);
}

// Segment H3: Transfers any information over from main.html
if (localStorage.getItem("lifeTransfer")) {
    let info = JSON.parse(localStorage.getItem("lifeTransfer"));
    if (info.status == 1) {
        let newInfo = JSON.parse(localStorage.getItem("currentInfo"));
        newInfo[info.lifeNo] = info;
        localStorage.setItem("currentInfo", JSON.stringify(newInfo));
    } else if (info.status == 2) {
        let newInfo = JSON.parse(localStorage.getItem("pastInfo"));
        newInfo[info.lifeNo] = info;
        localStorage.setItem("pastInfo", JSON.stringify(newInfo));
    }
}

// Segment H4: This function changes the text in continue life section 
// according to the currentInfo local storage
for (let i = 1; i <= 10; i++) {
    let clsf = "#continueLife_saveFile";
    let cii = JSON.parse(localStorage.getItem("currentInfo"))[i];
    if (cii.status == 1) {
        if (cii.version == "0.3 beta") {
            $(clsf + `${i}_name`).html(`${cii.name.first} ${cii.name.last}`);
            $(clsf + `${i}_age`).html(`Age: ${cii.age.years}`);
            $(clsf + `${i}_date`).html(`Date: ${convert_dict_date(cii.date)}`);
        } else {
            $(clsf + `${i}_name`).html("Incompatible!");
            $(clsf + `${i}_date`).html(`An life from version ${cii.version} is stored here.`);
        }
    }
}

// Segment H5: This function changes the text in the past lives section 
// according to the pastInfo local storage
for (let i = 1; i <= 30; i++) {
    let plsf = "#pastLives_save";
    let pii = JSON.parse(localStorage.getItem("pastInfo"))[i]
    if (pii.status == 2) {
        if (pii.version == "0.3 beta") {
            let lifespan_start = convert_dict_date(pii.birthday);
            let lifespan_end = convert_dict_date(pii.date);
            let netWorth = pii.netWorth.toLocaleString("en-AU", {style: "currency", currency: "AUD"})
            $(plsf + `${i}_name`).html(`${pii.name.first} ${pii.name.last}`);
            $(plsf + `${i}_age`).html(`Age: ${pii.age.years}`);
            $(plsf + `${i}_date`).html(`Lifespan: ${lifespan_start} - ${lifespan_end}`);
            $(plsf + `${i}_wealth`).html(`Net Worth: ${netWorth}`);
            $(plsf + `${i}_career`).html(`Career: ${pii.career.longest}`);
        } else {
            $(plsf + `${i}_name`).html("Incompatible!");
            $(plsf + `${i}_date`).html(`An life from version ${pii.version} is stored here.`);
        }
    }
}

// Segment H6: This function changes the settings according to setting local storages
settings_initialise(); // Defined in settings.js

// Segment H7: This function variables that are transferred throughout functions
let settingsJson = JSON.parse(localStorage.getItem("settings"));
var volume_temp = settingsJson.volume;
var theme_temp = settingsJson.theme;
var gameSpeed_temp = settingsJson.gameSpeed;
var newFirstName_temp = "";
var newSurname_temp = "";
var newGender_temp = "";
var newDate_temp = 0;
var lifeNo_temp = 0;

// Segment H8: This function sets the default date of #newLife_dob to the current day
$(document).ready(function () {
    let now = new Date();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    let today = now.getFullYear() + "-" + month + "-" + day;
    $("#newLife_dob").val(today);
});

// Segment H9: Following code makes final adjustments to page
$("#home_version").fitText(40);
