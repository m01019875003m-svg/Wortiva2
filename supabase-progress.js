/* =========================================================
   WORTIVA - SUPABASE PROGRESS SYSTEM
   ========================================================= */


/* =========================================================
   1. GET SESSION
========================================================= */

async function getWortivaSession() {

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Supabase session error:",
                error
            );

            return null;

        }


        return data.session || null;

    }

    catch (error) {

        console.error(
            "Session failed:",
            error
        );

        return null;

    }

}



/* =========================================================
   2. SAFE JSON
========================================================= */

function getLocalArray(key) {

    try {

        const value =
            JSON.parse(
                localStorage.getItem(key) || "[]"
            );


        return Array.isArray(value)
            ? value
            : [];

    }

    catch {

        return [];

    }

}



/* =========================================================
   3. DATE -> INT8
========================================================= */

function dateToTimestamp(dateString) {

    if (!dateString) {

        return null;

    }


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return null;

    }


    return date.getTime();

}



/* =========================================================
   4. INT8 -> DATE
========================================================= */

function timestampToDate(timestamp) {

    if (
        timestamp === null ||
        timestamp === undefined ||
        timestamp === ""
    ) {

        return "";

    }


    const number =
        Number(timestamp);


    if (
        Number.isNaN(number)
    ) {

        return "";

    }


    const date =
        new Date(number);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;

}



/* =========================================================
   5. LOAD PROGRESS FROM SUPABASE
========================================================= */

async function loadProgressFromSupabase() {

    try {

        const session =
            await getWortivaSession();


        if (!session) {

            console.log(
                "No logged-in user. Using local progress."
            );

            return;

        }


        const userId =
            session.user.id;


        /*
           مهم:
           لا نستخدم .single()
           لأن المستخدم الجديد قد لا يكون له سجل.
        */

        const {
            data,
            error
        } =
            await supabaseClient
                .from("user_progress")
                .select("*")
                .eq(
                    "user_id",
                    userId
                )
                .limit(1);


        if (error) {

            console.error(
                "Load progress error:",
                error
            );

            return;

        }


        /* =============================================
           المستخدم جديد
        ============================================= */

        if (
            !data ||
            data.length === 0
        ) {

            console.log(
                "No progress found. Creating initial progress..."
            );


            await createInitialProgress(
                userId
            );


            return;

        }


        const progress =
            data[0];


        /* =============================================
           XP
        ============================================= */

        localStorage.setItem(
            "wortivaXP",
            String(
                progress.xp ?? 0
            )
        );


        /* =============================================
           STREAK
        ============================================= */

        localStorage.setItem(
            "wortivaStreak",
            String(
                progress.streak ?? 0
            )
        );


        /* =============================================
           LAST ACTIVITY
        ============================================= */

        const lastActivity =
            timestampToDate(
                progress.last_activity
            );


        localStorage.setItem(
            "wortivaLastActivity",
            lastActivity
        );


        /* =============================================
           KNOWN WORDS
        ============================================= */

        localStorage.setItem(
            "wortivaKnownWords",
            JSON.stringify(
                Array.isArray(
                    progress.known_words
                )
                    ? progress.known_words
                    : []
            )
        );


        /* =============================================
           REVIEW WORDS
        ============================================= */

        localStorage.setItem(
            "wortivaReviewWords",
            JSON.stringify(
                Array.isArray(
                    progress.review_words
                )
                    ? progress.review_words
                    : []
            )
        );


        console.log(
            "Wortiva progress loaded from Supabase."
        );

    }

    catch (error) {

        console.error(
            "Progress loading failed:",
            error
        );

    }

}



/* =========================================================
   6. CREATE INITIAL PROGRESS
========================================================= */

async function createInitialProgress(
    userId
) {

    try {

        const knownWords =
            getLocalArray(
                "wortivaKnownWords"
            );


        const reviewWords =
            getLocalArray(
                "wortivaReviewWords"
            );


        const lastActivity =
            localStorage.getItem(
                "wortivaLastActivity"
            ) || "";


        const progress = {

            user_id:
                userId,


            xp:
                Number(
                    localStorage.getItem(
                        "wortivaXP"
                    ) || 0
                ),


            streak:
                Number(
                    localStorage.getItem(
                        "wortivaStreak"
                    ) || 0
                ),


            last_activity:
                dateToTimestamp(
                    lastActivity
                ),


            known_words:
                knownWords,


            review_words:
                reviewWords,


            updated_at:
                new Date().toISOString()

        };


        const {
            error
        } =
            await supabaseClient
                .from("user_progress")
                .insert(
                    progress
                );


        if (error) {

            console.error(
                "Create progress error:",
                error
            );

            return false;

        }


        console.log(
            "Initial progress created successfully."
        );


        return true;

    }

    catch (error) {

        console.error(
            "Create progress failed:",
            error
        );

        return false;

    }

}



/* =========================================================
   7. SAVE PROGRESS
========================================================= */

async function saveProgressToSupabase() {

    try {

        const session =
            await getWortivaSession();


        if (!session) {

            console.log(
                "No logged-in user. Progress remains local."
            );

            return false;

        }


        const userId =
            session.user.id;


        const knownWords =
            getLocalArray(
                "wortivaKnownWords"
            );


        const reviewWords =
            getLocalArray(
                "wortivaReviewWords"
            );


        const lastActivity =
            localStorage.getItem(
                "wortivaLastActivity"
            ) || "";


        const progress = {

            user_id:
                userId,


            xp:
                Number(
                    localStorage.getItem(
                        "wortivaXP"
                    ) || 0
                ),


            streak:
                Number(
                    localStorage.getItem(
                        "wortivaStreak"
                    ) || 0
                ),


            last_activity:
                dateToTimestamp(
                    lastActivity
                ),


            known_words:
                knownWords,


            review_words:
                reviewWords,


            updated_at:
                new Date().toISOString()

        };


        const {
            error
        } =
            await supabaseClient
                .from("user_progress")
                .upsert(
                    progress,
                    {
                        onConflict:
                            "user_id"
                    }
                );


        if (error) {

            console.error(
                "Save progress error:",
                error
            );

            return false;

        }


        console.log(
            "Wortiva progress saved to Supabase."
        );


        return true;

    }

    catch (error) {

        console.error(
            "Progress saving failed:",
            error
        );

        return false;

    }

}



/* =========================================================
   8. LOAD AFTER PAGE STARTS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        await loadProgressFromSupabase();

    }
);



/* =========================================================
   9. SAVE WHEN PAGE CLOSES
========================================================= */

window.addEventListener(
    "beforeunload",
    function () {

        /*
           ملاحظة:
           beforeunload ليس مضمونًا مع async requests،
           لذلك لا نعتمد عليه وحده.
        */

        saveProgressToSupabase();

    }
);