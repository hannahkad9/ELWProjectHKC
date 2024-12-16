import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../card/card.component';
import { MemoryService } from '../services/memory.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-game', 
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  standalone: true, 
  imports: [CommonModule, FormsModule, CardComponent],
})
export class GameComponent implements OnInit {
  pokemons: any[] = [];
  pairs: number = 2;
  cards: any[] = [];
  firstCard: any = null;
  secondCard: any = null;
  lockBoard: boolean = false;
  pairsFound: number = 0;
  tries: number = 0;
  score: number = Number(localStorage.getItem('score'));  // Track score
  moves: number = 0;  // Track moves as pairs
  misses: number = 0;  // Track misses
  roundsPlayed: number = Number(localStorage.getItem('roundsPlayed')) || 0; // Track rounds played
  level: number = Number(localStorage.getItem('level')) || 1;  // Track level
  accuracy: number = 0;  // Track accuracy
  showPopup: boolean = false;
  levelUpOccurred: boolean = false; // Track if level-up happened this round

  constructor(
    private router: Router, 
    private memoryService: MemoryService,
    private http: HttpClient  // Inject HttpClient
  ) {}

  ngOnInit(): void {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      this.startGame(); // Start the game after login
    }
  }

  async startGame() {
    this.pokemons = [];
    this.pairsFound = 0;
    this.tries = 0;
    this.moves = 0;  // Reset moves when the game starts
    this.misses = 0;  // Reset misses when the game starts
    this.accuracy = 0;  // Reset accuracy
    this.showPopup = false;
    this.levelUpOccurred = false; // Reset level-up flag for new game round

    const usedCountries: Set<string> = new Set();

    // Load unique countries
    while (this.pokemons.length < this.pairs) {
      const randomId = this.getRandomId();
      const pokemon = await this.memoryService.getFlag(randomId).toPromise();

      // Ensure that pokemon is not undefined before processing
      if (pokemon && !usedCountries.has(pokemon.country)) {
        this.pokemons.push(pokemon);
        usedCountries.add(pokemon.country); // Add the country to the set to avoid duplicates
      }
    }

    // Duplicate the array to have pairs of flags
    const doubledPokemons = [...this.pokemons, ...this.pokemons];
    this.cards = this.shuffle(doubledPokemons.map(pokemon => ({ ...pokemon, flipped: false, matched: false })));

    // Reset game state
    this.moves = 0;
    this.pairsFound = 0;
  }

  getRandomId(): number {
    return Math.floor(Math.random() * 249) + 1; 
  }

  shuffle(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  flipCard(card: any) {
    if (this.lockBoard || card.flipped) return;

    card.flipped = true;

    if (!this.firstCard) {
      this.firstCard = card;
      return;
    }

    this.secondCard = card;
    this.moves++;  // Increment moves for each pair flipped
    this.tries++;  // Increment tries whenever two cards are flipped

    this.checkMatch();
  }

  checkMatch() {
    if (this.firstCard.name === this.secondCard.name) {
      this.markAsMatched();
      this.pairsFound++;
      this.score++;  // Increment score for correct pair
      this.calculateAccuracy();  // Calculate accuracy after each match
      if (this.pairsFound === this.pairs) {
        this.showPopup = true;
        this.roundsPlayed++;  // Increment rounds played only when the game is complete
        localStorage.setItem('roundsPlayed', this.roundsPlayed.toString()); // Save updated roundsPlayed
        this.updateProgress();  // Update backend with current progress
        this.checkLevelUp();  // Check if level should be incremented
      }
    } else {
      this.unflipCards();
      this.misses++;  // Increment misses for incorrect pair
      this.score -= 1 / 3;  // Deduct score for incorrect pair
    }
  }

  markAsMatched() {
    this.firstCard.matched = true;
    this.secondCard.matched = true;
    this.resetBoard();
  }

  unflipCards() {
    this.lockBoard = true;
    setTimeout(() => {
      this.firstCard.flipped = false;
      this.secondCard.flipped = false;
      this.resetBoard();
    }, 1000);
  }

  resetBoard() {
    this.firstCard = null;
    this.secondCard = null;
    this.lockBoard = false;
  }

  calculateAccuracy() {
    // Calculate accuracy after each match
    const totalMoves = this.moves;
    const correctMoves = this.pairsFound;
    this.accuracy = totalMoves === 0 ? 0 : (correctMoves / totalMoves) * 100;
  }

  restartGame() {
    this.showPopup = false;
    this.startGame();  // Restart the game and reset stats
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);  // Redirect to login page
  }

  // Level upgrade logic based on score
  checkLevelUp() {
    const basePointsToLevelUp = 2;
    const levelMultiplier = 5;

    // Calculate dynamic points required for leveling up
    let pointsNeeded = basePointsToLevelUp + (this.level - 1) * levelMultiplier;

    // Only increment level if score exceeds the required points threshold
    if (this.score >= pointsNeeded && !this.levelUpOccurred) {
      // Increment level and mark that a level-up occurred this round
      this.level++;
      this.score -= pointsNeeded; // Deduct points used for leveling up
      pointsNeeded = basePointsToLevelUp + (this.level - 1) * levelMultiplier; // Update threshold for next level
      localStorage.setItem('level', this.level.toString()); // Save updated level
      this.updateProgress(); 
      console.log('Level up! Current level:', this.level);
      this.levelUpOccurred = true; // Prevent level from increasing multiple times in one round
    }
  }

  updateProgress() {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
  
    if (!token) {
      console.error('No token found');
      return;
    }
  
    // Prepare data for backend update
    const data = {
      token: token,
      scoreIncrement: this.score, // Send the updated score
      gamesPlayedIncrement: 1, // Increment games played
      levelIncrement: this.level // Send the current level
    };
  
    this.http.post('http://localhost:3000/api/auth/update', data).subscribe(
      (response) => {
        console.log('Progress updated successfully', response);
      },
      (error) => {
        console.error('Error updating progress', error);
      }
    );
  }
  


  calculatePointsNeeded(): number {
    const basePointsToLevelUp = 2;
    const levelMultiplier = 5;
    const pointsNeeded = basePointsToLevelUp + (this.level - 1) * levelMultiplier;
    return pointsNeeded - this.score;
  }
  // Method to calculate progress percentage
calculateLevelProgress(): number {
  const pointsNeeded = this.calculatePointsNeeded();
  const pointsForCurrentLevel = this.score % pointsNeeded;
  return (pointsForCurrentLevel / pointsNeeded) * 100;
}

}
