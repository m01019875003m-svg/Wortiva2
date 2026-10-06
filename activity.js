/* =========================
   WORTIVA ACTIVITY SYSTEM
   ========================= */

function getTodayKey() {

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(today.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function getYesterdayKey() {

    const yesterday = new Date();

    yesterday.setDate(
        yesterday.getDate() - 1
    );

    const year =
        yesterday.getFullYear();

    const month =
        String(yesterday.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(yesterday.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function recordActivity() {

    const today =
        getTodayKey();

    const yesterday =
        getYesterdayKey();

    const lastActivity =
        localStorage.getItem(
            "wortivaLastActivity"
        );

    let streak =
        Number(
            localStorage.getItem(
                "wortivaStreak"
            ) || 0
        );


    /* أول نشاط */

    if (!lastActivity) {

        streak = 1;

    }


    /* نشاط في اليوم التالي */

    else if (
        lastActivity === yesterday
    ) {

        streak++;

    }


    /* نشاط في نفس اليوم */

    else if (
        lastActivity === today
    ) {

        // لا نزيد الـ Streak أكثر من مرة في اليوم

    }


    /* انقطاع */

    else {

        streak = 1;

    }


    localStorage.setItem(
        "wortivaStreak",
        String(streak)
    );


    localStorage.setItem(
        "wortivaLastActivity",
        today
    );


    return streak;

}