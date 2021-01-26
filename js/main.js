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
        cv_help: "Print cv",
        classify_help: "Classify an image with 'classify' or 'predict', e.g. 'classify https://i.imgur.com/yrQjfxN.jpg'",
        clear_help: "Clear the terminal screen.",
        reboot_help: "Reboot the system.",
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
var files = (function () {
    var instance;
    var Singleton = function (options) {
        var options = options || Singleton.defaultOptions;
        for (var key in Singleton.defaultOptions) {
            this[key] = options[key] || Singleton.defaultOptions[key];
        }
    };
    Singleton.defaultOptions = {
        "about.txt": "The base website was made using only pure JavaScript with no extra libraries.\nThe base template is from: https://github.com/luisbraganca/fake-terminal-website/\nI added mobilenet from tensorflow JS and developed my own flask application for energy data queries.",
        "contact.txt": "maximilian.kusterer@gmail.com",
        "sports.txt": "Sports which I do on a regular basis:\nSummer: Beach volleyball, roundnet, mountainbiking, climbing outdoors, soccer\nWinter: Skiing, langlauf, climbing indoors, strength training",
        "books.txt": "Here's an uncomplete list of books which I enjoyed or am still enjoying:\nRobert Musil - Der Mann ohne Eigenschaften\nChimamanda Ngozi Adichie - Americanah\nGeorge Orwell - 1984\nAldous Huxley - Brave New World\nNoah Gordon - Der Medicus\nYuval Noah Harari - Eine kurze Geschichte der Menschheit\nDaniel Kehlmann - Die Vermessung der Welt\nHermann Hesse - Siddartha\nCixin Liu - Die drei Sonnen\nTiziano Terzani - Das Ende ist mein Anfang",
        "cv.txt": 'Maximilian Kusterer\nmaximilian.kusterer@gmail.com\nwww.linkedin.com/in/mkusterer\n\nSports, programming, books, cooking, current affairs\n\nProgramming languages: Python, Scala\n\n12/2020 – today\nEnBW AG, Karlsruhe\nData Engineer \n\n01/2018 – 11/2020\ndataqube GmbH, Karlsruhe\nData Scientist\n\n06/2017 – 11/2017\nTelecooperation Office (KIT), Karlsruhe\nResearch assistant for smart data analytics\n\n11/2013 – 07/2016\nFraunhofer ISI, Karlsruhe\nResearch assistant for energy technologies and systems'  };
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
            case "merkel":
                var question = this.cmdLine.value.trim().split(" ").slice(1).join(" ")
                var merkel = await fetch("/merkel.txt")
                var text = await merkel.text()
                var model = await qna.load()
                var answers = await model.findAnswers(question, text);
                console.log(answers)
                this.type(JSON.stringify(answers), this.unlock.bind(this));
                break;
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
                var split = cmdComponents.slice(1)
                console.log(split)
                var date = split[1]
                var country = split[0]
                if (date <= formatDate(new Date())) {
                var url = `https://mkusterer.de/api?date=${date}&country=${country}`
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
                break;
                case "energyplot":
                    var split = cmdComponents.slice(1)
                    console.log(split)
                    var date = split[1]
                    var country = split[0]
                    if (date <= formatDate(new Date())) {
                        var url = `https://mkusterer.de/api/?date=${date}&country=${country}&plot=true`
                        console.log(url)
                        fetch(url)
                            .then(res => res.json())
                            .then((outJson) => {
                                this.type(outJson.fig.replace(/ /g, "\xa0"), this.unlock.bind(this));
                            });
                    }
                    else {
                        this.type("Date is in the future. This functionality has not been implemented yet.", this.unlock.bind(this));
                    }
                    break;
            case "maxi":
                this.type("Yep, that's me :-).", this.unlock.bind(this));
                break;
            case "alina":
                this.type("Blocked by DSGVO.", this.unlock.bind(this));
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
            var imgSrc = (cmdComponents.length > 1) ? "https://cors-anywhere.herokuapp.com/" + cmdComponents[1] : "img/avatar.png"
            var image = document.createElement('img');
            image.src = imgSrc;
            image.id = "asdasd"
            image.style = "display: none";
            image.crossOrigin = "anonymous";
            document.body.appendChild(image);

            const img = document.getElementById("asdasd")

            // Load the model.
            const model = await mobilenet.load();
            const predictions = await model.classify(img);
            console.log(predictions);
            const result = predictions.map(pred => pred.className.split(",")[0] + ": "+ pred.probability.toFixed(4)).join("\n");
            document.body.removeChild(image);
            this.type(result, this.unlock.bind(this))
        }
        catch (e) {
            this.type("Sorry, this did not work :( probably, the image was blocked or not found. Hit F12 and navigate to the console if you want to know more about it.", this.unlock.bind(this))
        }
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

    Terminal.prototype.clear = function () {
        this.output.textContent = "";
        this.prompt.textContent = "";
        this.prompt.textContent = this.completePrompt;
        this.unlock();
    };

    Terminal.prototype.reboot = function () {
        this.type(configs.getInstance().reboot_message, this.reset.bind(this));
    };


    Terminal.prototype.reset = function () {
        this.output.textContent = "";
        this.prompt.textContent = "";
        if (this.typeSimulator) {
            var result_string = (configs.getInstance().welcome  + (isUsingIE ? "\n" + configs.getInstance().internet_explorer_warning : ""));
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
