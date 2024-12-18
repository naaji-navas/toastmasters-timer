//Controls
const displayOutput = document.querySelector('.display-remain-time'),
    externalLinks = document.getElementsByClassName('externalLinks'),
    btnPause = document.getElementById('pause'),
    btnRestart = document.getElementById('btnRestart'),
    btnStop = document.getElementById('btnStop'),
    btnTimeTable = document.getElementById('btnTimetable'),
    btnChampion = document.getElementById('btnChampion'),
    btnBeep = document.getElementById('btnBeep'),
    btnVibrate = document.getElementById('btnVibrate'),
    btnClap = document.getElementById('btnClap'),
    btnDelete = document.getElementById('btnDelete'),
    btnInvert = document.getElementById('btnInvert'),
    btnMultiple = document.getElementById('btnMultiple'),
    btnEmail = document.getElementById('btnEmail'),
    btnShare = document.getElementById('btnShare'),
    btnDownload = document.getElementById('btnDownload'),
    btnYesChallenge = document.getElementById('btnYesChallenge'),
    btnYesConfirm = document.getElementById('btnYesConfirm'),
    btnYesChanges = document.getElementById('btnYesChanges'),
    btnSponsor2Us = document.getElementById('btnSponsor2Us'),
    btnSave = document.getElementById('btnSave'),
    btnSaveClap = document.getElementById('btnSaveClap'),
    btnAbout = document.getElementById('btnAbout'),
    imgClap = document.getElementById('imgClap'),
    imgRestart = document.getElementById('imgRestart'),
    imgTrophy = document.getElementById('imgTrophy'),
    imgBeep = document.getElementById('imgBeep'),
    imgCheckBox = document.getElementById('imgCheckBox'),
    imgMultiple = document.getElementById('imgMultiple'),
    imgVibrate = document.getElementById('imgVibrate'),
    dialogTimeTable = document.getElementById('timeTable'),
    dialogWelcome = document.getElementById('welcomeDialog'),
    dialogConfirm = document.getElementById('confirmDialog'),
    dialogChanges = document.getElementById('changesDialog'),
    dialogCustomTimes = document.getElementById('customTimes'),
    dialogAbout = document.getElementById('aboutDialog'),
    dialogClapping = document.getElementById('clappingDialog'),
    txtSpeaker = document.getElementById('txtSpeaker'),
    txtCustom = document.getElementById('txtCustom'),
    txtMin = document.getElementById('txtMin'),
    txtAvg = document.getElementById('txtAvg'),
    txtMax = document.getElementById('txtMax'),
    clapM = document.getElementById('clapM'),
    clapS = document.getElementById('clapS'),
    cmbSpeechType = document.getElementById('cmbSpeechType'),
    remainTime = document.getElementById('remainTime'),
    divSpeaker = document.getElementById('divSpeaker'),
    snackbarMsg = document.getElementById('snackbarMsg'),
    tickAll = document.getElementById('tickAll'),
    progressBar = document.querySelector('.e-c-progress'),
    indicator = document.getElementById('e-indicator'),
    pointer = document.getElementById('e-pointer'),
    speakers = document.getElementById('speakers'),
    customMin = document.getElementById('customMin'),
    customAvg = document.getElementById('customAvg'),
    customMax = document.getElementById('customMax'),
    ddLang = document.getElementById('ddLang'),
    invert100 = "invert(100%)",
    invert0 = "invert(0%)",
    length = Math.PI * 2 * 100,
    fastTransition = 0.2;

const defGreenBgn = "#60ad5e",
    defYellowBgn = "#ffeb3b",
    defRedBgn = "#e53935",
    defGreenCBBgn = "#2196f3",
    defYellowCBBgn = "#ffeb3b",
    defRedCBBgn = "#ad1457";

let greenBgnCss = defGreenBgn,
    yellowBgnCss = defYellowBgn,
    redBgnCss = defRedBgn;

// Detects if device is in standalone mode
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

let titleMeeting = document.getElementById('titleMeeting');

let externalContainer = null;

let clappingTime = 30,
    wholeTime = 30,
    selected = -1,
    minimum = 0,
    average = 0,
    maximum = 0,
    selectedColor = isDarkModeEnabled(),
    green = 0,
    yellow = 0,
    red = 0,
    timeLeft = 0,
    totalCount = 0;

let isPaused = false,
    isStarted = false,
    isStopped = true,
    isBeepEnabled = false,
    isVibrateEnabled = false,
    isClappingEnabled = false,
    isContestMode = false,
    isCustom = false,
    isFirstRun = true,
    clappingStarted = false,
    multipleEnabled = false,
    isNinjaMode = false,
    isTextPreviewMode = false,
    isFirstTime = false,
    isColorBlindnessEnabled = true;

let dateFormat = "DD/MM/YYYY",
    latestDB = "1.0",
    currentDB = "1.0",
    lastColor = "white";

let countries = ["US", "FM", "MH", "PH"];

let times = [
    //QA (30s)
    [10, 20, 30],
    //Ice-breaker
    [240, 300, 360],
    //1-9 (5 to 7)
    [300, 360, 420],
    //1m
    [30, 45, 60],
    //Evaluator intro
    [60, 75, 90],
    //Evaluator
    [120, 150, 180],
    //General Evaluator
    [300, 330, 360],
    //TT
    [60, 90, 120],
    //10 (8 to 10)
    [480, 540, 600],
    //12m
    [600, 660, 720],
    //15m
    [780, 840, 900],
    //20m
    [1080, 1170, 1200]
];

let intervalTimer;

var results = [];

var browserResult = new UAParser().getResult();

progressBar.style.strokeDasharray = length;

function update(value, timePercent) {
    let offset = -length - length * value / (timePercent);
    if (value >= 0) {
        progressBar.style.strokeDashoffset = -offset;
        pointer.style.transform = `rotate(${360 * value / (-timePercent)}deg)`;
    }
}

update(wholeTime, wholeTime); //refreshes progress bar
displayTimeLeft(wholeTime);

checkMode();

function setDateFormat() {
    if (countries.includes(navigator.language.split('-')[1]))
        dateFormat = "MM/DD/YYYY";
}

function disableLinks(isLinkDisabled) {
    Array.from(externalLinks).forEach((entry) => {
        if (isLinkDisabled)
            entry.setAttribute("disabled", "disabled");
        else
            entry.removeAttribute("disabled");
    });
}

function getTimeStamp(seconds) {
    return moment.utc(seconds * 1000).format('HH:mm:ss');
}

