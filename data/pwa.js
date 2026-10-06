/* =========================================================
   WORTIVA PWA
   Install + Service Worker
   ========================================================= */

(function () {

    "use strict";

    /* ---------------------------------------------------------
       1. Register Service Worker
       --------------------------------------------------------- */

    if ("serviceWorker" in navigator) {

        window.addEventListener("load", function () {

            navigator.serviceWorker
                .register("../sw.js")
                .then(function () {
                    console.log("Wortiva PWA: Service Worker registered");
                })
                .catch(function (error) {
                    console.error(
                        "Wortiva PWA: Service Worker error",
                        error
                    );
                });

        });

    }


    /* ---------------------------------------------------------
       2. Install App
       --------------------------------------------------------- */

    let deferredInstallPrompt = null;


    window.addEventListener(
        "beforeinstallprompt",
        function (event) {

            event.preventDefault();

            deferredInstallPrompt = event;

            const installButton =
                document.getElementById("installAppButton");

            if (installButton) {
                installButton.hidden = false;
            }

        }
    );


    /* ---------------------------------------------------------
       3. Install Button
       --------------------------------------------------------- */

    document.addEventListener(
        "click",
        async function (event) {

            const button =
                event.target.closest("#installAppButton");

            if (!button) return;

            if (!deferredInstallPrompt) return;


            deferredInstallPrompt.prompt();


            try {

                const result =
                    await deferredInstallPrompt.userChoice;

                console.log(
                    "Wortiva install:",
                    result.outcome
                );

            } catch (error) {

                console.error(
                    "Wortiva install error:",
                    error
                );

            }


            deferredInstallPrompt = null;

            button.hidden = true;

        }
    );


    /* ---------------------------------------------------------
       4. App Installed
       --------------------------------------------------------- */

    window.addEventListener(
        "appinstalled",
        function () {

            console.log(
                "Wortiva has been installed successfully."
            );

            const installButton =
                document.getElementById("installAppButton");

            if (installButton) {
                installButton.hidden = true;
            }

        }
    );


    /* ---------------------------------------------------------
       5. Detect Standalone Mode
       --------------------------------------------------------- */

    function isWortivaInstalled() {

        return (
            window.matchMedia &&
            window.matchMedia(
                "(display-mode: standalone)"
            ).matches
        ) || window.navigator.standalone === true;

    }


    if (isWortivaInstalled()) {

        document.documentElement.classList.add(
            "wortiva-app-mode"
        );

    }


})();
