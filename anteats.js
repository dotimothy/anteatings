	/* 
	* Todo:
	* Randomize Ants(check)
	* Sound Effects!(almost)
	* UI
	* Settings(diffsettings done)
	* Make it Funny! (check)
	* Peter the Anteater :) (check)
    */
    
    document.addEventListener('animationend', () => {
        document.body.style.pointerEvents = "auto";
    });

	let maxLives, lives, ants, killScore,antCounter, threshold, maxAnts, level;
    
    function checkScreen() {
        return window.innerWidth != screen.width ? setTimeout(function () {
            alert("Not Full Screen. Please Show Full Screen & Reload.");
            window.location.reload();
        },0) : 1;
    }

    var elem = document.documentElement;

    function openFullscreen() {
        console.log(elem.requestFullscreen);
        console.log(elem.webkitRequestFullscreen);
        console.log(elem.msRequestFullscreen);
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { 
          elem.msRequestFullscreen();
        }
      }

	function startGame(difficulty) {
        openFullscreen();
        checkScreen();
        window.addEventListener('resize',checkScreen);
        level = difficulty;
        let message = ""
		switch(difficulty) {
			case "easy": {
				message += "Squash All Them Ants!" 
				break;
			}
			case "medium": {
				message += "Eat All the Ants Before They Eat You!";
				break;				
			}	
			case "hard": {
                message += "You Will Be Eaten";
				break;
			}	 		
		}
        message += " (Please Use Full Screen to Play)";
        alert(message);
		let start = document.getElementById("start");
		let scores = document.getElementById("scores");
		let leftPeter = document.getElementById("peterleft");
		let rightPeter = document.getElementById("peterright");
		scores.style.display = "block";
		start.hidden = true;
		addCookies();
		leftPeter.style.animation = "leftPeter 1s 1 linear";
		rightPeter.style.animation = "rightPeter 1s 1 linear";
		setTimeout(function() {
			leftPeter.style.transform = "translate(-605%, 0%)";
			rightPeter.style.transform = "translate(400%, -75%)";
		},500);
		lives = maxLives, ants = 1, killScore = 0, antCounter = 0,  //medium
		updateScores(); 
		for(antCounter = 0; antCounter * (window.innerWidth/maxAnts) < window.innerWidth; antCounter++) {
			if (!antCounter) {
				drawAnt();	
			}
			else {
				setTimeout(drawAnt,threshold*antCounter);
			}
		}
	}

	function easy() {
		maxLives = 10;
		maxAnts = 20;
        threshold = 1200;
        let squash = document.getElementById("squash");
        squash.currentTime = 0;
        squash.volume = 0.25;
        squash.play();
        setTimeout(function() {
			startGame('easy');
		},1000);
	}

	function medium() {
		maxLives = 5;
		maxAnts = 50;
		threshold = 700;
		let warning = document.getElementById("warning");
		warning.currentTime = 0;
		warning.volume = 0.25;
		warning.play();
		setTimeout(function() {
			startGame('medium');
		},1000);
	}

	function hard() {
		let eaten = document.getElementById("eaten");
        eaten.currentTime = 0;
        eaten.volume = 0.25;
        eaten.play();
		maxLives = 3;
		maxAnts = 100;
		threshold = 400;
		setTimeout(function() {
			startGame('hard');
		}, 1000);
	}
	
	function updateScores() {
		let kill = document.getElementById("killCounter");
		let live = document.getElementById("liveCounter");
		kill.innerHTML = "<h2>Ant Deaths: " + killScore + "/"+ maxAnts + " Ants</h2>";
		let i;
		let hearts = "";
		live.innerHTML = "<h2>Lives: " + lives + "/" + maxLives + " Lives</h2>";
		for(i = 1; i <= maxLives; i++) {
			if(i <= lives) {
				hearts += "<img src=\"media/heart.png\" width=\"4%\">";
			}
			else {
				hearts += "<img src=\"media/blackheart.png\" width=\"4%\">";
			}
		}
		live.innerHTML += hearts;
		setTimeout(function() {
			let lose = (lives <= 0);
			let win = (ants == antCounter+1 && killScore >= ants-(maxLives-lives+1));
			if(lose) {
				alert("You are Dinner.");
				window.location.href = "https://www.youtube.com/watch?v=oHg5SJYRHA0&ab_channel=cotter548?autoplay=1";
			}
			else if(win) {
                let ding = document.getElementById("ding");
                ding.currentTime = 0;
                ding.play();
				alert("You Survived.");
				window.location.reload();
			}
		},10);
	}

	function drawAnt() {
		let spawn = document.getElementById("spawn");
		let id = "ant" + ants;
		let random = Math.trunc(Math.random()*(16) + 3);
		//let spacer = random + " ";
		//document.write(spacer);
		//let antWidth
		let transformPercent = (random - 1)*5;
		let ant = HTMLify("<img draggable=\"false\" onload=\"takeLife('" + id + "')\" src=\"media/ant.PNG\" width=\"5%\" class=\"ant alive\" style=\"left: " + transformPercent + "%\" id=\"" + id + "\" onclick=killAnt('" + id + "')>");
		spawn.appendChild(ant);
		ants++;
	}

	function killAnt(antID){
		++killScore;
		let slurp = document.getElementById("slurp");
		slurp.currentTime = 0;
		slurp.volume = 0.25;
		slurp.play();
        let ant = document.getElementById(antID);
        ant.removeAttribute('onclick');
        ant.setAttribute('src','/media/deadAnt.png');
        ant.setAttribute('style','animation-play-state: paused');
		//setTimeout(ant.remove(),1500);
		updateScores();
	}

	//working
	function takeLife(antID) {
		let ant = document.getElementById(antID);
		ant.addEventListener('animationend', () => {
			let audio;
			switch(level) {
				case "easy": {
					audio = document.getElementById("nyam");
					break;
				}
				case "medium": {
					audio = document.getElementById("owie");
					break;
				}
				case "hard": {
					audio = document.getElementById("haha");	
					break;	
				}
			}
            //audio.currentTime = 0;
            audio.volume = 0.25;
			audio.playbackRate =  2-threshold/1500;
			audio.play();
			
			ant.remove();
			--lives;
			updateScores();

            document.body.style.background = "linear-gradient(rgba(255,0,0,0.2),rgba(255,0,0, 0.2)),url(\"media/originalparkc.jpg\")";
			document.body.style.backgroundSize = "100%";	
			setTimeout(function() { 
				document.body.style.background = "linear-gradient(rgba(255,255,255,0.2),rgba(255, 255, 255, 0.2)),url(\"media/originalparkc.jpg\")";
				document.body.style.backgroundSize = "100%";
			}, 100);
		});
	}


	function HTMLify(txt) {
		let div = document.createElement('div');
		div.innerHTML = txt;
		return div.firstElementChild;
	}

	function addCookies() {
		let cookie = document.getElementById("cookies");
		let line = "<h1>";
			document.body.style.backgroundSize = "100%";	
			setTimeout(function() { 
                //document.body.style.backgroundColor = "linear-gradient(rgba(255,0,0,0.2),rgba(0,0,0,0.2))";
				document.body.style.background = "linear-gradient(rgba(255,255,255,0.2),rgba(255, 255, 255, 0.2)),url(\"media/originalparkc.jpg\")";
				document.body.style.backgroundSize = "100%";
			}, 100);
	}


	function HTMLify(txt) {
		let div = document.createElement('div');
		div.innerHTML = txt;
		return div.firstElementChild;
	}

	function addCookies() {
		let cookie = document.getElementById("cookies");
		let line = "<h1>";
		let cookieLength = widthOf("<h1 id=\"cookie\">🍪</h1>");
		for(let i = 0; i < Math.trunc(window.innerWidth/cookieLength); i += 1) {
			line += '🍪';
		}
		line += "<\h1>";
		cookies.innerHTML = line;
		//document.getElementById("cookie").remove();
	}


	function HTMLify(txt) {
		let div = document.createElement('div');
		div.innerHTML = txt;
		return div.firstElementChild;
	}

	function addCookies() {
		let cookie = document.getElementById("cookies");
		let line = "<h1>";
		let cookieLength = widthOf("<h1 id=\"cookie\">🍪</h1>");
		for(let i = 0; i < Math.trunc(window.innerWidth/cookieLength); i += 1) {
			line += '🍪';
		}
		line += "<\h1>";
		cookies.innerHTML = line;
		//document.getElementById("cookie").remove();
	}


	function HTMLify(txt) {
		let div = document.createElement('div');
		div.innerHTML = txt;
		return div.firstElementChild;
	}

	function addCookies() {
		let cookie = document.getElementById("cookies");
		let line = "<h1>";
		let cookieLength = widthOf("<h1 id=\"cookie\">🍪</h1>");
		for(let i = 0; i < Math.trunc(window.innerWidth/cookieLength); i += 1) {
			line += '🍪';
		}
		line += "<\h1>";
		cookies.innerHTML = line;
		//document.getElementById("cookie").remove();
	}

	function widthOf(text) {
		let div = document.createElement('div');
		div.innerHTML = text;
		div.style.display = 'inline-block';
		div.style.position = 'fixed';
		div.style.opacity = 0;
		div.style.pointerEvents = 'none';
		document.body.appendChild(div);
		let width = div.getBoundingClientRect().width;
		div.remove();
		return width;
	}