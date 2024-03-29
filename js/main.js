"use strict";

/**
 * Configs
 */
var lastCommand = ""
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('');
}
var configs = (function () {
    var instance;
    var Singleton = function (options) {
        var options = options || Singleton.defaultOptions;
        for (var key in Singleton.defaultOptions) {
            this[key] = options[key] || Singleton.defaultOptions[key];
        }
    };
    Singleton.defaultOptions = {
        general_help: "Here's a list of commands that you can use.\nYou can use autocomplete by pressing the TAB key.\nYou can get your last command by pressing the ARROW UP key.",
        ls_help: "List information about the files and folders (the current directory by default).",
        cat_help: "Read FILE(s) content and print it to the standard output (screen).",
        whoami_help: "Print the user name associated with the current effective user ID and more info.",
        date_help: "Print the system date and time.",
        help_help: "Print this menu.",
        energy_help: "Get net energy production by typing 'energy COUNTRYCODE DATE', e.g. 'energy DE 20210101'",
        energyplot_help: "Get net energy production plotted by typing 'energyplot COUNTRYCODE DATE', e.g. 'energyplot DE 20210101'",
        translate_help: "Translate English text to German, e.g. 'translate hello, this is a test'",
        translate_de_help: "Translate German text to English, e.g. 'übersetze hallo, das ist ein Test'",
        cv_help: "Print cv",
        classify_help: "Classify an image with 'classify' or 'predict', e.g. 'classify https://i.imgur.com/yrQjfxN.jpg'",
        clear_help: "Clear the terminal screen.",
        reboot_help: "Reboot the system.",
        merkel_help: "Ask a neural network questions about angela merkel. 'merkel Who is Angela Merkel?' But caution! It can take up to 45 seconds to answer!",
        welcome: "Welcome!\nType 'help' for a list of commands.\nIn order to skip text rolling, double click/touch anywhere.",
        internet_explorer_warning: "NOTE: I see you're using internet explorer, this website won't work properly.",
        welcome_file_name: "welcome_message.txt",
        invalid_command_message: "<value>: command not found.",
        reboot_message: "Preparing to reboot...\n\n3...\n\n2...\n\n1...\n\nRebooting...\n\n",
        permission_denied_message: "Unable to '<value>', permission denied.",
        sudo_message: "Unable to sudo using a web client.",
        usage: "Usage",
        file: "file",
        file_not_found: "File '<value>' not found.",
        username: "Username",
        hostname: "Host",
        platform: "Platform",
        accesible_cores: "Accessible cores",
        language: "Language",
        value_token: "<value>",
        host: "mkusterer.de",
        user: "user",
        is_root: false,
        type_delay: 0
    };
    return {
        getInstance: function (options) {
            instance === void 0 && (instance = new Singleton(options));
            return instance;
        }
    };
})();

/**
 * Your files here
 */
var otherSideNavElements = [{ "name": "kugele-simulation.de", "url": "http://kugele-simulation.de" }]
var files = (function () {
    var instance;
    var Singleton = function (options) {
        var options = options || Singleton.defaultOptions;
        for (var key in Singleton.defaultOptions) {
            this[key] = options[key] || Singleton.defaultOptions[key];
        }
    };
    Singleton.defaultOptions = {
        "credits.txt": "Based on https://github.com/luisbraganca/fake-terminal-website/",
        "about.txt": "The base website was made using only pure JavaScript with no extra libraries.\nThe base template is from: https://github.com/luisbraganca/fake-terminal-website/\nI added mobilenet from tensorflow JS and developed my own flask application for energy data queries.",
        "contact.txt": "maximilian.kusterer@gmail.com",
        "sports.txt": "Sports which I do on a regular basis:\nSummer: Beach volleyball, roundnet, mountainbiking, climbing outdoors, soccer\nWinter: Skiing, langlauf, climbing indoors, strength training",
        "books.txt": "Here's an uncomplete list of books which I enjoyed or am still enjoying:\nRobert Musil - Der Mann ohne Eigenschaften\nChimamanda Ngozi Adichie - Americanah\nGeorge Orwell - 1984\nAldous Huxley - Brave New World\nNoah Gordon - Der Medicus\nYuval Noah Harari - Eine kurze Geschichte der Menschheit\nDaniel Kehlmann - Die Vermessung der Welt\nHermann Hesse - Siddartha\nCixin Liu - Die drei Sonnen\nTiziano Terzani - Das Ende ist mein Anfang\nBernard Cornwell - Die Gral-Trilogie\nPaulo Coelho - Der Alchimist\nNathanael Rich - Losing Earth",
        "cv.txt": 'Maximilian Kusterer\nmaximilian.kusterer@gmail.com\nwww.linkedin.com/in/mkusterer\n\nSports, programming, books, cooking, current affairs, shitty guitar\n\nProgramming languages: Python, C#, Scala, Bash\n\n12/2020 – today\nEnBW AG, Karlsruhe\nData Engineer \n\n01/2018 – 11/2020\ndataqube GmbH, Karlsruhe\nData Scientist\n\n06/2017 – 11/2017\nTelecooperation Office (KIT), Karlsruhe\nResearch assistant for smart data analytics\n\n11/2013 – 07/2016\nFraunhofer ISI, Karlsruhe\nResearch assistant for energy technologies and systems'
    };
    return {
        getInstance: function (options) {
            instance === void 0 && (instance = new Singleton(options));
            return instance;
        }
    };
})();

