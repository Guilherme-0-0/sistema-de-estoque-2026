document.addEventListener("DOMContentLoaded", () => {
        const logoAtena = document.querySelector(".logo_atena");
            const logoCELC = document.querySelector(".logo_celc");
                const intro = document.querySelector(".intro");
                    const home = document.querySelector(".home");

                        // Após a animação inicial, mover as logos
                            setTimeout(() => {
                                    logoAtena.classList.add("final");
                                            logoCELC.classList.add("final");
                                                }, 3500);

                                                    // Exibir a tela principal
                                                        setTimeout(() => {
                                                                intro.style.opacity = "0";
                                                                        setTimeout(() => {
                                                                                    intro.style.display = "none";
                                                                                                home.classList.remove("oculto");
                                                                                                            home.classList.add("visivel");
                                                                                                                    }, 800);
                                                                                                                        }, 5000);
                                                                                                                        });
})