function getTime() {
    return remainTime.innerHTML;
}

function checkMode() {
    if (isContestMode) {
        document.getElementById('remainTime').classList.remove('showTime');
        document.getElementById('controls').classList.remove('contestModeOff');
        document.getElementById('remainTime').classList.add('hideTime');
        document.getElementById('controls').classList.add('contestMode');
    } else {
        document.getElementById('remainTime').classList.remove('contestMode');
        document.getElementById('controls').classList.remove('hideTime');
        document.getElementById('remainTime').classList.add('showTime');
        document.getElementById('controls').classList.add('contestModeOff');
    }
}

function changeWholeTime(seconds) {
    if (wholeTime + seconds > 0) {
        wholeTime += seconds;
        update(wholeTime, wholeTime);
    }
}

setInitialValues();

function setInitialValues() {
    maximum = 30;
    wholeTime = 30;

    isPaused = false;
    isStarted = false;
    update(wholeTime, wholeTime); //refreshes progress bar
    displayTimeLeft(wholeTime);
}

function updateDisplay() {
    update(wholeTime, wholeTime); //refreshes progress bar
    displayTimeLeft(wholeTime);
}

function basicReset() {
    resetState();
    wholeTime = 30; // manage this to set the whole time    
    updateDisplay();
}

function resetState() {
    isStarted = false;
    btnPause.classList.remove('pause');
    btnPause.classList.add('play');
    clearInterval(intervalTimer);
    wholeTime = -1;
    displayTimeLeft(wholeTime);
    wholeTime = 0;
    displayTimeLeft(wholeTime);
    lastColor = bgColors[selectedColor];
    document.body.style.background = lastColor;
    clappingStarted = false;
    setInitialValues();
    txtSpeaker.value = "";
    divSpeaker.className = 'mdl-textfield mdl-js-textfield';
    btnInvert.disabled = false;
    btnRestart.disabled = false;
    cmbSpeechType.disabled = false;
    disableLinks(false);
    isStopped = true;
    isPaused = false;
    imgRestart.src = "img/icons-svg/restart.svg";
    timeLeft = 0;
    currentState = 1;
    browserChangeFavIcon('');
    browserChangeTitle('');
}

function timer(seconds) { //counts time, takes seconds
    let remainTime = Date.now() + seconds * 1000;
    displayTimeLeft(seconds);

    intervalTimer = setInterval(() => {
        timeLeft = Math.round((remainTime - Date.now()) / 1000);
        let counter = maximum - timeLeft;
        if (counter >= minimum && counter < average) {
            green++;
            execAction(greenBgnCss, "green", 'min');
        } else if (counter >= average && counter < maximum) {
            yellow++;
            document.body.style.background = yellowBgnCss;
            execAction(yellowBgnCss, "yellow", 'opt');
        } else if (counter >= maximum) {
            red++;
            execAction(redBgnCss, "red", 'max');
            document.body.style.background = redBgnCss;
        }
        if (counter >= maximum + clappingTime) {
            if (!clappingStarted)
                startClapping();
            clappingStarted = true;
        }
        totalCount++;
        displayTimeLeft(timeLeft);
    }, 1000);
}

function execAction(bgn, color, icon) {
    document.body.style.background = bgn;
    startBeep();
    startAlert();
    startVibrate();
    lastColor = color;
    browserChangeFavIcon(icon);
}
if (os !== "Android" || navigator.userAgent.match(/SAMSUNG|SGH-[I|N|T]|GT-[I|P|N]|SM-[N|P|T|Z|G]|SHV-E|SCH-[I|J|R|S]|SPH-L/i)) {
    window.onresize = () => {
        resizeScreen();
    };
}

function resizeScreen() {
    const isPhabletPort = window.innerHeight > window.innerWidth * 1.9 && window.innerHeight > 900;
    let scaleVal = window.innerHeight / 600;
    if (window.innerWidth < 400 && window.innerHeight >= window.innerWidth * 2.333) {
        scaleVal = window.innerWidth / 400;
        if (externalContainer === null) {
            let bodyTmp = document.body;
            let divTmp = document.createElement("div");
            divTmp.id = 'externalContainer';
            bodyTmp.insertBefore(divTmp, bodyTmp.firstChild);
        }
        externalContainer = document.getElementById('externalContainer');
        let sContainer = document.getElementById('superContainer');
        externalContainer.append(sContainer);
        externalContainer.style.height = `${window.innerHeight}px`;
        sContainer.style.transformOrigin = "50% 0% 0px";

        setTimeout(() => {
            sContainer.style.transform = `scale(${scaleVal})`;
            setTimeout(() => {
                let cHeight = (1 + scaleVal) * window.innerHeight;
                if (cHeight < 514)
                    cHeight = 514;
                sContainer.style.height = `${cHeight}px`;
            }, 100);
        }, 100);
    } else if (isPhabletPort) {
        scaleVal = window.innerWidth / 325;
        const sContainer = document.getElementById('superContainer');

        setTimeout(() => {
            sContainer.style.height = `${window.innerHeight}px`;
            sContainer.style.transformOrigin = "50% 0% 0px";
            sContainer.style.transform = `scale(${scaleVal})`;
        }, 100);

        setTimeout(() => {
            const tmpDiv = document.getElementById('divSpeaker');
            if (tmpDiv.getBoundingClientRect().width > window.outerWidth) {
                sContainer.style.transform = `scale(${scaleVal - (scaleVal - tmpDiv.getBoundingClientRect().width / window.outerWidth)})`;
            }

            document.getElementById('innerPlayContainer').style.setProperty('top', '27%', 'important');
            document.querySelector('#playControl').style.top = '-30px';
        }, 100);
    } else if (window.innerHeight < 514) {
        if (externalContainer === null) {
            let bodyTmp = document.body;
            let divTmp = document.createElement("div");
            divTmp.id = 'externalContainer';
            bodyTmp.insertBefore(divTmp, bodyTmp.firstChild);
        }
        externalContainer = document.getElementById('externalContainer');
        let sContainer = document.getElementById('superContainer');
        externalContainer.append(sContainer);
        externalContainer.style.height = `${window.innerHeight}px`;
        sContainer.style.transformOrigin = "50% 0% 0px";

        setTimeout(() => {
            sContainer.style.transform = `scale(${scaleVal})`;
            setTimeout(() => {
                let cHeight = (1 + scaleVal) * window.innerHeight;
                if (cHeight < 514)
                    cHeight = 514;
                sContainer.style.height = `${cHeight}px`;
            }, 100);
        }, 100);
    } else {
        let sContainer = document.getElementById('superContainer');
        sContainer.style.height = `${window.innerHeight}px`;
        sContainer.style.transformOrigin = "50% 0% 0px";

        setTimeout(() => {
            sContainer.style.transform = `scale(${scaleVal})`;
        }, 100);

        setTimeout(() => {
            if (cmbSpeechType.getBoundingClientRect().width > window.outerWidth)
                sContainer.style.transform = `scale(${scaleVal - (scaleVal - cmbSpeechType.getBoundingClientRect().width / window.outerWidth)})`;
        }, 100);
    }
}

