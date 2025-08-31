class SmartTimer {
  constructor() {
  this.isRunning = false;
  this.isPaused = false;
  this.mode = 'stopwatch'; //'stopwatch' atau 'countdown'
  this.startTime = 0;
  this.elapsedTime = 0;
  this.countdownTime = 0;
  this.interval = null;
              
  this.initializeElements();
  this.attachEventListeners();
  this.updateDisplay();
}

initializeElements() {
  this.timerDisplay = document.getElementById('timerDisplay');
  this.startBtn = document.getElementById('startBtn');
  this.pauseBtn = document.getElementById('pauseBtn');
  this.stopBtn = document.getElementById('stopBtn');
  this.status = document.getElementById('status');
  this.stopwatchBtn = document.getElementById('stopwatchBtn');
  this.countdownBtn = document.getElementById('countdownBtn');
  this.countdownInputs = document.getElementById('countdownInputs');
  this.hoursInput = document.getElementById('hoursInput');
  this.minutesInput = document.getElementById('minutesInput');
  this.secondsInput = document.getElementById('secondsInput');
  this.alertPopup = document.getElementById('alertPopup');
}

attachEventListeners() {
  this.startBtn.addEventListener('click', () => this.start());
  this.pauseBtn.addEventListener('click', () => this.pause());
  this.stopBtn.addEventListener('click', () => this.stop());

  this.stopwatchBtn.addEventListener('click', () => this.switchMode('stopwatch'));
  this.countdownBtn.addEventListener('click', () => this.switchMode('countdown'));

  //validasi inpt
  [this.hoursInput, this.minutesInput, this.secondsInput].forEach(input => {
    input.addEventListener('input', () => this.validateInput(input));
  });
}

validateInput(input) {
  let value = parseInt(input.value);
  let max = input.id === 'hoursInput' ? 23 : 59;

  if (isNaN(value) || value < 0) {
    input.value = 0;
  } else if (value > max) {
    input.value = max;
  }
}

switchMode(newMode) {
  this.stop();
  this.mode = newMode;

  if (newMode === 'stopwatch') {
    this.stopwatchBtn.classList.add('active');
    this.countdownBtn.classList.remove('active');
    this.countdownInputs.classList.remove('active');
    this.elapsedTime = 0;
  } else {
    this.countdownBtn.classList.add('active');
    this.stopwatchBtn.classList.remove('active');
    this.countdownInputs.classList.add('active');
  }

  this.updateDisplay();
  this.updateStatus('Ready to Start');
}

start() {
  if (this.mode === 'countdown') {
  if (!this.isPaused) {
    //set countdown dari input
    const hours = parseInt(this.hoursInput.value) || 0;
    const minutes = parseInt(this.minutesInput.value) || 0;
    const seconds = parseInt(this.secondsInput.value) || 0;

    this.countdownTime = (hours * 3600 + minutes * 60 + seconds) * 1000;

    if (this.countdownTime <= 0) {
      alert('Set your time first');
      return;
    }
  }
  } else {
  //stopwatch
  if (!this.isPaused) {
    this.elapsedTime = 0;
  }
  }   
  this.isRunning = true;
  this.isPaused = false;
  this.startTime = Date.now();

  this.startBtn.disabled = true;
  this.pauseBtn.disabled = false;
  this.stopBtn.disabled = false;

  this.updateStatus('Runnin...');
  this.startInterval();
}

pause() {
  if (this.isRunning) {
    this.isRunning = false;
    this.isPaused = true;

    if (this.mode === 'stopwatch') {
      this.elapsedTime += Date.now() - this.startTime;
    } else {
      this.countdownTime -= Date.now() - this.startTime;
      this.countdownTime -= Date.now() - this.startTime;
      this.countdownTime -= Date.now() - this.startTime;
    }

    this.startBtn.disabled = false;
    this.pauseBtn.disabled = true;
    this.updateStatus('Paused');
    this.stopInterval();
  }
}

stop() {
  this.isRunning = false;
  this.isPaused = false;
  this.elapsedTime = 0;
  this.countdownTime = 0;
  
  this.startBtn.disabled = false;
  this.pauseBtn.disabled = true;
  this.stopBtn.disabled = true;
  
  this.updateStatus('Ready to start');
  this.stopInterval();
  this.updateDisplay();
}

startInterval() {
  this.interval = setInterval(() => {
    this.updateDisplay();
    
    if (this.mode === 'countdown') {
      const currentTime = Date.now();
      const remaining = this.countdownTime - (currentTime - this.startTime);
      
      if (remaining <= 0) {
        this.countdownFinished();
      }
    }
  }, 10); //setiap 10ms update
}

stopInterval() {
  if (this.interval) {
    clearInterval(this.interval);
    this.interval = null;
  }
}

countdownFinished() {
    this.stop();
    this.updateStatus('Times out');
    this.showAlert();
    this.playAlertSound();
}

updateDisplay() {
  let timeToDisplay;
  
  if (this.mode === 'stopwatch') {
    if (this.isRunning) {
      timeToDisplay = this.elapsedTime + (Date.now() - this.startTime);
    } else {
      timeToDisplay = this.elapsedTime;
    }
  } else {
    //countdown
    if (this.isRunning) {
      timeToDisplay = Math.max(0, this.countdownTime - (Date.now() - this.startTime));
    } else if (this.isPaused) {
      timeToDisplay = Math.max(0, this.countdownTime);
    } else {
      //waktu dari input ditampilkan
      const hours = parseInt(this.hoursInput.value) || 0;
      const minutes = parseInt(this.minutesInput.value) || 0;
      const seconds = parseInt(this.secondsInput.value) || 0;
      timeToDisplay = (hours * 3600 + minutes * 60 + seconds) * 1000;
    }
  }
  this.timerDisplay.textContent = this.formatTime(timeToDisplay);
}

formatTime(milliseconds) {
  const totalSeconds = Math.floor(Math.abs(milliseconds) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const ms = Math.floor((Math.abs(milliseconds) % 1000) / 10);

  if (this.mode === 'stopwatch') {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  } else {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

updateStatus(message) {
  this.status.textContent = message;
}

showAlert() {
  this.alertPopup.style.display = 'flex';
}

playAlertSound() {
//bunyi pakai web audio API
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.3; 

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5); //bunyi 0.5 detik

      //bunyi ke2
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 1000;
        gain2.gain.value = 0.3;
        osc2.start();
        osc2.stop(audioContext.currentTime + 0.5);
      }, 600);

    } catch (error) {
    console.log('Audio tidak tersedia');
    }
  }
}

// Initialize timer ketika halaman dimuat
let smartTimer;
        
window.addEventListener('DOMContentLoaded', () => {
  smartTimer = new SmartTimer();

  // Update display setiap detik untuk countdown input
  setInterval(() => {
    if (!smartTimer.isRunning && !smartTimer.isPaused && smartTimer.mode === 'countdown') {
        smartTimer.updateDisplay();
    }
  }, 1000);
});

function closeAlert() {
  document.getElementById('alertPopup').style.display = 'none';
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    if (smartTimer.isRunning) {
        smartTimer.pause();
    } else {
        smartTimer.start();
    }
  } else if (e.code === 'Escape') {
    smartTimer.stop();
  }
});