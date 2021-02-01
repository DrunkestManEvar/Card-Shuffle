class AudioController {
	constructor() {
		this.bgMusic = new Audio('Assets/Audio/creepy.mp3');
		this.flipSound = new Audio('Assets/Audio/flip.wav');
		this.matchSound = new Audio('Assets/Audio/match.wav');
		this.victorySound = new Audio('Assets/Audio/victory.wav');
		this.gameOverSound = new Audio('Assets/Audio/gameOver.wav');
		this.bgMusic.volume = 0.3;
		this.bgMusic.loop = true;
	}
	startMusic() {
		this.bgMusic.play();
	}
	stopMusic() {
		this.bgMusic.pause();
		this.bgMusic.currentTime = 0;
	}
	flip() {
		this.flipSound.play();
	}
	match() {
		this.matchSound.play();
	}
	victory() {
		this.stopMusic();
		this.victorySound.play();
	}
	gameOver() {
		this.stopMusic();
		this.gameOverSound.play();
	}
}

class MixOrMatch {
	constructor(totalTime, cards) {
		this.totalTime = totalTime;
		this.timeRemaining = totalTime;
		this.cardsArray = cards;
		this.timer = document.getElementById('time-countdown');
		this.flipsCount = document.getElementById('flips-made');
		this.audioController = new AudioController();
	}

	startGame() {
		this.matchedCards = [];
		this.totalClicks = 0;
		this.timeRemaining = this.totalTime;
		this.cardToCheck = null;
		this.busy = true;
		this.hideCards();
		this.shuffleCards(this.cardsArray);
		this.timer.innerText = this.timeRemaining;
		this.flipsCount.innerText = this.totalClicks;
		setTimeout(() => {
			this.audioController.startMusic();
			this.busy = false;
			this.countdown = this.startCountdown();
		}, 500)
	}

	gameOver() {
		this.busy = true;
		this.audioController.gameOver();
		document.getElementById('game-over-text').classList.add('visible');
		clearInterval(this.countdown);
	}

	victory() {
		this.busy = true;
		this.audioController.victory();
		document.getElementById('victory-text').classList.add('visible');
		clearInterval(this.countdown);
	}

	shuffleCards(cardsArray) {
		for (let i = cardsArray.length - 1; i > 0; i--) {
			const randIndex = Math.floor(Math.random() * (i + 1));
			cardsArray[randIndex].style.order = i;
			cardsArray[i].style.order = randIndex;
		}
	}

	hideCards() {
		this.cardsArray.forEach(card => {
			card.classList.remove('visible');
			card.classList.remove('matched');
		})
	}

	canFlipCard(card) {
		return !this.busy && card !== this.cardToCheck && !this.matchedCards.includes(card);
	}

	flipCard(card) {
		if(this.canFlipCard(card)) {
			this.audioController.flip();
			this.totalClicks++;
			this.flipsCount.innerText = this.totalClicks;
			card.classList.add('visible');

			if (this.cardToCheck) {
				this.checkIfMatch(card);
			} else {
				this.cardToCheck = card;
			}
		}
	}

	checkIfMatch(card) {
		if (this.getCardType(card) === this.getCardType(this.cardToCheck)) {
			this.cardsMatched(card, this.cardToCheck);
		} else {
			this.cardsMismatched(card, this.cardToCheck);
		}
		this.cardToCheck = null;
	}

	cardsMatched(card1, card2) {
		this.matchedCards.push(card1);
		this.matchedCards.push(card2);
		card1.classList.add('matched');
		card2.classList.add('matched');
		setTimeout(() => {
			this.audioController.match();
		}, 500)
		if (this.matchedCards.length === this.cardsArray.length) {
			this.victory();
		}
	}

	cardsMismatched(card1, card2) {
		this.busy = true;
		setTimeout(() => {
			card1.classList.remove('visible');
			card2.classList.remove('visible');
			this.busy = false;
		}, 1000)
	}

	getCardType(card) {
		return card.querySelector('.card-value').src;
	}

	startCountdown() {
		return setInterval(() => {
			this.timeRemaining--;
			this.timer.innerText = this.timeRemaining;
			if(this.timeRemaining === 0) {
				this.gameOver();
			}
		}, 1000)
	}
}



function ready() {
	const overlays = document.querySelectorAll('.overlay-text');
	const cards = document.querySelectorAll('.card');
	const game = new MixOrMatch(100, cards);

	overlays.forEach(overlay => {
		overlay.addEventListener('click', () => {
			overlay.classList.remove('visible');
			game.startGame()
		})
	})

	cards.forEach(card => {
		card.addEventListener('click', () => {
			game.flipCard(card);
		})
	})
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', ready())
} else {
	ready();
}