function resizeSelect() {
    setTimeout(() => {
        try {
            document.getElementsByClassName('mdl-menu__outline')[0].style.width = '300px';
            document.getElementsByClassName('mdl-menu__container')[0].style.width = '300px';
            document.getElementsByClassName('mdl-menu__outline')[0].style.height = '310px';
            document.getElementsByClassName('mdl-menu__container')[0].style.height = '310px';
            let mdlMenu = document.getElementsByClassName('mdl-menu')[0];
            let res = mdlMenu.style.clip.split(", ");
            if (res.length > 1) {
                res[1] = res[1].replace("px", "");
                res[2] = res[2].replace("px", "");

                let multiplier = 1;

                if (browserResult.browser.name === 'Edge' && parseFloat(browserResult.browser.version) < 19)
                    multiplier = 2;

                mdlMenu.style.clip = `${res[0]}, ${300 * multiplier}px, ${300 * multiplier}px, ${res[3]}`;
            }
        } catch (e) { }
    }, 50);
}

function pauseTimer() {
    if (minimum === 0 && maximum === 0 && average === 0 || selected === -1) {
        if (isCustom)
            showSnackbar(lngObject.notSaved);
        else
            showSnackbar(lngObject.chooseTime);
        return;
    }
    validateProperIntervals();

    browserStopClapping();

    isStopped = false;

    btnInvert.disabled = true;
    cmbSpeechType.disabled = true;

    if (!isStarted || timeLeft === undefined) {
        activateWakeLock();
        disableLinks(true);
        timer(wholeTime);
        isStarted = true;
        btnPause.disabled = true;
        btnPause.classList.remove('play');
        btnPause.classList.add('pause');
        setTimeout(() => {
            btnPause.disabled = false;
        }, 500);
    } else if (isPaused) {
        activateWakeLock();
        disableLinks(true);
        btnPause.disabled = true;
        btnPause.classList.remove('play');
        btnPause.classList.add('pause');
        setTimeout(() => {
            btnPause.disabled = false;
        }, 500);
        timer(timeLeft);
        isPaused = isPaused ? false : true;
    } else {
        deactivateWakeLock();
        disableLinks(false);
        btnPause.classList.remove('pause');
        btnPause.classList.add('play');
        clearInterval(intervalTimer);
        isPaused = isPaused ? false : true;
    }

    btnRestart.disabled = !isPaused;

    if (btnRestart.disabled) {
        imgRestart.src = "img/icons-svg/restart-off.svg";
        fade.to(document.getElementById('divSpeechType'), fastTransition, 0.1);
        fade.to(document.getElementById('divSpeaker'), fastTransition, 0.1);
        fade.to(document.getElementById('options'), fastTransition, 0.1);
        fade.to(document.getElementsByTagName('footer')[0], fastTransition, 0.1);

        if (isNinjaMode) {
            fade.to(document.getElementById('controls'), fastTransition, 0.5);
            fade.to(document.getElementsByClassName('circle')[0], fastTransition, 0);
            fade.to(document.getElementById('bmc-wbtn'), fastTransition, 0);
        }
        else {
            fade.to(document.getElementById('bmc-wbtn'), fastTransition, 0.1);
        }
        document.getElementById('bmc-wbtn').style.pointerEvents = 'none';
    } else {
        imgRestart.src = "img/icons-svg/restart.svg";
        unfadeElements();
    }
}

function unfadeElements() {
    fade.to(document.getElementById('divSpeechType'), fastTransition, 1.5);
    fade.to(document.getElementById('divSpeaker'), fastTransition, 1.5);
    fade.to(document.getElementById('options'), fastTransition, 1.5);
    fade.to(document.getElementsByTagName('footer')[0], fastTransition, 1.5);
    fade.to(document.getElementById('controls'), fastTransition, 1.5);
    fade.to(document.getElementsByClassName('circle')[0], fastTransition, 1.5);
    fade.to(document.getElementById('bmc-wbtn'), fastTransition, 1.5);
    document.getElementById('bmc-wbtn').style.pointerEvents = '';
}

function displayTimeLeft(timeLeft) { //displays time on the input
    let fixedTime = maximum - timeLeft;
    let hours = Math.floor(fixedTime / 3600);
    let minutes = Math.floor(fixedTime / 60);
    let seconds = fixedTime % 60;
    let displayString = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    displayOutput.textContent = displayString;
    if (!isContestMode && isStarted)
        browserChangeTitle(displayString);
    update(timeLeft, wholeTime);
}

function setDropDownValue(idVal, idContainer) {
    try {
        document.getElementById(idVal).dataset.selected = "true";
        getmdlSelect.init(idContainer);
    } catch (e) { }
}

function validateProperIntervals() {
    if (isCustom) {
        minimum = getMinCustom();
        average = getAvgCustom();
        maximum = getMaxCustom();
    } else
        setBasicIntervals();
    if (timeLeft === 0)
        wholeTime = maximum;
}

function setBasicIntervals() {
    minimum = times[selected][0];
    average = times[selected][1];
    maximum = times[selected][2];
}

function changeEventHandler() {
    let wasCustom = selected === 99;

    selected = parseInt(hiddenSpeechType.value);

    if (selected !== 99) {
        setBasicIntervals();
        wholeTime = maximum;
        setLocalStorage("wholeTime", maximum);
        updateDisplay();
        isCustom = false;
    } else {
        if (!wasCustom) {
            minimum = 0;
            maximum = 0;
            average = 0;

            txtCustom.parentElement.MaterialTextfield.change(lngObject.opt12);
        } else if (wasCustom && !isFirstTime) {
            setCustomText();

            let hours = Math.floor(minimum / 3600);
            let minutes = Math.floor(minimum / 60);
            let seconds = minimum % 60;

            txtMin.parentElement.MaterialTextfield.change(getDisplayString(hours, minutes, seconds));

            hours = Math.floor(average / 3600);
            minutes = Math.floor(average / 60);
            seconds = average % 60;

            txtAvg.parentElement.MaterialTextfield.change(getDisplayString(hours, minutes, seconds));

            hours = Math.floor(maximum / 3600);
            minutes = Math.floor(maximum / 60);
            seconds = maximum % 60;

            txtMax.parentElement.MaterialTextfield.change(getDisplayString(hours, minutes, seconds));
        }

        if (deviceDetector.device === 'phone') {
            setTimeout(() => {
                let bCustomTimes = document.getElementById('bodyCustomTimes');
                bCustomTimes.style.height = `${bCustomTimes.clientHeight * 100 / window.innerHeight}%`;
            }, 100);
        }

        hasCustomChange = false;
        isCustom = true;
        dialogCustomTimes.showModal();
    }
}

