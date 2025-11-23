document.addEventListener('DOMContentLoaded', function() {

    // 1. SCORRIMENTO FOTO (Carousel Infinito)
    // ---------------------------------------
    function startCarousel(selector, speed) {
        const container = document.querySelector(selector);
        if (!container) return;

        const slides = container.querySelectorAll('.slide-box');
        
        // Duplichiamo le slide per riempire lo spazio ed evitare "buchi"
        slides.forEach(slide => {
            let clone = slide.cloneNode(true);
            container.appendChild(clone);
        });

        let scrollPos = 0;
        // Punto di reset: metà della larghezza totale
        let resetWidth = container.scrollWidth / 2;

        function animate() {
            scrollPos += speed;
            // Se siamo arrivati a metà (alla fine delle slide originali), resettiamo a 0
            if (scrollPos >= resetWidth) {
                scrollPos = 0;
            }
            container.scrollLeft = scrollPos;
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    // Avvia lo scorrimento delle FOTO
    startCarousel('.carousel-foto', 1); // Velocità 1 (puoi aumentarla)


    // 2. VIDEO WALL (Autoplay Intelligente)
    // -------------------------------------
    const videos = document.querySelectorAll('video');
    
    // Questo "osservatore" controlla se il video è visibile sullo schermo
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.play(); // Se visibile, PLAY
            } else {
                entry.target.pause(); // Se esce dallo schermo, PAUSA
            }
        });
    }, { threshold: 0.25 }); // Basta che il 25% del video sia visibile

    videos.forEach(video => {
        observer.observe(video);
        
        // Cliccando sul video, attivi/disattivi l'audio
        video.parentElement.addEventListener('click', () => {
            video.muted = !video.muted;
        });
    });

document.addEventListener('DOMContentLoaded', () => {
    const videoCards = document.querySelectorAll('.video-card');

    videoCards.forEach(card => {
        const video = card.querySelector('video');
        const playIcon = card.querySelector('.play-icon i');
        
        // 1. Forza l'autoplay silenziato su tutti i video
        video.muted = true;
        // La classe 'muted' aiuta a gestire lo stile CSS se necessario
        card.classList.add('muted'); 

        // Tentativo di autoplay subito dopo che la pagina è pronta
        // Questo è il codice cruciale che bypassa la pausa iniziale (dove possibile)
        video.play().then(() => {
            // Se l'autoplay riesce, rimuoviamo l'icona Play e aggiungiamo l'icona Mute
            card.classList.add('active'); // La classe 'active' nasconde l'icona Play
            playIcon.className = 'fas fa-volume-off'; 

            // Se l'autoplay fallisce (es. su iOS non parte), il video resta in pausa
            // e l'icona Play rimane visibile per l'interazione manuale.
        }).catch(error => {
            // Se l'autoplay fallisce, assicuriamoci che il video sia in pausa 
            // e l'icona Play sia ben visibile per spingere l'utente a cliccare.
            video.pause();
            playIcon.className = 'fas fa-play'; 
            card.classList.remove('active'); // Icona Play visibile
            console.log("Autoplay bloccato. Richiesta interazione utente.");
        });

        // 2. Listener per il Click (Gestione Audio e Autoplay Fallito)
        card.addEventListener('click', () => {
            if (video.paused) {
                // Se il video è in pausa (Autoplay fallito, primo click)
                video.play();
                // Lo lasciamo muto e mostriamo l'icona del volume (muted)
                playIcon.className = 'fas fa-volume-off'; 
                card.classList.add('active', 'muted');
                
            } else {
                // Se il video è in riproduzione (Autoplay riuscito o click precedente)
                video.muted = !video.muted;

                if (video.muted) {
                    playIcon.className = 'fas fa-volume-off';
                    card.classList.add('muted');
                } else {
                    playIcon.className = 'fas fa-volume-up';
                    card.classList.remove('muted');
                }
                
                // Mostra temporaneamente l'icona di mute/unmute
                card.classList.remove('active');
                setTimeout(() => {
                    card.classList.add('active');
                }, 1500); // Rimuove l'icona dopo 1.5 secondi
            }
        });
    });
});
    // 3. MENU MOBILE COMPLETO
    // ------------------------
    const menuBtn = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if(menuBtn && nav) {
        // Toggle del menu al click sull'hamburger
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Previene che il click si propaghi al document
            nav.classList.toggle('active');
            
            // Cambia icona da bars a X
            const icon = menuBtn.querySelector('i');
            if(nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Chiudi il menu quando clicchi su un link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    const icon = menuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });

        // Chiudi il menu quando clicchi fuori
        document.addEventListener('click', (e) => {
            // Controlla se il menu è aperto e se il click NON è sul menu o sull'hamburger
            if (nav.classList.contains('active') && 
                !nav.contains(e.target) && 
                !menuBtn.contains(e.target)) {
                
                nav.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Previeni che i click sul menu stesso lo chiudano
        nav.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }




});