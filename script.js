// Track which choice was made
let firstChoice = null;

// Audio element
let currentAudio = null;

// Color states for different audio stages - using direct colors for SVG
const colorStates = {
    idle: '#888888',        // Neutral gray
    intro: '#ffaa66',       // Warm orange
    firstMake: '#4caf50',   // Green (success)
    firstMiss: '#f44336',   // Red (miss)
    secondMake: '#66bb6a',  // Bright green (win)
    secondMiss: '#d32f2f',  // Dark red (loss)
    win: '#81c784',         // Bright green (victory)
    overtime: '#ffc107',    // Yellow (overtime)
    loss: '#c62828'         // Dark red (loss)
};

// Update crowd colors based on state
function updateCrowdColors(state) {
    // Wait a bit to ensure DOM is ready
    setTimeout(() => {
        const crowdIcons = document.querySelectorAll('.crowd-icon');
        const color = colorStates[state] || colorStates.idle;
        
        if (crowdIcons.length === 0) {
            return;
        }
        
        // Stagger the color changes for a wave effect
        crowdIcons.forEach((icon, index) => {
            const delay = (index % 50) * 0.01; // Stagger over ~0.5 seconds
            setTimeout(() => {
                const svg = icon.querySelector('svg');
                if (svg) {
                    svg.style.color = color;
                }
            }, delay * 1000);
        });
    }, 50);
}

// Play audio function
function playAudio(fileName, callback) {
    // Stop current audio if playing
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    
    // Create new audio element
    currentAudio = new Audio(`sound/${fileName}`);
    
    // Update color state based on audio file (only if not already set by choice handlers)
    if (fileName === 'first_part.wav') {
        updateCrowdColors('intro');
    } else if (fileName === 'a1.wav' || fileName === 'a2.wav') {
        // Colors already updated in handleFirstChoice, so skip here
    } else {
        // Colors will be updated in handleSecondChoice
    }
    
    // Play audio
    currentAudio.play();
    
    // When audio ends, call callback if provided
    if (callback) {
        currentAudio.onended = callback;
    }
}

// Show buttons for first choice
function showFirstChoiceButtons() {
    document.getElementById('firstChoiceButtons').style.display = 'flex';
    document.getElementById('secondChoiceButtons').style.display = 'none';
}

// Show buttons for second choice
function showSecondChoiceButtons() {
    document.getElementById('firstChoiceButtons').style.display = 'none';
    document.getElementById('secondChoiceButtons').style.display = 'flex';
}

// Hide all buttons
function hideAllButtons() {
    document.getElementById('firstChoiceButtons').style.display = 'none';
    document.getElementById('secondChoiceButtons').style.display = 'none';
}

// When user clicks first choice
function handleFirstChoice(choice) {
    firstChoice = choice; // Store: 'make' or 'miss'
    
    // Update colors immediately based on choice
    if (choice === 'make') {
        updateCrowdColors('firstMake');
    } else {
        updateCrowdColors('firstMiss');
    }
    
    // Hide first choice buttons
    hideAllButtons();
    
    if (choice === 'make') {
        playAudio('a1.wav', showSecondChoiceButtons);
    } else {
        playAudio('a2.wav', showSecondChoiceButtons);
    }
}

// When user clicks second choice
function handleSecondChoice(choice) {
    // Hide second choice buttons
    hideAllButtons();
    
    // Determine which ending to play and update final colors based on outcome
    if (firstChoice === 'make' && choice === 'make') {
        updateCrowdColors('win');
        playAudio('b1.wav'); // WIN
    } else if (firstChoice === 'make' && choice === 'miss') {
        updateCrowdColors('overtime');
        playAudio('b2.wav'); // OVERTIME
    } else if (firstChoice === 'miss' && choice === 'make') {
        updateCrowdColors('overtime');
        playAudio('b3.wav'); // OVERTIME
    } else {
        updateCrowdColors('loss');
        playAudio('b4.wav'); // LOSS
    }
}

// Start the audio experience
function startAudio() {
    // Hide play button
    document.getElementById('playButton').style.display = 'none';
    
    // Hide all choice buttons initially
    hideAllButtons();
    
    // Reset first choice
    firstChoice = null;
    
    // Reset colors to neutral
    updateCrowdColors('idle');
    
    // Play setup audio first
    playAudio('first_part.wav', function() {
        // When setup ends, show first choice buttons
        showFirstChoiceButtons();
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Hide all buttons initially
    hideAllButtons();
});