function startBeep() {
    if (isBeepEnabled && (green === 1 || yellow === 1 || red === 1))
        browserStartBeep();
}

function startAlert() {
    if (isTextPreviewMode && (green === 1 || yellow === 1 || red === 1)) {
        switch (lastColor) {
            case "green":
                showSnackbar(lngObject.color2, 3500);
                break;
            case "yellow":
                showSnackbar(lngObject.color3, 3500);
                break;
            default:
                showSnackbar(lngObject.color1, 3500);
        }
    }
}

function startVibrate() {
    if (isVibrateEnabled && (green === 1 || yellow === 1 || red === 1))
        browserStartVibrate();
}

function startClapping() {
    if (isClappingEnabled)
        browserStartClapping();
}

function stopClapping() {
    browserStopClapping();
}

function getVibrate() {
    if (getLocalStorageValue("isVibrateEnabled"))
        isVibrateEnabled = getLocalStorageValue("isVibrateEnabled") === 'true';
    else
        setVibrate();
}

function getClapping() {
    if (getLocalStorageValue("isClappingEnabled"))
        isClappingEnabled = getLocalStorageValue("isClappingEnabled") === 'true';
    else
        setClapping();
}

function getBeep() {
    if (getLocalStorageValue("isBeepEnabled"))
        isBeepEnabled = getLocalStorageValue("isBeepEnabled") === 'true';
    else
        setBeep();
}

function getContestMode() {
    if (getLocalStorageValue("isContestMode"))
        isContestMode = getLocalStorageValue("isContestMode") === 'true';
    else
        setContestMode();
}

function getFirstRun() {
    if (getLocalStorageValue("isFirstRun"))
        isFirstRun = getLocalStorageValue("isFirstRun") === 'true';
    else
        setFirstRun();
}

function getNinjaMode() {
    if (getLocalStorageValue("isNinjaMode"))
        isNinjaMode = getLocalStorageValue("isNinjaMode") === 'true';
    else
        setLocalStorage("isNinjaMode", false);
}

function getColorBlindnessMode() {
    if (getLocalStorageValue("isColorBlindnessEnabled"))
        isColorBlindnessEnabled = getLocalStorageValue("isColorBlindnessEnabled") === 'true';
    else
        setLocalStorage("isColorBlindnessEnabled", false);
}

function switchBgnColors() {
    greenBgnCss = (isColorBlindnessEnabled) ? defGreenCBBgn : defGreenBgn;
    yellowBgnCss = (isColorBlindnessEnabled) ? defYellowCBBgn : defYellowBgn;
    redBgnCss = (isColorBlindnessEnabled) ? defRedCBBgn : defRedBgn;
}

function setRowColors() {
    document.getElementById('bgnGreen').style.backgroundColor = greenBgnCss;
    document.getElementById('bgnYellow').style.backgroundColor = yellowBgnCss;
    document.getElementById('bgnRed').style.backgroundColor = redBgnCss;
}

function getTextPreviewMode() {
    if (getLocalStorageValue("isTextPreviewMode"))
        isTextPreviewMode = getLocalStorageValue("isTextPreviewMode") === 'true';
    else
        setLocalStorage("isTextPreviewMode", false);
}

function getSelectedColor() {
    if (getLocalStorageValue("selectedColor"))
        selectedColor = parseInt(getLocalStorageValue("selectedColor"));
    else
        setSelectedColor();
}

function setBeep() {
    setLocalStorage("isBeepEnabled", isBeepEnabled);
}

function setVibrate() {
    setLocalStorage("isVibrateEnabled", isVibrateEnabled);
}

function setClapping() {
    setLocalStorage("isClappingEnabled", isClappingEnabled);
}

function setContestMode() {
    setLocalStorage("isContestMode", isContestMode);
}

function setSelectedColor() {
    setLocalStorage("selectedColor", selectedColor);
}

function setFirstRun() {
    setLocalStorage("isFirstRun", isFirstRun);
}

function setContestImg() {
    if (!isContestMode)
        imgTrophy.src = "img/icons-svg/trophy-broken.svg";
    else
        imgTrophy.src = "img/icons-svg/trophy.svg";
}

function setVibrateImg() {
    if (!isVibrateEnabled)
        imgVibrate.src = "img/icons-svg/vibrate-off.svg";
    else
        imgVibrate.src = "img/icons-svg/vibrate.svg";
}

function setBeepImg() {
    if (!isBeepEnabled)
        imgBeep.src = "img/icons-svg/volume-off.svg";
    else
        imgBeep.src = "img/icons-svg/volume-high.svg";
}

function setClappingImg() {
    if (!isClappingEnabled)
        imgClap.src = "img/icons-svg/clapping-off.svg";
    else
        imgClap.src = "img/icons-svg/clapping-hands.svg";
}

