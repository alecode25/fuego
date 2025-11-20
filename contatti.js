document.addEventListener('DOMContentLoaded', function() {
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

        // NUOVO: Chiudi il menu quando clicchi fuori
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