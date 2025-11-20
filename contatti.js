document.addEventListener('DOMContentLoaded', function() {

    // GESTIONE MENU MOBILE (Hamburger)
    // ------------------------------------------
    const menuBtn = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if(menuBtn && nav) {
        // Toggle del menu al click sull'icona hamburger
        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });

        // Chiudi il menu quando si clicca su un link (utile su mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                }
            });
        });
    }
});