function invertColors() {
    let currentInv = "";
    if (selectedColor === 1) {
        currentInv = invert100;
        setInvFilter(dialogTimeTable, invert100);
        setInvFilter(dialogWelcome, invert100);
        setInvFilter(dialogConfirm, invert100);
        setInvFilter(dialogChanges, invert100);
        setInvFilter(dialogCustomTimes, invert100);
        setInvFilter(dialogClapping, invert100);
        setInvFilter(customMin, invert100);
        setInvFilter(customAvg, invert100);
        setInvFilter(customMax, invert100);
        setInvFilter(speakers, invert100);
        setInvFilter(dialogAbout, invert100);
        setInvFilter(document.body, invert100);
        setBgd(dialogWelcome, bgColors[2]);
        setBgd(dialogConfirm, bgColors[2]);
        setBgd(dialogChanges, bgColors[2]);
        setBgd(dialogCustomTimes, bgColors[2]);
        setBgd(dialogTimeTable, bgColors[2]);
        setBgd(dialogClapping, bgColors[2]);
    }
    else {
        currentInv = invert0;
        setInvFilter(dialogTimeTable, invert0);
        setInvFilter(dialogWelcome, invert0);
        setInvFilter(dialogConfirm, invert0);
        setInvFilter(dialogChanges, invert0);
        setInvFilter(dialogCustomTimes, invert0);
        setInvFilter(dialogClapping, invert0);
        setInvFilter(customMin, invert0);
        setInvFilter(customAvg, invert0);
        setInvFilter(customMax, invert0);
        setInvFilter(speakers, invert0);
        setInvFilter(dialogAbout, invert0);
        setInvFilter(document.body, invert0);
        setBgd(dialogWelcome, bgColors[0]);
        setBgd(dialogConfirm, bgColors[0]);
        setBgd(dialogChanges, bgColors[0]);
        setBgd(dialogCustomTimes, bgColors[0]);
        setBgd(dialogTimeTable, bgColors[0]);
        setBgd(dialogClapping, bgColors[0]);
    }

    [].forEach.call(document.getElementsByClassName("noInvert"), (el) => {
        setInvFilter(el, currentInv);
    });

    setBgd(document.body, lastColor);
}

function storeTime(isTimeStored) {
    if ((minimum === 0 && maximum === 0 && average === 0) || (totalCount === 0)) return;
    deactivateWakeLock();
    stopClapping();

    if (isTimeStored) {
        let counter = maximum - timeLeft;
        let titleSpeechType = cmbSpeechType.value;
        if (selected === 99)
            titleSpeechType = txtCustom.value;
        addNewTime(txtSpeaker.value, titleSpeechType, getTimeStamp(minimum), getTimeStamp(average), getTimeStamp(maximum), getTimeStamp(counter), lastColor, counter > maximum + clappingTime || counter < minimum - clappingTime);
    }

    //Perform the reset before selecting the maximum
    green = 0;
    yellow = 0;
    red = 0;
    totalCount = 0;
    basicReset();

    if (!isCustom)
        maximum = times[selected][2];
    else
        maximum = getMaxCustom();

    wholeTime = maximum;
    browserChangeTitle('');
    unfadeElements();
}

function getMinCustom() {
    let unit = txtMin.value.split(":");
    return parseInt(unit[0]) * 3600 + parseInt(unit[1]) * 60 + parseInt(unit[2]);
}

function getAvgCustom() {
    let unit = txtAvg.value.split(":");
    return parseInt(unit[0]) * 3600 + parseInt(unit[1]) * 60 + parseInt(unit[2]);
}

function getMaxCustom() {
    let unit = txtMax.value.split(":");
    return parseInt(unit[0]) * 3600 + parseInt(unit[1]) * 60 + parseInt(unit[2]);
}

function closeCustomDialog() {
    if ((getMinCustom() > 0 || getAvgCustom() > 0 || getMaxCustom() > 0) && hasCustomChange)
        dialogChanges.showModal();
    else
        dialogCustomTimes.close();
}

function saveChanges() {
    let minTime = getMinCustom(),
        avgTime = getAvgCustom(),
        maxTime = getMaxCustom();

    if (minTime >= avgTime)
        showSnackbar(lngObject.errorMin);
    else if (minTime >= maxTime)
        showSnackbar(lngObject.errorHalf);
    else if (avgTime >= maxTime)
        showSnackbar(lngObject.errorMax);
    else {
        minimum = minTime;
        average = avgTime;
        maximum = maxTime;
        wholeTime = maximum;
        updateDisplay();
        dialogCustomTimes.close();
    }
}

btnPause.addEventListener('click', (event) => {
    if (event.detail === 1)
        pauseTimer();
});

btnRestart.addEventListener('click', () => {
    storeTime(false);
});

btnStop.addEventListener('click', () => {
    storeTime(true);
});

btnChampion.addEventListener('click', (event) => {
    if (event.detail === 3) {
        isNinjaMode = !isNinjaMode;

        if (isNinjaMode)
            showSnackbar(lngObject.ninjaEnabled, false);
        else
            showSnackbar(lngObject.ninjaDisabled, false);
        setLocalStorage("isNinjaMode", isNinjaMode);
    } else {
        isContestMode = !isContestMode;
        if (isContestMode)
            browserChangeTitle('');
        else
            browserChangeTitle(displayOutput.textContent);
        setContestImg();
        checkMode();
        setContestMode();
    }
});

btnVibrate.addEventListener('click', () => {
    isVibrateEnabled = !isVibrateEnabled;
    setVibrateImg();
    setVibrate();
});

btnBeep.addEventListener('click', (event) => {
    if (event.detail === 3) {
        isTextPreviewMode = !isTextPreviewMode;

        if (isTextPreviewMode)
            showSnackbar(lngObject.colorMsg, 1500);
        else
            showSnackbar(lngObject.colorMsgDis, 1500);

        setLocalStorage("isTextPreviewMode", isTextPreviewMode);
    }
    isBeepEnabled = !isBeepEnabled;
    setBeepImg();
    setBeep();
});

btnClap.addEventListener('click', (event) => {
    if (event.detail === 3) {
        dialogClapping.showModal();
        if (clappingTime === 30) {
            setDropDownValue("clapM0", "#divClapM");
            setDropDownValue("clapS30", "#divClapS");
        }
    } else {
        isClappingEnabled = !isClappingEnabled;
        setClappingImg();
        setClapping();
    }
});

btnSave.addEventListener('click', saveChanges);

btnSaveClap.addEventListener('click', () => {
    clappingTime = getSeconds(`00:${clapM.value}:${clapS.value}`);
    dialogClapping.close();
});

if (!dialogTimeTable.showModal) {
    dialogPolyfill.registerDialog(dialogTimeTable);
}

if (!dialogChanges.showModal) {
    dialogPolyfill.registerDialog(dialogChanges);
}

if (!dialogAbout.showModal) {
    dialogPolyfill.registerDialog(dialogAbout);
}

if (!dialogClapping.showModal) {
    dialogPolyfill.registerDialog(dialogClapping);
}

if (!dialogCustomTimes.showModal) {
    dialogPolyfill.registerDialog(dialogCustomTimes);
}

if (!dialogWelcome.showModal) {
    dialogPolyfill.registerDialog(dialogWelcome);
}

if (!dialogConfirm.showModal) {
    dialogPolyfill.registerDialog(dialogConfirm);
}

btnTimeTable.addEventListener('click', countTimetable);

btnDelete.addEventListener('click', deleteTimetable);

