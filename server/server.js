import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del build
app.use(express.static(path.join(__dirname, '../dist')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Estado del juego
const gameState = {
  isActive: false,
  rosco1: [], // Palabras para equipo 1
  rosco2: [], // Palabras para equipo 2
  currentTeam: 1, // 1 o 2
  team1: {
    currentLetterIndex: 0,
    correct: 0,
    wrong: 0,
    timeLeft: 420, // 5 minutos en segundos
    isTimerRunning: false,
    completed: false
  },
  team2: {
    currentLetterIndex: 0,
    correct: 0,
    wrong: 0,
    timeLeft: 420,
    isTimerRunning: false,
    completed: false
  },
  winner: null,
  isPaused: false
};

// Temporizadores
let timer1 = null;
let timer2 = null;

// Letras del rosco (27 letras incluyendo Ñ)
const LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

// Funciones helper
const findNextPendingIndex = (rosco, startIndex) => {
  const len = LETTERS.length;
  // Buscar desde la siguiente posición hasta el final
  for (let i = startIndex + 1; i < len; i++) {
    if (rosco[i].status === 'pending' || rosco[i].status === 'passed') {
      return i;
    }
  }
  // Si no encuentra, dar la vuelta y buscar desde el principio hasta el índice actual
  for (let i = 0; i <= startIndex; i++) {
    if (rosco[i].status === 'pending' || rosco[i].status === 'passed') {
      return i;
    }
  }
  return -1; // No quedan palabras pendientes
};

// Funciones helper
const startTimer = (team) => {
  const teamKey = team === 1 ? 'team1' : 'team2';
  const timerRef = team === 1 ? 'timer1' : 'timer2';

  if (gameState[teamKey].isTimerRunning) return;

  gameState[teamKey].isTimerRunning = true;

  const timer = setInterval(() => {
    gameState[teamKey].timeLeft--;
    io.emit('timerUpdate', { team, timeLeft: gameState[teamKey].timeLeft });

    if (gameState[teamKey].timeLeft <= 0) {
      clearInterval(timer);
      gameState[teamKey].isTimerRunning = false;
      gameState[teamKey].completed = true;
      checkWinner();
    }
  }, 1000);

  if (team === 1) timer1 = timer;
  else timer2 = timer;
};

const stopTimer = (team) => {
  const timerRef = team === 1 ? timer1 : timer2;
  const teamKey = team === 1 ? 'team1' : 'team2';

  if (timerRef) {
    clearInterval(timerRef);
    gameState[teamKey].isTimerRunning = false;
  }
};

const stopAllTimers = () => {
  if (timer1) clearInterval(timer1);
  if (timer2) clearInterval(timer2);
  gameState.team1.isTimerRunning = false;
  gameState.team2.isTimerRunning = false;
};

const checkWinner = () => {
  const team1Completed = gameState.team1.completed ||
    gameState.team1.correct + gameState.team1.wrong >= LETTERS.length;
  const team2Completed = gameState.team2.completed ||
    gameState.team2.correct + gameState.team2.wrong >= LETTERS.length;

  if (team1Completed && team2Completed) {
    stopAllTimers();

    // Gana quien tenga más aciertos
    if (gameState.team1.correct > gameState.team2.correct) {
      gameState.winner = 1;
    } else if (gameState.team2.correct > gameState.team1.correct) {
      gameState.winner = 2;
    } else {
      // Empate - gana quien haya terminado primero o tenga más tiempo restante
      gameState.winner = gameState.team1.timeLeft >= gameState.team2.timeLeft ? 1 : 2;
    }

    gameState.isActive = false;
    io.emit('gameEnded', { winner: gameState.winner, gameState });
  }
};

const switchTeam = () => {
  stopTimer(gameState.currentTeam);
  gameState.currentTeam = gameState.currentTeam === 1 ? 2 : 1;
  io.emit('teamSwitched', { currentTeam: gameState.currentTeam });
};

// Socket.io handlers
io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Enviar estado actual (asegurar que se envía isPaused)
  socket.emit('gameState', gameState);

  // Toggle Pausa
  socket.on('togglePause', () => {
    if (!gameState.isActive) return;

    if (gameState.isPaused) {
      // Reanudar
      gameState.isPaused = false;
      startTimer(gameState.currentTeam);
    } else {
      // Pausar
      gameState.isPaused = true;
      stopAllTimers();
    }
    io.emit('gameState', gameState);
  });

  // Administrador crea un nuevo rosco
  socket.on('createRosco', (data) => {
    const { rosco1, rosco2 } = data;

    // Validar que haya al menos 27 palabras por rosco
    if (rosco1.length < LETTERS.length || rosco2.length < LETTERS.length) {
      socket.emit('error', { message: 'Cada rosco debe tener al menos 27 palabras' });
      return;
    }

    // Resetear estado
    gameState.rosco1 = rosco1.slice(0, LETTERS.length).map((item, index) => ({
      letter: LETTERS[index],
      word: item.word.toUpperCase(),
      definition: item.definition,
      type: item.type || 'starts',
      status: 'pending' // pending, correct, wrong, passed
    }));

    gameState.rosco2 = rosco2.slice(0, LETTERS.length).map((item, index) => ({
      letter: LETTERS[index],
      word: item.word.toUpperCase(),
      definition: item.definition,
      type: item.type || 'starts',
      status: 'pending'
    }));

    gameState.isActive = true;
    gameState.currentTeam = 1;
    gameState.team1 = {
      currentLetterIndex: 0,
      correct: 0,
      wrong: 0,
      timeLeft: 300,
      isTimerRunning: false,
      completed: false
    };
    gameState.team2 = {
      currentLetterIndex: 0,
      correct: 0,
      wrong: 0,
      timeLeft: 300,
      isTimerRunning: false,
      completed: false
    };
    gameState.winner = null;
    gameState.isPaused = false;

    stopAllTimers();

    io.emit('roscoCreated', { gameState });

    // Iniciar timer del primer equipo
    startTimer(1);
  });

  // Jugador intenta adivinar
  socket.on('guessWord', (data) => {
    const { team, guess } = data;
    const teamKey = team === 1 ? 'team1' : 'team2';
    const roscoKey = team === 1 ? 'rosco1' : 'rosco2';
    const currentIndex = gameState[teamKey].currentLetterIndex;

    if (!gameState.isActive || gameState.currentTeam !== team || gameState.isPaused) return;
    if (currentIndex >= LETTERS.length) return;

    const currentWord = gameState[roscoKey][currentIndex];
    const normalizedGuess = guess.trim().toUpperCase();

    // Si la palabra ya fue respondida (no debería pasar, pero por seguridad)
    if (currentWord.status === 'correct' || currentWord.status === 'wrong') {
      // Buscar siguiente palabra pendiente
      const nextIndex = findNextPendingIndex(gameState[roscoKey], currentIndex);
      if (nextIndex !== -1) {
        gameState[teamKey].currentLetterIndex = nextIndex;
        io.emit('gameState', gameState);
      } else {
        gameState[teamKey].completed = true;
        checkWinner();
      }
      return;
    }

    if (normalizedGuess === currentWord.word) {
      // Acierto
      currentWord.status = 'correct';
      gameState[teamKey].correct++;

      // Avanzar a la siguiente letra pendiente (circular)
      const nextIndex = findNextPendingIndex(gameState[roscoKey], currentIndex);

      if (nextIndex !== -1) {
        gameState[teamKey].currentLetterIndex = nextIndex;
      }

      io.emit('correctGuess', {
        team,
        letter: currentWord.letter,
        word: currentWord.word,
        gameState
      });

      // Verificar si completó el rosco
      if (nextIndex === -1) {
        gameState[teamKey].completed = true;
        checkWinner();
      }
    } else {
      // Fallo - rebote al otro equipo
      currentWord.status = 'wrong';
      gameState[teamKey].wrong++;

      // Avanzar a la siguiente letra pendiente (circular)
      const nextIndex = findNextPendingIndex(gameState[roscoKey], currentIndex);

      if (nextIndex !== -1) {
        gameState[teamKey].currentLetterIndex = nextIndex;
      }

      io.emit('wrongGuess', {
        team,
        letter: currentWord.letter,
        correctWord: currentWord.word,
        gameState
      });

      if (nextIndex === -1) {
        gameState[teamKey].completed = true;
        checkWinner();
      } else {
        // Cambiar turno al otro equipo
        switchTeam();
        startTimer(gameState.currentTeam);
      }
    }
  });

  // Jugador pasa
  socket.on('passWord', (data) => {
    const { team } = data;
    const teamKey = team === 1 ? 'team1' : 'team2';
    const roscoKey = team === 1 ? 'rosco1' : 'rosco2';
    const currentIndex = gameState[teamKey].currentLetterIndex;

    if (!gameState.isActive || gameState.currentTeam !== team || gameState.isPaused) return;
    if (currentIndex >= LETTERS.length) return;

    const currentWord = gameState[roscoKey][currentIndex];

    // Solo marcar como 'passed' si estaba 'pending'
    if (currentWord.status === 'pending') {
      currentWord.status = 'passed';
    }

    // Avanzar a la siguiente letra pendiente (circular)
    const nextIndex = findNextPendingIndex(gameState[roscoKey], currentIndex);

    if (nextIndex !== -1) {
      gameState[teamKey].currentLetterIndex = nextIndex;
    }

    io.emit('wordPassed', {
      team,
      letter: currentWord.letter,
      gameState
    });

    if (nextIndex === -1) {
      gameState[teamKey].completed = true;
      checkWinner();
    } else {
      // Cambiar turno al otro equipo
      switchTeam();
      startTimer(gameState.currentTeam);
    }
  });

  // Administrador reinicia el juego
  socket.on('resetGame', () => {
    stopAllTimers();
    gameState.isActive = false;
    gameState.rosco1 = [];
    gameState.rosco2 = [];
    gameState.currentTeam = 1;
    gameState.team1 = {
      currentLetterIndex: 0,
      correct: 0,
      wrong: 0,
      timeLeft: 300,
      isTimerRunning: false,
      completed: false
    };
    gameState.team2 = {
      currentLetterIndex: 0,
      correct: 0,
      wrong: 0,
      timeLeft: 300,
      isTimerRunning: false,
      completed: false
    };
    gameState.winner = null;
    gameState.isPaused = false;

    io.emit('gameReset');
  });

  // Solicitar siguiente letra (cuando vuelve a tocar)
  socket.on('nextLetter', (data) => {
    const { team } = data;
    const teamKey = team === 1 ? 'team1' : 'team2';
    const roscoKey = team === 1 ? 'rosco1' : 'rosco2';

    if (!gameState.isActive || gameState.currentTeam !== team) return;

    // Buscar siguiente letra pendiente
    let found = false;
    for (let i = 0; i < LETTERS.length; i++) {
      if (gameState[roscoKey][i].status === 'pending') {
        gameState[teamKey].currentLetterIndex = i;
        found = true;
        break;
      }
    }

    if (!found) {
      gameState[teamKey].completed = true;
      checkWinner();
    } else {
      io.emit('gameState', gameState);
    }
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

// Ruta para servir la aplicación
app.get('*any', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
