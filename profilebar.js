// JavaScript code for toggling popout buttons
let popoutButtonsVisible = false;

function togglePopoutButtons() {
    const popoutButtonContainer = document.getElementById('popoutButtonContainer');

    if (popoutButtonsVisible) {
        // Hide the popout buttons
        popoutButtonContainer.style.transform = 'scale(0)';
        popoutButtonsVisible = false;
    } else {
        // Show the popout buttons
        popoutButtonContainer.style.transform = 'scale(1)';
        popoutButtonsVisible = true;
    }
}

// Function to create and append popout buttons in a semi-circle
function createPopoutButtons() {
    const popoutButtonContainer = document.getElementById('popoutButtonContainer');
    const numButtons = 3; // Number of buttons
    const radius = 90; // Radius of the semi-circle
    const xOffset = 55; // Adjust this value to control horizontal spacing
    const yOffset = -135; // Adjust this value to shift the buttons upwards

    const animations = []; // Array to store animation IDs

    const buttonRedirects = [
        'popout1.html', // Redirect URL for POPOUT1.png
        'popout2.html', // Redirect URL for POPOUT2.png
        'popout3.html'  // Redirect URL for POPOUT3.png
    ];

    for (let i = 0; i < numButtons; i++) {
        const angle = (Math.PI / numButtons) * i - Math.PI / 2; // Calculate angle for positioning
        const x = xOffset + radius * Math.cos(angle); // X-coordinate (adjusted for horizontal spacing)
        const y = yOffset + radius * Math.sin(angle); // Y-coordinate (adjusted to shift upwards)

        const button = document.createElement('div');
        button.className = 'popout-button';
        button.style.transform = `translate(${x}px, ${y}px)`; // Position along the semi-circle
        button.innerHTML = `<img src="POPOUT${i + 1}.png" alt="Popout Button ${i + 1}">`;
        popoutButtonContainer.appendChild(button);

        // Add click event listener to redirect when clicked
        button.addEventListener('click', () => {
            window.location.href = buttonRedirects[i];
        });

        // Add animation function to the array
        animations.push(() => {
            const scaleFactor = 2.05; // Scale factor for animation
            button.style.transform = `translate(${x}px, ${y}px) scale(${scaleFactor})`;

            // Use setTimeout to reverse the animation after a short delay
            setTimeout(() => {
                button.style.transform = `translate(${x}px, ${y}px) scale(1)`;
            }, 100); // Adjust the delay as needed
        });
    }

    // Set a high z-index for the popout button container
    popoutButtonContainer.style.zIndex = '9999';

    // Function to start the animation loop
    function startAnimationLoop() {
        let currentIndex = 0;

        setInterval(() => {
            animations[currentIndex](); // Execute the animation function
            currentIndex = (currentIndex + 1) % numButtons; // Cycle through buttons
        }, 300); // Adjust the animation speed as needed
    }

    startAnimationLoop();
}

// Hide popout buttons initially
const popoutButtonContainer = document.getElementById('popoutButtonContainer');
popoutButtonContainer.style.transform = 'scale(0)';

createPopoutButtons();

// JavaScript code for handling speech bubble and touch expand
const profilePicture = document.querySelector('.profile-picture');
const topContainer = document.querySelector('.top-container');
let speechBubble;

// Create the speech bubble element
function createSpeechBubble() {
    speechBubble = document.createElement('img');
    speechBubble.src = 'CLICKME.png';
    speechBubble.alt = 'Click Me';
    speechBubble.classList.add('speech-bubble');
    topContainer.appendChild(speechBubble);
}

createSpeechBubble();

profilePicture.addEventListener('touchstart', () => {
    // When you tap on the profile picture, remove the speech bubble permanently
    if (speechBubble) {
        topContainer.removeChild(speechBubble);
        speechBubble = null; // Remove reference to speech bubble
    }
    profilePicture.classList.add('expanded');
});

profilePicture.addEventListener('touchend', () => {
    profilePicture.classList.remove('expanded');
});