btnYesChallenge.addEventListener('click', () => {
    isContestMode = true;
    setContestImg();
    checkMode();
    setContestMode();
    dialogWelcome.close();
    isFirstRun = false;
    setFirstRun();
});

btnYesConfirm.addEventListener('click', deleteByIDs);

btnInvert.addEventListener('click', (event) => {
    if (event.detail === 3) {
        isColorBlindnessEnabled = !isColorBlindnessEnabled;

        if (isColorBlindnessEnabled)
            showSnackbar(lngObject.cbEnabled, false);
        else
            showSnackbar(lngObject.cbDisabled, false);

        setLocalStorage("isColorBlindnessEnabled", isColorBlindnessEnabled);
        switchBgnColors();
    }

    selectedColor = (selectedColor === 0) ? selectedColor = 1 : selectedColor = 0;

    lastColor = bgColors[selectedColor];
    setSelectedColor();
    invertColors();
    timeDialogInvert(selectedColor);
});

btnYesChanges.addEventListener('click', () => {
    saveChanges();
    dialogChanges.close();
});

btnSponsor2Us.addEventListener('click', () => {
    window.open("https://github.com/sponsors/FANMixco");
});

btnShare.addEventListener('click', async () => {
    const hNone = 'style="display: none!important;"';
    const tmpTable = '<style>table, th, td { border: 1px solid black; border-collapse: collapse; }</style>' + document.getElementById('tblResults').outerHTML.replace(/id="thDel"/g, `id="thDel" ${hNone}`).replace(/class="tdDel/g, `${hNone} class="tdDel`).replace(/filter: invert\(100%\);/g, '').replace(/filter:invert\(100%\);/g, '');
    const tableHtml = document.getElementById('titleMeeting').outerHTML + tmpTable + `<p><i>Exported by Toastmasters Timer. Created by <a href="https://github.com/naaji-navas" target="_blank">Najid Navas</a></i>.</p>`;

    try {
        await navigator.share({
            title: document.getElementById('titleMeeting').innerHTML,
            text: 'Check out the meeting timing results. Exported by Toastmasters Timer. Created by Najid Navas, https://github.com/naaji-navas',
            files: [
                new File([tableHtml], `${document.getElementById('titleMeeting').innerHTML.replace(/ /g, '_').replace(/\//g, '_')}.html`, { type: 'text/html' })
            ]
        });
        insertIAd();
    } catch (error) {
        console.error('Error sharing:', error);
    }
});

function insertIAd() {
    // Create a new script element
    const script = document.createElement('script');

    // Set the attributes for the script element
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = '//thubanoa.com/1?z=7667293';

    // Append the script to the head or body
    document.body.appendChild(script);
}

btnEmail.addEventListener('click', () => { });

btnAbout.addEventListener('click', () => {
    dialogAbout.showModal();
    if (deviceDetector.device === 'phone') {
        setTimeout(() => {
            dialogAbout.style.height = `${dialogAbout.innerHeight * 100 / window.outerHeight}%`;
        }, 100);
    }
});

txtMin.addEventListener('click', () => {
    setNewTime('txtMin', txtMin.value);
});

txtMax.addEventListener('click', () => {
    setNewTime('txtMax', txtMax.value);
});

txtAvg.addEventListener('click', () => {
    setNewTime('txtAvg', txtAvg.value);
});

btnDownload.addEventListener('click', browserExport);

btnMultiple.addEventListener('click', () => {
    Array.from(document.getElementsByClassName("mdl-js-checkbox")).forEach((element) => {
        let _this = element;
        setTimeout(() => {
            _this.MaterialCheckbox.check();
        }, 10);
    });
    if (!multipleEnabled) {
        imgMultiple.src = "img/icons-svg/checkbox-blank-outline.svg";
        showCheckBoxes();
    } else {
        imgMultiple.src = "img/icons-svg/checkbox-outline.svg";
        hideCheckBoxes();
    }
    multipleEnabled = !multipleEnabled;
    refreshControls();
});

dialogTimeTable.querySelector('.close').addEventListener('click', () => {
    dialogTimeTable.close();
});

dialogCustomTimes.querySelector('.close').addEventListener('click', closeCustomDialog);

dialogConfirm.querySelector('.close').addEventListener('click', () => {
    dialogConfirm.close();
});

dialogAbout.querySelector('.close').addEventListener('click', () => {
    dialogAbout.close();
});

dialogChanges.querySelector('.close').addEventListener('click', () => {
    dialogChanges.close();
    dialogCustomTimes.close();
});

dialogWelcome.querySelector('.close').addEventListener('click', () => {
    dialogWelcome.close();
    isFirstRun = false;
    setFirstRun();
    showSnackbar(lngObject.noHints);
});

txtCustom.addEventListener("keyup", (e) => {
    if (e.key === 'Enter')
        hideKeyboard(txtCustom);
});

if (os === "Android") {
    txtSpeaker.addEventListener("onfocus", () => {
        let y = document.getElementById("playControl").getBoundingClientRect().y;
        document.body.marginTop = `-${y}px`;
    });

    txtSpeaker.addEventListener("onblur", () => {
        document.body.marginTop = '0px';
    });
}

txtSpeaker.addEventListener("keyup", (e) => {
    if (e.key === 'Enter')
        hideKeyboard(txtSpeaker);
});

document.addEventListener('DOMContentLoaded', () => {
    cmbSpeechType.onchange = changeEventHandler;
}, false);

cmbSpeechType.addEventListener('click', resizeSelect);

maximum = 0;
wholeTime = 0;

getBeep();
getVibrate();
getClapping();
getContestMode();
getSelectedColor();
getNinjaMode();
getColorBlindnessMode();
switchBgnColors();
getTextPreviewMode();
getFirstRun();
setRowColors();

setContestImg();
setVibrateImg();
setBeepImg();
setClappingImg();
setSelectedColor();

setDateFormat();
initializeDB(currentDB, latestDB);

lastColor = bgColors[selectedColor];
invertColors();