var main = (function () {

    /**
     * Aux functions
     */
    var isUsingIE = window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./);

    var ignoreEvent = function (event) {
        event.preventDefault();
        event.stopPropagation();
    };

    var scrollToBottom = function () {
        window.scrollTo(0, document.body.scrollHeight);
    };

    var isURL = function (str) {
        return (str.startsWith("http") || str.startsWith("www")) && str.indexOf(" ") === -1 && str.indexOf("\n") === -1;
    };

    /**
     * Model
     */
    var InvalidArgumentException = function (message) {
        this.message = message;
        // Use V8's native method if available, otherwise fallback
        if ("captureStackTrace" in Error) {
            Error.captureStackTrace(this, InvalidArgumentException);
        } else {
            this.stack = (new Error()).stack;
        }
    };
    // Extends Error
    InvalidArgumentException.prototype = Object.create(Error.prototype);
    InvalidArgumentException.prototype.name = "InvalidArgumentException";
    InvalidArgumentException.prototype.constructor = InvalidArgumentException;

    var cmds = {
        LS: { value: "ls", help: configs.getInstance().ls_help },
        CAT: { value: "cat", help: configs.getInstance().cat_help },
        CV: { value: "cv", help: configs.getInstance().cv_help },
        RESUME: { value: "resume", help: configs.getInstance().cv_help },
        WHOAMI: { value: "whoami", help: configs.getInstance().whoami_help },
        DATE: { value: "date", help: configs.getInstance().date_help },
        ENERGY: { value: "energy", help: configs.getInstance().energy_help },
        ENERGYPLOT: { value: "energyplot", help: configs.getInstance().energyplot_help },
        HELP: { value: "help", help: configs.getInstance().help_help },
        CLEAR: { value: "clear", help: configs.getInstance().clear_help },
        REBOOT: { value: "reboot", help: configs.getInstance().reboot_help },
        PREDICT: { value: "predict", help: "see classify" },
        CLASSIFY: { value: "classify", help: configs.getInstance().classify_help },
        TRANSLATE: { value: "translate", help: configs.getInstance().translate_help },
        TRANSLATE_DE: { value: "übersetze", help: configs.getInstance().translate_de_help },
        MERKEL: { value: "merkel", help: configs.getInstance().merkel_help },
    };

    var Terminal = function (prompt, cmdLine, output, sidenav, profilePic, user, host, root, outputTimer) {
        if (!(prompt instanceof Node) || prompt.nodeName.toUpperCase() !== "DIV") {
            throw new InvalidArgumentException("Invalid value " + prompt + " for argument 'prompt'.");
        }
        if (!(cmdLine instanceof Node) || cmdLine.nodeName.toUpperCase() !== "INPUT") {
            throw new InvalidArgumentException("Invalid value " + cmdLine + " for argument 'cmdLine'.");
        }
        if (!(output instanceof Node) || output.nodeName.toUpperCase() !== "DIV") {
            throw new InvalidArgumentException("Invalid value " + output + " for argument 'output'.");
        }
        if (!(sidenav instanceof Node) || sidenav.nodeName.toUpperCase() !== "DIV") {
            throw new InvalidArgumentException("Invalid value " + sidenav + " for argument 'sidenav'.");
        }
        if (!(profilePic instanceof Node) || profilePic.nodeName.toUpperCase() !== "IMG") {
            throw new InvalidArgumentException("Invalid value " + profilePic + " for argument 'profilePic'.");
        }
        (typeof user === "string" && typeof host === "string") && (this.completePrompt = user + "@" + host + ":~" + (root ? "#" : "$"));
        this.profilePic = profilePic;
        this.prompt = prompt;
        this.cmdLine = cmdLine;
        this.output = output;
        this.sidenav = sidenav;
        this.sidenavOpen = false;
        this.sidenavElements = [];
        this.typeSimulator = new TypeSimulator(outputTimer, output);
    };

    Terminal.prototype.type = function (text, callback, skipthis = false) {
        this.typeSimulator.type(text, callback, skipthis);
    };

    Terminal.prototype.exec = function () {
        var command = this.cmdLine.value;
        this.cmdLine.value = "";
        this.prompt.textContent = "";
        this.output.innerHTML += "<span class=\"prompt-color\">" + this.completePrompt + "</span> " + command + "<br/>";
    };

    Terminal.prototype.init = function () {
        this.sidenav.addEventListener("click", ignoreEvent);
        this.cmdLine.disabled = true;
        this.sidenavElements.forEach(function (elem) {
            elem.disabled = true;
        });
        this.prepareSideNav();
        this.lock(); // Need to lock here since the sidenav elements were just added
        document.body.addEventListener("click", function (event) {
            if (this.sidenavOpen) {
                this.handleSidenav(event);
            }
            this.focus();
        }.bind(this));
        this.cmdLine.addEventListener("keydown", function (event) {
            if (event.which === 13 || event.keyCode === 13) {
                this.handleCmd();
                ignoreEvent(event);
            } else if (event.which === 9 || event.keyCode === 9) {
                this.handleFill();
                ignoreEvent(event);
            } else if (event.which === 38 || event.keyCode === 38) {
                document.getElementById("cmdline").value = lastCommand;
                ignoreEvent(event);
            }
        }.bind(this));
        this.reset();
    };

    Terminal.makeElementDisappear = function (element) {
        element.style.opacity = 0;
        element.style.transform = "translateX(-300px)";
    };

    Terminal.makeElementAppear = function (element) {
        element.style.opacity = 1;
        element.style.transform = "translateX(0)";
    };

    Terminal.prototype.prepareSideNav = function () {
        var capFirst = (function () {
            return function (string) {
                return string.toUpperCase();
            }
        })();
        var element = document.createElement("p");
        Terminal.makeElementDisappear(element);
        element.appendChild(document.createTextNode(capFirst("Documents")));
        this.sidenav.appendChild(element);
        this.sidenavElements.push(element);

        for (var file in files.getInstance()) {
            var element = document.createElement("button");
            Terminal.makeElementDisappear(element);
            element.onclick = function (file, event) {
                this.handleSidenav(event);
                this.cmdLine.value = "cat " + file + " ";
                this.handleCmd();
            }.bind(this, file);
            element.appendChild(document.createTextNode(capFirst(file.replace(/\.[^/.]+$/, "").replace(/_/g, " "))));
            this.sidenav.appendChild(element);
            this.sidenavElements.push(element);
        }

        var element = document.createElement("p");
        Terminal.makeElementDisappear(element);
        element.appendChild(document.createTextNode(capFirst("external links (leave the terminal)")));
        this.sidenav.appendChild(element);
        this.sidenavElements.push(element);

        for (var index in otherSideNavElements) {
            var sidenavElement = otherSideNavElements[index]
            var element = document.createElement("button");
            Terminal.makeElementDisappear(element);
            element.onclick = function (sidenavElement, event) {
                this.handleSidenav(event);
                window.open(sidenavElement.url);
            }.bind(this, sidenavElement);
            element.appendChild(document.createTextNode(capFirst(sidenavElement.name)));
            this.sidenav.appendChild(element);
            this.sidenavElements.push(element);
        }
        // Shouldn't use document.getElementById but Terminal is already using loads of params
        document.getElementById("sidenavBtn").addEventListener("click", this.handleSidenav.bind(this));
    };

    Terminal.prototype.handleSidenav = function (event) {
        if (this.sidenavOpen) {
            this.profilePic.style.opacity = 0;
            this.sidenavElements.forEach(Terminal.makeElementDisappear);
            this.sidenav.style.width = "50px";
            document.getElementById("sidenavBtn").innerHTML = "&#9776;";
            this.sidenavOpen = false;
        } else {
            this.sidenav.style.width = "300px";
            this.sidenavElements.forEach(Terminal.makeElementAppear);
            document.getElementById("sidenavBtn").innerHTML = "&times;";
            this.profilePic.style.opacity = 1;
            this.sidenavOpen = true;
        }
        document.getElementById("sidenavBtn").blur();
        ignoreEvent(event);
    };

    Terminal.prototype.lock = function () {
        this.exec();
        this.cmdLine.blur();
        this.cmdLine.disabled = true;
        this.sidenavElements.forEach(function (elem) {
            elem.disabled = true;
        });
    };

    Terminal.prototype.unlock = function () {
        this.cmdLine.disabled = false;
        this.prompt.textContent = this.completePrompt;
        this.sidenavElements.forEach(function (elem) {
            elem.disabled = false;
        });

        this.focus();
        scrollToBottom();

    };

    Terminal.prototype.handleFill = function () {
        var cmdComponents = this.cmdLine.value.trim().split(" ");
        if ((cmdComponents.length <= 1) || (cmdComponents.length === 2 && cmdComponents[0] === cmds.CAT.value)) {
            this.lock();
            var possibilities = [];
            if (cmdComponents[0].toLowerCase() === cmds.CAT.value) {
                if (cmdComponents.length === 1) {
                    cmdComponents[1] = "";
                }
                if (configs.getInstance().welcome_file_name.startsWith(cmdComponents[1].toLowerCase())) {
                    possibilities.push(cmds.CAT.value + " " + configs.getInstance().welcome_file_name);
                }
                for (var file in files.getInstance()) {
                    if (file.startsWith(cmdComponents[1].toLowerCase())) {
                        possibilities.push(cmds.CAT.value + " " + file);
                    }
                }
            } else {
                for (var command in cmds) {
                    if (cmds[command].value.startsWith(cmdComponents[0].toLowerCase())) {
                        possibilities.push(cmds[command].value);
                    }
                }
            }
            if (possibilities.length === 1) {
                this.cmdLine.value = possibilities[0] + " ";
                this.unlock();
            } else if (possibilities.length > 1) {
                this.type(possibilities.join("\n"), function () {
                    this.cmdLine.value = cmdComponents.join(" ");
                    this.unlock();
                }.bind(this));
            } else {
                this.cmdLine.value = cmdComponents.join(" ");
                this.unlock();
            }
        }
    };

    Terminal.prototype.handleCmd = async function () {

        var cmdComponents = this.cmdLine.value.trim().split(" ");
        lastCommand = this.cmdLine.value.trim()
        console.log(cmdComponents);
        this.lock();
        switch (cmdComponents[0]) {
            case cmds.CLASSIFY.value:
                this.classify(cmdComponents);
                break;
            case cmds.PREDICT.value:
                this.classify(cmdComponents);
                break;
            case cmds.CAT.value:
                this.cat(cmdComponents);
                break;
            case cmds.CV.value:
                this.cat(["cat", "cv.txt"]);
                break;
            case "resume":
                this.cat(["cat", "cv.txt"]);
                break;
            case "energy":
                this.energy(cmdComponents);
                break;
            case "energyplot":
                this.energyplot(cmdComponents);
                break;
            case "maxi":
                this.type("Yep, that's me :-).", this.unlock.bind(this));
                break;
            case "alina":
                this.type("Blocked by DSGVO.", this.unlock.bind(this));
                break;
            case "translate":
                this.translate(cmdComponents);
                break;
            case "merkel":
                this.merkel(cmdComponents);
                break;
            case "übersetze":
                this.translate(cmdComponents, "en");
                break;
            case "corona":
                this.corona();
                break;
            case cmds.LS.value:
                this.ls();
                break;
            case cmds.WHOAMI.value:
                this.whoami();
                break;
            case cmds.DATE.value:
                this.date();
                break;
            case cmds.HELP.value:
                this.help();
                break;
            case cmds.CLEAR.value:
                this.clear();
                break;
            case cmds.REBOOT.value:
                this.reboot();
                break;
            default:
                this.invalidCommand(cmdComponents);
                break;
        };
    };

    Terminal.prototype.classify = async function (cmdComponents) {
        try {
            // Load image
            var imgSrc = (cmdComponents.length > 1) ? cmdComponents[1] : "https://mkusterer.de/img/avatar.png"
            console.log(imgSrc)
            const formBody = JSON.stringify({ 'imageBase64': imgSrc })
            const img = await fetch('https://mkusterer.de/api/images_hook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: formBody,
            }).then(res => res.json())
            console.log(img)
            console.log(img.length)
            console.log(img[0].length)
            console.log(img[0][0].length)
            const imgTensor = tf.tensor3d(img)

            // Load the model.
            const model = await mobilenet.load();
            const predictions = await model.classify(imgTensor);
            console.log(predictions);
            const result = predictions.map(pred => pred.className.split(",")[0] + ": " + pred.probability.toFixed(4)).join("\n");
            //document.body.removeChild(image);
            this.type(result, this.unlock.bind(this))
        }
        catch (e) {
            console.log(e)
            this.type("Sorry, this did not work :( probably, the image was blocked or not found. Hit F12 and navigate to the console if you want to know more about it.", this.unlock.bind(this))
        }
    };

    Terminal.prototype.translate = async function (cmdComponents, targetLang = "de") {
        var translateText = cmdComponents.slice(1).join(" ")
        const formBody = JSON.stringify({ 'translate_text': translateText, 'target_lang': targetLang })
        const translation = await fetch('https://mkusterer.de/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: formBody,
        }).then(res => res.json())
        console.log(translation)
        const result = JSON.stringify(translation["translations"][0]["text"]);
        this.type(result, this.unlock.bind(this))
    };

    Terminal.prototype.merkel = async function (cmdComponents) {
        var merkelQuestion = cmdComponents.slice(1).join(" ")
        console.log(merkelQuestion)
        const formBody = JSON.stringify({ 'question': merkelQuestion })
        this.type("Querying merkel API, this can take up to 45 seconds...")
        const answer = await fetch('https://mkusterer.de/bert/bert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: formBody,
        }).then(response => response.text())
        console.log(answer)
        const result = "\nResult: " + answer;
        this.type(result, this.unlock.bind(this))
    };
    
    Terminal.prototype.cat = function (cmdComponents) {
        var result;
        if (cmdComponents.length <= 1) {
            result = configs.getInstance().usage + ": " + cmds.CAT.value + " <" + configs.getInstance().file + ">";
        } else if (!cmdComponents[1] || (!cmdComponents[1] === configs.getInstance().welcome_file_name || !files.getInstance().hasOwnProperty(cmdComponents[1]))) {
            result = configs.getInstance().file_not_found.replace(configs.getInstance().value_token, cmdComponents[1]);
        } else {
            result = cmdComponents[1] === configs.getInstance().welcome_file_name ? configs.getInstance().welcome : files.getInstance()[cmdComponents[1]];
        }
        this.type(result, this.unlock.bind(this));
    };

    Terminal.prototype.ls = function () {
        var result = ".\n..\n";
        for (var file in files.getInstance()) {
            result += file + "\n";
        }
        this.type(result.trim(), this.unlock.bind(this));
    };

    Terminal.prototype.sudo = function () {
        this.type(configs.getInstance().sudo_message, this.unlock.bind(this));
    }

    Terminal.prototype.whoami = function (cmdComponents) {
        var result = configs.getInstance().username + ": " + configs.getInstance().user + "\n" + configs.getInstance().hostname + ": " + configs.getInstance().host + "\n" + configs.getInstance().platform + ": " + navigator.platform + "\n" + configs.getInstance().accesible_cores + ": " + navigator.hardwareConcurrency + "\n" + configs.getInstance().language + ": " + navigator.language;
        this.type(result, this.unlock.bind(this));
    };

    Terminal.prototype.date = function (cmdComponents) {
        this.type(new Date().toString(), this.unlock.bind(this));
    };

    Terminal.prototype.help = function () {
        var result = configs.getInstance().general_help + "\n\n";
        for (var cmd in cmds) {
            result += cmds[cmd].value + " - " + cmds[cmd].help + "\n";
        }
        this.type(result.trim(), this.unlock.bind(this));
    };

    Terminal.prototype.energy = function (cmdComponents) {
        var split = cmdComponents.slice(1)
        console.log(split)
        var date = split[1]
        var country = split[0]
        if (date <= formatDate(new Date())) {
            var url = `https://mkusterer.de/api/energy?date=${date}&country=${country}`
            console.log(url)
            fetch(url)
                .then(res => res.json())
                .then((outJson) => {
                    var outFormatted = Object.keys(outJson).map(key => key + ": " + outJson[key]).join("\n")
                    this.type(outFormatted, this.unlock.bind(this));
                });
        }
        else {
            this.type("Date is in the future. This functionality has not been implemented yet.", this.unlock.bind(this));
        }
    }

    Terminal.prototype.energyplot = function (cmdComponents) {
        var split = cmdComponents.slice(1);
        console.log(split);
        var date = split[1];
        var country = split[0];
        if (date <= formatDate(new Date())) {
            var url = `https://mkusterer.de/api/energy?date=${date}&country=${country}&plot=true`;
            console.log(url);
            fetch(url)
                .then(res => res.json())
                .then((outJson) => {
                    this.type(outJson.fig.replace(/ /g, "\xa0"), this.unlock.bind(this));
                });
        }
        else {
            this.type("Date is in the future. This functionality has not been implemented yet.", this.unlock.bind(this));
        }
    }

    Terminal.prototype.clear = function () {
        this.output.textContent = "";
        this.prompt.textContent = "";
        this.prompt.textContent = this.completePrompt;
        this.unlock();
    };

    Terminal.prototype.corona = function () {
        this.output.innerHTML += "It is not nice to display images in a terminal... but you can click this link to view the current corona data for Germany:<br><a href='https://mkusterer.de/corona.html' target='_blank'>Click here!</a>"
        this.unlock();
    };

    Terminal.prototype.reboot = function () {
        this.type(configs.getInstance().reboot_message, this.reset.bind(this));
    };


    Terminal.prototype.reset = function () {
        this.output.textContent = "";
        this.prompt.textContent = "";
        if (this.typeSimulator) {
            var result_string = (configs.getInstance().welcome + (isUsingIE ? "\n" + configs.getInstance().internet_explorer_warning : ""));
            this.type(result_string, function () { this.unlock(); }.bind(this), false);
        }
    };

    Terminal.prototype.permissionDenied = function (cmdComponents) {
        this.type(configs.getInstance().permission_denied_message.replace(configs.getInstance().value_token, cmdComponents[0]), this.unlock.bind(this));
    };

    Terminal.prototype.invalidCommand = function (cmdComponents) {
        this.type(configs.getInstance().invalid_command_message.replace(configs.getInstance().value_token, cmdComponents[0]), this.unlock.bind(this));
    };

    Terminal.prototype.focus = function () {
        this.cmdLine.focus();
    };

    var TypeSimulator = function (timer, output) {
        var timer = parseInt(timer);
        if (timer === Number.NaN || timer < 0) {
            throw new InvalidArgumentException("Invalid value " + timer + " for argument 'timer'.");
        }
        if (!(output instanceof Node)) {
            throw new InvalidArgumentException("Invalid value " + output + " for argument 'output'.");
        }
        this.timer = timer;
        this.output = output;
    };

    TypeSimulator.prototype.type = function (text, callback, skipthis = false) {
        if (isURL(text)) {
            window.open(text);
        }
        var i = 0;
        var output = this.output;
        var timer = this.timer;
        var skipped = false;
        var skip = function () {
            skipped = true;
        }.bind(this);
        if (skipthis) {
            skipped = true;
        }
        document.addEventListener("dblclick", skip);

        (function typer() {
            if (i < text.length) {
                var char = text.charAt(i);
                var isNewLine = char === "\n";
                output.innerHTML += isNewLine ? "<br/>" : char;
                i++;
                if (!skipped) {
                    setTimeout(typer, 0);
                } else {
                    output.innerHTML += (text.substring(i).replace(new RegExp("\n", 'g'), "<br/>")) + "<br/>";
                    document.removeEventListener("dblclick", skip);
                    callback();
                }
            } else if (callback) {
                output.innerHTML += "<br/>";
                document.removeEventListener("dblclick", skip);
                callback();
            }
            scrollToBottom();
        })();
    };

    return {
        listener: function () {
            new Terminal(
                document.getElementById("prompt"),
                document.getElementById("cmdline"),
                document.getElementById("output"),
                document.getElementById("sidenav"),
                document.getElementById("profilePic"),
                configs.getInstance().user,
                configs.getInstance().host,
                configs.getInstance().is_root,
                configs.getInstance().type_delay
            ).init();
        }
    };
})();

window.onload = main.listener;
document.onpaste = function (event) {
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    console.log(JSON.stringify(items)); // might give you mime types
    for (var index in items) {
        var item = items[index];
        if (item.kind === 'file') {
            var blob = item.getAsFile();
            var reader = new FileReader();
            reader.onload = function (event) {
                console.log(event.target.result); // data url!
                const cmd = document.getElementById("cmdline")
                if (event.target.result.length < 500000) {
                    cmd.value += event.target.result
                } else {
                    cmd.value += "Pasted text/image is too large. You should try to copy the image URL and not directly paste images. (Bildadresse kopieren, NOT Bild kopieren)"
                }
            };
            reader.readAsDataURL(blob);
        }
    }
};


