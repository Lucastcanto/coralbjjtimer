document.addEventListener("DOMContentLoaded", function () {
  // Variables globales
  let workTime = 0;
  let restTime = 0;
  let rounds = 0;
  let currentRound = 0;
  let timer;
  let soundEnabled = true;

  // Elementos del DOM
  const setTimeInput = document.getElementById("setTime");
  const setRestInput = document.getElementById("setRest");
  const setRoundsInput = document.getElementById("setRounds");
  const roundDisplay = document.getElementById("round");
  const commandDisplay = document.getElementById("command");
  const timerDisplay = document.getElementById("timer");
  const startButton = document.getElementById("submit");
  const pauseButton = document.getElementById("pause");
  const resetButton = document.getElementById("reset");
  const soundSwitch = document.getElementById("soundSwitch");

  // Función para convertir segundos a formato de tiempo
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  }

  // Función para reproducir el sonido
  function audioPlayer(sound) {
    if (soundEnabled) {
      let bell = new Audio(
        "https://cdn.pixabay.com/download/audio/2022/03/15/audio_2b08b6e711.mp3"
      );

      if (sound === "start") {
        bell.play(); // Play "start" sound once at the beginning of the first round
      } else if (sound === "restStart") {
        bell.play();
      } else if (sound === "finished") {
        bell.play();
      }

      setTimeout(() => {
        bell = null;
      }, 3000);
    }
  }

  function startTimer() {
    let restSoundPlayed = false; // Flag to track if rest sound has been played

    timer = setInterval(function () {
      if (workTime > 0) {
        workTime--;
        timerDisplay.textContent = formatTime(workTime);
        commandDisplay.textContent = "Lucha!";
      } else if (restTime > 0) {
        restTime--;
        timerDisplay.textContent = formatTime(restTime);

        if (!restSoundPlayed) {
          audioPlayer("restStart"); // Play "rest start" sound once at the beginning of the rest round
          restSoundPlayed = true;
        }

        commandDisplay.textContent = "Descanso!";
      } else {
        currentRound++;
        roundDisplay.textContent = rounds - currentRound;

        if (currentRound < rounds) {
          workTime = parseInt(setTimeInput.value) * 60;
          restTime = parseInt(setRestInput.value);
          restSoundPlayed = false; // Reset the flag for the next round
          audioPlayer("start"); // Play "start" sound at the beginning of each round
        } else {
          clearInterval(timer);
          audioPlayer("finished");
          commandDisplay.textContent = "Finalizado!";
          updateTimerState("finished");
        }
      }
    }, 1000);
    updateTimerState("running");
  }

  // Función para pausar el temporizador
  function pauseTimer() {
    clearInterval(timer);
  }

  // Función para reiniciar los valores de entrada
  function resetValues() {
    clearInterval(timer);
    initializeTimer();
    updateUI();
    location.reload()
  }

  // Función para inicializar y restablecer los valores del temporizador
  function initializeTimer() {
    workTime = parseInt(setTimeInput.value) * 60;
    restTime = parseInt(setRestInput.value);
    rounds = parseInt(setRoundsInput.value);
    currentRound = 0;
    updateUI();
  }

  // Función para actualizar la interfaz de usuario con la configuración actual
  function updateUI() {
    roundDisplay.textContent = rounds - currentRound;
    timerDisplay.textContent = formatTime(workTime);
    commandDisplay.textContent = "Prepárate!";
  }

  // Evento de clic en el botón de inicio
  startButton.addEventListener("click", function () {
    if (!timer) {
      initializeTimer();
      audioPlayer("start"); // Play "start" sound once at the beginning of the first round
      startTimer();
    } else if (currentRound < rounds) {
      startTimer(); // Resume the timer if paused.
    }
  });

  // Evento de clic en el botón de pausa
  pauseButton.addEventListener("click", function () {
    pauseTimer();
  });

  // Evento de clic en el botón de reinicio
  resetButton.addEventListener("click", function () {
    resetValues();
  });

  // Evento de cambio en el interruptor de sonido
  soundSwitch.addEventListener("change", function () {
    soundEnabled = soundSwitch.checked;
  });
});