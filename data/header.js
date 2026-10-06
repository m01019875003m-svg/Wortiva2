/* =====================================================
   WORTIVA - GLOBAL HEADER USER
===================================================== */

async function loadHeaderUser() {

    try {

        if (typeof supabaseClient === "undefined") {
            console.error("supabaseClient غير موجود");
            return;
        }

        const {
            data: {
                session
            }
        } = await supabaseClient.auth.getSession();


        const username =
            document.getElementById("headerUsername");

        const accountText =
            document.getElementById("headerAccountText");

        const avatar =
            document.getElementById("headerAvatar");

        const defaultAvatar =
            document.getElementById("headerAvatarDefault");


        if (!username || !accountText) {
            return;
        }


        /* =========================================
           غير مسجل دخول
        ========================================= */

        if (!session) {

            username.textContent = "حسابي";

            accountText.textContent = "تسجيل الدخول";


            if (avatar) {
                avatar.style.display = "none";
            }


            if (defaultAvatar) {
                defaultAvatar.style.display = "inline";
            }


            return;
        }


        /* =========================================
           المستخدم مسجل دخول
        ========================================= */

        const user =
            session.user;


        const metadata =
            user.user_metadata || {};


        const name =
            metadata.username ||
            metadata.name ||
            "مستخدم Wortiva";


        const avatarUrl =
            metadata.avatar_url ||
            "";


        username.textContent =
            name;


        accountText.textContent =
            "حسابي";


        /* =========================================
           الصورة الشخصية
        ========================================= */

        if (
            avatar &&
            avatarUrl
        ) {

            avatar.src =
                avatarUrl;

            avatar.style.display =
                "block";


            if (defaultAvatar) {
                defaultAvatar.style.display =
                    "none";
            }

        } else {

            if (avatar) {
                avatar.style.display =
                    "none";
            }


            if (defaultAvatar) {
                defaultAvatar.style.display =
                    "inline";
            }

        }

    }

    catch (error) {

        console.error(
            "Header user error:",
            error
        );

    }

}


/* =====================================================
   LOAD HEADER
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadHeaderUser();

    }
);
