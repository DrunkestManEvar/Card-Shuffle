class AudioController {
	constructor() {
		this.bgMusic = new Audio('Assets/Audio/creepy.mp3');
		this.flipSound = new Audio('Assets/Audio/flip.wav');
		this.matchSound = new Audio('Assets/Audio/match.wav');
		this.victorySound = new Audio('Assets/Audio/victory.wav');
		this.gameOverSound = new Audio('Assets/Audio/gameOver.wav');

		this.bgMusic.volume = 0.1;
		this.bgMusic.loop = true;
	}

	playMusic() {
		this.bgMusic.play();
	}

	stopMusic() {
		this.bgMusic.pause();
		this.bgMusic.currentTime = 0;
	}

	playFlipSound() {
		this.flipSound.play();
	}

	playMatchSound() {
		this.matchSound.play();
	}

	playVictorySound() {
		this.stopMusic();
		this.victorySound.play();
	}

	playGameOverSound() {
		this.stopMusic();
		this.gameOverSound.play();
	}
}

class Game {
	constructor(totalTime, cards) {
		this.totalTime = totalTime;
		this.timeRemaining = totalTime;
		this.cardsArray = cards;
		this.audioController = new AudioController;
	}

	startGame() {
		this.timeRemaining = this.totalTime;
		this.matchedCards = [];
		this.cardToMatch = null;
		this.busy = true;
		this.totalClicks = 0;

		this.timer = document.getElementById('time-countdown');
		this.flipsCounter = document.getElementById('flips-made');
		this.timer.innerText = this.timeRemaining;
		this.flipsCounter.innerText = this.totalClicks;

		this.hideCards();
		this.shuffleCards();

		setTimeout(() => {
			this.audioController.playMusic();
			this.busy = false;
			this.countdown = this.startCountdown();
		}, 500)
	}

	gameOver() {
		clearInterval(this.countdown);
		this.busy = true;
		document.getElementById('game-over-text').classList.add('visible');
		this.audioController.playGameOverSound();
	}

	victory() {
		clearInterval(this.countdown);
		this.busy = true;
		document.getElementById('victory-text').classList.add('visible');
		this.audioController.playVictorySound();
	}

	startCountdown() {
		return setInterval(() => {
			this.timeRemaining--;
			this.timer.innerText = this.timeRemaining;
			if (this.timeRemaining === 0) {
				this.gameOver();
			}
		}, 1000)
	}

	hideCards() {
		this.cardsArray.forEach(card => {
			card.classList.remove('visible');
			card.classList.remove('matched');
		})
	}

	shuffleCards() {
		for (let i = this.cardsArray.length - 1; i > 0; i--) {
			const randIndex = Math.floor(Math.random() * (i + 1));
			this.cardsArray[randIndex].style.order = i;
			this.cardsArray[i].style.order = randIndex;
		}
	}

	flipCard(card) {
		if (this.canFlipCard(card)) {
			card.classList.add('visible');
			this.audioController.playFlipSound();
			this.totalClicks++;
			this.flipsCounter.innerText = this.totalClicks;

			if (this.cardToMatch) {
				this.checkCard(card);
			} else {
				this.cardToMatch = card;
			}
		}
	}

	canFlipCard(card) {
		return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToMatch;
	}

	checkCard(card) {
		if (this.getCardType(card) === this.getCardType(this.cardToMatch)) {
			this.cardsMatch(card, this.cardToMatch)
		} else {
			this.cardsMismatch(card, this.cardToMatch)
		}
		this.cardToMatch = null;
	}

	getCardType(card) {
		return card.querySelector('.card-value').src;
	}

	cardsMatch(card, cardToMatch) {
		this.matchedCards.push(card);
		this.matchedCards.push(cardToMatch);

		card.classList.add('matched');
		cardToMatch.classList.add('matched');

		setTimeout(() => {
			this.audioController.playMatchSound();
		}, 500)

		if (this.matchedCards.length === this.cardsArray.length) {
			this.victory();
		}

		this.cardToMatch = null;
	}

	cardsMismatch(card, cardToMatch) {
		this.busy = true;
		setTimeout(() => {
			card.classList.remove('visible');
			cardToMatch.classList.remove('visible');
			this.busy = false;
		}, 1000)
	}
}

function ready() {
	const overlays = document.querySelectorAll('.overlay-text');
	const cards = document.querySelectorAll('.card');

	const mixOrMatch = new Game(100, cards);

	overlays.forEach(overlay => {
		overlay.addEventListener('click', () => {
			overlay.classList.remove('visible');
			mixOrMatch.startGame();
		})
	})

	cards.forEach(card => {
		card.addEventListener('click', () => {
			mixOrMatch.flipCard(card);
		})
	})
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', ready)
} else {
	ready();
}