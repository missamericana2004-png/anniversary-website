document.addEventListener('DOMContentLoaded', () => {
    const envelopeContainer = document.querySelector('.envelope-container');
    const openButton = document.getElementById('openEnvelope');
    const pageSections = document.querySelectorAll('.page-section');
    const hearts = document.querySelectorAll('.heart-btn');
    const polaroids = document.querySelectorAll('.polaroid');
    
    // Page IDs 
    const fifthPage = document.getElementById('fifth');
    
    // NEW: Get the proposal page elements
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');


    // Helper function to show a page by id with proper zIndex layering
    function showPage(id) {
        pageSections.forEach((p) => {
            p.classList.remove('active');
            p.style.zIndex = '90'; 
        });

        const target = document.getElementById(id);
        if (target) {
            target.classList.add('active');
            // Set zIndex based on page
            if (id === 'fifth') {
                target.style.zIndex = '1002'; // Letter page
            } else if (id === 'fourth') {
                target.style.zIndex = '1001'; // Memory game
            } else if (id === 'sixth') {
                target.style.zIndex = '1003'; // NEW: Proposal game (highest)
            } else {
                target.style.zIndex = '1000'; // Other pages
            }

            // Scroll to top when opening a page
            target.scrollTop = 0;
        }
    }
    
    // Export showPage globally for inline HTML clicks (like the letter button)
    window.goToPage = showPage;

    // Envelope open -> show second page
    if (openButton && envelopeContainer) {
        openButton.addEventListener('click', () => {
            const homePage = document.getElementById('home');
            if (homePage) {
                homePage.classList.remove('active');
            }

            envelopeContainer.classList.add('is-open');
            showPage('second');
        });
    }

    // Heart buttons click -> go from second page to third
    hearts.forEach(heart => {
        heart.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('third'); 
        });
    });

    // Assign random rotation property for polaroids (Original Logic)
    polaroids.forEach(p => {
        p.style.setProperty('--random', Math.random());
    });

    // Memory Game Polaroids - flip only one at a time (Original Logic)
    const gamePolaroids = document.querySelectorAll('#fourth .polaroid-inner');
    let flippedPolaroid = null;

    gamePolaroids.forEach(p => {
        p.addEventListener('click', () => {
            if (!fifthPage.classList.contains('active')) {
                if (flippedPolaroid && flippedPolaroid !== p) {
                    flippedPolaroid.classList.remove('flipped');
                }
                p.classList.toggle('flipped');
                flippedPolaroid = p.classList.contains('flipped') ? p : null;
            }
        });
    });

    // Next Page Button in 3rd page -> go to 4th page (Original Logic)
    const nextBtn = document.querySelector('#third-next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('fourth');
        });
    }

    // 💌 Button below fourth page -> go to letter page (fifth) (Original Logic)
    const toLetterBtn = document.querySelector('#to-letter-btn');
    if (toLetterBtn) {
        toLetterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showPage('fifth');
        });
    }

    // 💖 Button on letter page -> go to NEW proposal page (sixth)
    const toFinalBtn = document.querySelector('#to-final-btn');
    if (toFinalBtn) {
        toFinalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Navigate to the new proposal game page
            showPage('sixth');
        });
    }
    
    
    // -------------------------------------------------------------------
    // --- NEW: PROPOSAL GAME LOGIC (Moving Button + Celebration) ---
    // -------------------------------------------------------------------
    
    if (noBtn && yesBtn) {
        
        // --- 1. THE FULL-PAGE MOVING NO BUTTON GAME ---
        noBtn.addEventListener('mouseover', function() {
            const buttonWidth = noBtn.offsetWidth;
            const buttonHeight = noBtn.offsetHeight;

            // Get window size dynamically
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            // Calculate safe boundaries (keeping button entirely on screen)
            const maxX = windowWidth - buttonWidth - 20; // 20px buffer from the edge
            const maxY = windowHeight - buttonHeight - 20;

            // Generate random coordinates (0 to Max)
            const newX = Math.random() * maxX + 10;
            const newY = Math.random() * maxY + 10;
            
            // Apply the new position
            noBtn.style.left = `${newX}px`;
            noBtn.style.top = `${newY}px`;

            
            // Fun: Change the text to the teasing emoji
            noBtn.textContent = '😜'; 
            noBtn.style.padding = '8px 15px';
            noBtn.style.fontSize = '24px'; // Increased font size for the emoji
        });

        // The single mouseout listener (Corrected and kept)
        noBtn.addEventListener('mouseout', function() {
             noBtn.textContent = 'No';
             noBtn.style.padding = '10px 20px'; // Reset padding
             noBtn.style.fontSize = '18px';
        });


        // --- 2. THE YES BUTTON CELEBRATION ---
        yesBtn.addEventListener('click', handleYesClick);

        function handleYesClick() {
            // Prevent multiple clicks
            yesBtn.removeEventListener('click', handleYesClick);
            
            const proposalHeading = document.getElementById('proposal-heading');
            const sixthPage = document.getElementById('sixth');

            // 1. Start the Heart Pulse animation
            yesBtn.classList.add('pulsing-yes');
            
            // 2. Hide the No button immediately
            if (noBtn) noBtn.style.display = 'none';

            // 3. Dramatically change the Yes button (Temporarily)
            yesBtn.textContent = 'FOREVER! ❤';
            yesBtn.style.fontSize = '40px';
            yesBtn.style.padding = '30px 70px';
            
            // Re-position the YES button to the center before the final message covers it
            yesBtn.style.top = '50vh'; // Adjusted for better visual centering during pulse
            yesBtn.style.left = '50vw'; 
            yesBtn.style.transform = 'translate(-50%, -50%)';


            // 4. Update the main message after the initial animation flash
            setTimeout(() => {
                // Flash the screen for confetti effect
                document.body.style.transition = 'background-color 0.1s ease';
                // Using a vivid color for the flash
                document.body.style.backgroundColor = '#FFD700'; 
                
                setTimeout(() => {
                    // Reset to the page's background color (#fcebeb from CSS)
                    document.body.style.backgroundColor = '#fcebeb'; 
                    document.body.style.transition = 'background-color 0.5s ease';
                }, 100);

                // FINAL MESSAGE
                
                // Hide the main heading and the pulsing button
                if (proposalHeading) proposalHeading.style.display = 'none';
                yesBtn.style.display = 'none';

                // Inject the new final message container (Matching the structure added in CSS)
                    const finalMessageHTML = `
                    <div class="final-message-container" style="color: #ffffffff; text-align: center; max-width: 90%; padding: 20px; box-sizing: border-box;">
                        
                        <h1 style="font-family: 'Playfair Display', serif; font-size: 3rem; color: #ffffffff;">Happy 2nd Year Anniversary, My Love ❤</h1>
                        
                        <p style="font-family: 'Cinzel', serif; font-size: 1.2rem; line-height: 1.6;">
                            Oh my god I honestly can't believe it's been 2 years, the amount of fights we have seen and yes a little bit of cute moments too🥰. 2 years ago today on the birthday of Virat Kohli, while he was making a century, I was talking to a boy being completely dumbfounded in love, damn so crazy to think what love can do to a person, i mean I started travelling on blue line, can you imagineeee ????? So indeed love makes you crazy, but the good kind of crazy, where you do feel incomplete without a gola in your life 🥹. I mean you can't really blame me cause I was lucky enough to find the bestttttt golaaaa in the whole wide world and yes ikkkk i do fight a lot, i say a lot of shitty things to you but you really are the BEST. I could never imagine even in a billion years that someone would have this amount of patience to deal with me and the fact that someone can like me to this extent that they simply refuse to give up on me, I've never met anyone like that, no matter how hard i try to push you away in my low moments, you always find your way back to me, you're indeed something else. In all honesty these 2 years are all you, you're the glue that keeps us together, without your persistent zeal to make this relationship work, we wouldn't have lasted a day. You keep this relationship alive each day with your tiny efforts, you make me feel loved in ways that I never even thought was possible, you give me the love that i understand, love to me is the patience you have for me. You make me feel like home, you don't make me question if I'm beautiful or smart or anything, you make me feel I'm the best even though I'm not and you're everything and more that i could've ever asked for in a boyfriend, so thankyou for being so amazing and absolutely perfect, I love you ❤🫂
                        </p>
                        
                        <p style="font-family: 'Cinzel', serif; font-size: 1.2rem; line-height: 1.6; font-weight: bold;">
                            Together and Forever. I love you! ❤💋
                        </p>

                    </div>
                `;
                sixthPage.insertAdjacentHTML('beforeend', finalMessageHTML);
            }, 1200); 
        }
    }
});