setTimeout(() => {
    let bodyAbout = document.getElementById('bodyAbout');

    let bodyTranslators = document.getElementById('bodyTranslators');

    let bodyHelp = document.getElementById('bodyHelp');

    if (deviceDetector.device == 'phone') {
        //Timetable Dialog
        let timeTableTmp = document.getElementById('timeTable');
        let divTitleContainerTmp = document.createElement("div");
        divTitleContainerTmp.className = "titleContainer";

        let divTitleInnerContainer = document.createElement("div");
        divTitleInnerContainer.className = "titleInnerContainer";

        let spanCloseMobile = document.createElement("span");
        spanCloseMobile.className = "closeMobile";
        spanCloseMobile.id = 'btnCloseMobileSpan';

        let spanCloseIcon = document.createElement("img");
        spanCloseIcon.className = "btnCloseMobile";
        spanCloseIcon.src = "img/icons-svg/close.svg";
        spanCloseIcon.alt = "close";

        let spanTitle = document.createElement("span");
        spanTitle.id = 'spanTitle';

        spanCloseMobile.appendChild(spanCloseIcon);

        divTitleInnerContainer.appendChild(spanCloseMobile);
        divTitleInnerContainer.appendChild(spanTitle);

        divTitleContainerTmp.appendChild(divTitleInnerContainer);

        timeTableTmp.insertBefore(divTitleContainerTmp, timeTableTmp.firstChild);

        titleMeeting = document.getElementById('titleMeeting');
        titleMeeting.classList.remove('mdl-dialog__title');
        titleMeeting.style.margin = '0';
        titleMeeting.style.marginTop = '16px';
        titleMeeting.style.fontWeight = 1000;
        titleMeeting.style.fontSize = '1.25em';
        titleMeeting.style.display = 'inline';

        document.getElementById('spanTitle').append(titleMeeting);

        document.getElementById('btnCloseMeeting').style.display = 'none';

        document.getElementById('btnCloseMobileSpan').addEventListener('click', () => {
            dialogTimeTable.close();
        });

        //Custom Dialog
        let customTimesTmp = document.getElementById('customTimes');
        let divTitleContainerCT = document.createElement("div");
        divTitleContainerCT.className = "titleContainer";

        let divTitleInnerContainerCT = document.createElement("div");
        divTitleInnerContainerCT.className = "titleInnerContainer";

        let spanCloseMobileCT = document.createElement("span");
        spanCloseMobileCT.className = "closeMobile";
        spanCloseMobileCT.id = 'btnCloseMobileCustom';

        let spanCloseIconCT = document.createElement("img");
        spanCloseIconCT.className = "btnCloseMobile";
        spanCloseIconCT.src = "img/icons-svg/close.svg";
        spanCloseIconCT.alt = "close";

        let spanTitleCT = document.createElement("span");
        spanTitleCT.id = 'spanTitleCustom';

        let customTitleCT = document.createElement("h4");
        customTitleCT.innerHTML = '&nbsp;';
        customTitleCT.id = 'customTitle';

        let spanSaveCT = document.createElement("span");
        spanSaveCT.id = 'spanSave';
        spanSaveCT.className = 'btnRight';

        spanCloseMobileCT.appendChild(spanCloseIconCT);
        spanTitleCT.appendChild(customTitleCT);

        divTitleInnerContainerCT.appendChild(spanCloseMobileCT);
        divTitleInnerContainerCT.appendChild(spanTitleCT);
        divTitleInnerContainerCT.appendChild(spanSaveCT);

        divTitleContainerCT.appendChild(divTitleInnerContainerCT);

        customTimesTmp.insertBefore(divTitleContainerCT, customTimesTmp.firstChild);

        let customTitleTmp = document.getElementById('customTitle');
        customTitleTmp.classList.remove('mdl-dialog__title');
        customTitleTmp.style.margin = '0';
        customTitleTmp.style.marginTop = '16px';
        customTitleTmp.style.fontWeight = 1000;
        customTitleTmp.style.fontSize = '1.25em';
        customTitleTmp.style.display = 'inline';

        document.getElementById('btnCloseMobileCustom').addEventListener('click', () => {
            closeCustomDialog();
        });

        document.getElementById('spanSave').appendChild(document.getElementById('btnSave'));

        document.getElementById('footerCustom').style.display = 'none';
        document.getElementById('btnCloseCustom').style.display = 'none';

        //About
        let aboutDialogAD = document.getElementById('aboutDialog');
        let divTitleContainerAD = document.createElement("div");
        divTitleContainerAD.className = "titleContainer";

        let divTitleInnerContainerAD = document.createElement("div");
        divTitleInnerContainerAD.className = "titleInnerContainer";

        let spanCloseMobileAD = document.createElement("span");
        spanCloseMobileAD.className = "closeMobile";
        spanCloseMobileAD.id = 'btnCloseMobileAbout';

        let spanCloseIconAD = document.createElement("img");
        spanCloseIconAD.className = "btnCloseMobile";
        spanCloseIconAD.src = "img/icons-svg/close.svg";
        spanCloseIconAD.alt = "close";

        let spanTitleAD = document.createElement("span");
        spanTitleAD.id = 'spanTitleAbout';

        let aboutTitleAD = document.createElement("h4");
        aboutTitleAD.innerHTML = '&nbsp;';
        aboutTitleAD.id = 'aboutTitle';
        aboutTitleAD.style.margin = '0';
        aboutTitleAD.style.marginTop = '16px';
        aboutTitleAD.style.fontWeight = 1000;
        aboutTitleAD.style.fontSize = '1.25em';
        aboutTitleAD.style.display = 'inline';

        spanCloseMobileAD.appendChild(spanCloseIconAD);
        spanTitleAD.appendChild(aboutTitleAD);

        divTitleInnerContainerAD.appendChild(spanCloseMobileAD);
        divTitleInnerContainerAD.appendChild(spanTitleAD);

        divTitleContainerAD.appendChild(divTitleInnerContainerAD);

        aboutDialogAD.insertBefore(divTitleContainerAD, aboutDialogAD.firstChild);

        let spanFiveStars = document.createElement("span");
        spanFiveStars.id = 'spanFiveStars';
        spanFiveStars.className = 'btnRight';

        divTitleInnerContainerAD.appendChild(spanFiveStars);

        document.getElementById('spanFiveStars').appendChild(document.getElementById('btnSponsor2Us'));

        document.getElementById('btnCloseMobileAbout').addEventListener('click', () => {
            dialogAbout.close();
        });

        document.getElementById('divCloseAbout').style.display = 'none';

        bodyAbout.style.height = `${document.body.offsetHeight * 0.79}px`;

        bodyTranslators.style.height = `${document.body.offsetHeight * 0.79}px`;

        bodyHelp.style.height = `${document.body.offsetHeight * 0.79}px`;
    }
    else {
        let bodyApp = document.body;
        if (typeof HTMLDialogElement !== 'function') {
            bodyAbout.style.height = `${bodyApp.offsetHeight * 0.8}px`;

            bodyTranslators.style.height = `${bodyApp.offsetHeight * 0.8}px`;

            bodyHelp.style.height = `${bodyApp.offsetHeight * 0.8}px`;
        } else {
            bodyAbout.style.height = `${bodyApp.offsetHeight * 0.4}px`;

            bodyTranslators.style.height = `${bodyApp.offsetHeight * 0.4}px`;

            bodyHelp.style.height = `${bodyApp.offsetHeight * 0.4}px`;
        }
    }

    let exit = 0;
    do {
        setTimeout(() => {
            try {
                titleMeeting.innerHTML = `${lngObject.meetingAt} ${moment().format(dateFormat)}`;
            } catch (e) { }
        }, 1000);
        exit++;
    } while (lngObject === undefined && exit < 5);
}, 100);

checkMode();

tickAll.addEventListener('change', () => {
    Array.from(document.querySelectorAll(".mdl-js-checkbox:not(#lblTickAll)")).forEach((element) => {
        let _this = element;
        setTimeout(() => {
            if (lblTickAll.matches('.is-checked'))
                _this.MaterialCheckbox.check();
            else
                _this.MaterialCheckbox.uncheck();
        }, 10);
    });
    refreshControls();
});

(() => {
    btnEmail.style.display = 'none';

    if (os === "iOS") {
        btnVibrate.style.display = "none";
    }

    isFirstTime = true;

    if (deviceDetector.device === 'desktop') {
        try {
            let isFirefox = navigator.userAgent.indexOf("Firefox") != -1 ? true : false;

            // Safari 3.0+ "[object HTMLElementConstructor]" 
            let isSafari = /constructor/i.test(window.HTMLElement) || ((p) => p.toString() === "[object SafariRemoteNotification]")(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

            if (isFirefox || isSafari) {
                dialogTimeTable.classList.add('centeredDialog');
                dialogAbout.classList.add('centeredDialog');
            }
        }
        catch { }
        dialogTimeTable.classList.add('fullscreen-dialog-tablet');
        dialogAbout.classList.add('fullscreen-dialog-desktop');
        document.getElementById('divSpeakers').style.height = `${document.body.clientHeight * 0.53}px`;
    } else if (deviceDetector.device === 'tablet') {
        dialogTimeTable.classList.add('centeredDialog-tablet');
        dialogTimeTable.classList.add('fullscreen-dialog-tablet');
        dialogAbout.classList.add('centeredDialog');
        dialogAbout.classList.add('fullscreen-dialog-tablet');
        document.getElementById('divSpeakers').style.height = `${document.body.clientHeight * 0.53}px`;
    } else {
        dialogCustomTimes.classList.add('customBodyMobile');
        if (window.innerHeight < 514 && window.innerWidth > window.innerHeight)
            document.getElementById('divSpeakers').style.height = `${document.body.clientHeight * 0.60}px`;
        else
            document.getElementById('divSpeakers').style.height = `${document.body.clientHeight * 0.75}px`;

        dialogTimeTable.classList.add('fullscreen-dialog');
        dialogCustomTimes.classList.add('fullscreen-dialog');
        dialogAbout.classList.add('fullscreen-dialog');
    }

    if (typeof HTMLDialogElement !== 'function') {
        dialogWelcome.classList.remove('centeredDialog');
        dialogWelcome.classList.add('centeredDialogNoSupport');
        dialogSetTime.classList.remove('centeredDialog');
        dialogSetTime.classList.add('centeredDialogNoSupport');
        dialogTimeTable.classList.remove('centeredDialog');
        dialogTimeTable.classList.add('centeredDialogNoSupport');
        dialogAbout.classList.remove('centeredDialog');
        dialogAbout.classList.add('centeredDialogNoSupport');
        dialogAbout.classList.add('fullscreen-dialog');
    }

    window.addEventListener("focus", () => {
        try {
            let menuOutline = document.querySelector('.mdl-menu__outline');
            if (menuOutline) {
                if (menuOutline.style.zIndex !== "-1")
                    resizeSelect();
            }
        } catch (e) { }
    });

    if (browserResult.browser.name === '2345Explorer' || browserResult.browser.name === 'IE' || browserResult.browser.name === 'IEMobile')
        alert('Unsupported Browser. Please download a modern browser like Chrome or Firefox');

    setTimeout(() => {
        // Checks if should display install popup notification:
        if (os === "iOS" && !isInStandaloneMode())
            showSnackbar(lngObject.installiOS, 3000);

        try {
            if (lngObject.copyright3) {
                document.getElementById('spanCopyright3').innerHTML = `. ${lngObject.copyright3}`;
            }
        } catch { }

        timeDialogInvert(selectedColor);
    }, 1000);
})();

function hideKeyboard(element) {
    element.readOnly = true;
    setTimeout(() => {
        element.blur(); //actually close the keyboard
        element.readOnly = false;
    }, 100);
}

window.addEventListener('orientationchange', doOnOrientationChange);

function doOnOrientationChange() {
    location.reload();
}

document.addEventListener("keydown", (zEvent) => {
    if (zEvent.ctrlKey && (zEvent.key === "p" || zEvent.key === "P")) {
        pauseTimer();
    }
});

document.addEventListener("keydown", (zEvent) => {
    if (zEvent.ctrlKey && (zEvent.key === "s" || zEvent.key === "S")) {
        btnStop.click();
    }
});

document.addEventListener("keydown", (zEvent) => {
    if (zEvent.ctrlKey && (zEvent.key === "r" || zEvent.key === "R")) {
        btnRestart.click();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loading-container').style.display = "none";
    document.getElementById('superContainer').style.display = "block";

    if (isFirstRun) {
        if ((deviceDetector.device === 'phone' && isTouchDevice()) || deviceDetector.device !== 'phone') {
            if (window.innerWidth > 320) {
                dialogWelcome.showModal();
            } else {
                setFirstRun();
            }
        } else {
            setFirstRun();
        }
    }

    function isTouchDevice() {
        return (('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0));
    }

    if (window.innerHeight > window.innerWidth * 2 && window.matchMedia("(orientation: portrait)").matches) {
        document.querySelector('#innerPlayContainer').classList.add("longPhonePortrait");
    }

    document.body.style.maxHeight = `${window.innerHeight}px`;

    ddLang.value = getLocalStorageValue('currentLang');

    resizeScreen();
});

ddLang.onchange = (event) => {
    let confirmed = confirm(lngObject.rWarning);
    if (confirmed) {
        setLocalStorage('currentLang', event.target.value);
        location.reload();
    }
}