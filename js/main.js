"use strict"
const day = document.querySelector(".todayWeather .today");
const month = document.querySelector(".todayWeather .calender");
const apiKey = "5718fcb91cb04dbea1350318241112";
let conteryInput = document.querySelector(".contery");
const find = document.querySelector("#find");
let currentLocation = document.querySelector(".location");
let currentTemp = document.querySelector("#temp");

let windSpead = document.querySelector(".windSpead");
let windDir = document.querySelector(".windDir");
let rainChance = document.querySelector(".rainChance");

let secondDay = document.querySelector(".secondDay");
let thirdDay = document.querySelector(".thirdDay");
let iconImg = document.getElementById("iconImg");
let atmosphere = document.querySelector(".atmosphere");
let atmosphere2 = document.querySelector(".atmosphere2");
let atmosphere3 = document.querySelector(".atmosphere3");

let secondDayMaxTemp = document.querySelector(".secondDayMaxTemp");
let thirdDayMaxTemp = document.querySelector(".thirdDayMaxTemp");
let secondDayMinTemp = document.querySelector(".secondDayMinTemp");
let thirdDayMinTemp = document.querySelector(".thirdDayMinTemp");

let iconImg2 = document.querySelector(".temprature2 img");
let iconImg3 = document.querySelector(".temprature3 img");

let findBtn = document.getElementById("find");
let searchBox = document.querySelector(".contery");
let feedback = document.querySelector(".feedback");
const now = new Date();

function direction(dir) {
    let dirWind;
    switch (dir) {
        case "E":
            dirWind = "East"
            break;
        case "W":
            dirWind = "West"
            break;
        case "N":
            dirWind = "North"
            break;

        case "S":
            dirWind = "South"
            break;
    }
    return dirWind;
}


// get the imediately Day
const dayOfWeek = (date) => date.toLocaleDateString(undefined, {
    weekday: "long",
})
// get the imediately Month and numeric day
const dayOfMonth = (date) => date.toLocaleDateString(undefined, {
    month: "long",
    day: "2-digit",
})

day.innerHTML = `${dayOfWeek(now)}`;
month.innerHTML = `${dayOfMonth(now)}`;

const addDayes = (date, period) => {
    now.setDate(date.getDate() + period);
}

function setDate(date) {
    let dayly = date.getDate();
    let monthly = (date.getMonth()) + 1;
    let year = date.getFullYear();

    let fullDate = `${year}-${monthly}-${dayly}`;
    return fullDate;
}
// get Today Date
let today = setDate(now);
// get tomorrow Day
addDayes(now, 1);
let tomorrow = setDate(now);
secondDay.innerHTML = `${dayOfWeek(now)}`

// get After Tomorrow
addDayes(now, 1);
let afterTomorrow = setDate(now);
thirdDay.innerHTML = `${dayOfWeek(now)}`

function getError(error) {
    alert(error);
}




async function getData(lat, long, day) {
    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=5718fcb91cb04dbea1350318241112&q=${lat},${long}&wind100kph=yes&dt=${day}`);
    // console.log(res);

    if (res.ok) {
        const data = await res.json();
        return data;

    } else if (res.status == 400) {
        alert("No location found matching that location");
    } else if (res.status > 400 && res.status <= 403) {
        alert("That is invalid request");
        console.log(res.status);
    } else {
        throw new Error("the error is", res.statusText);
    }

}


async function getSearchData(city, day) {
    try {
        const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=5718fcb91cb04dbea1350318241112&q=${city}&aqi=yes&dt=${day}`);
        return res;

    } catch (error) {
        alert(error);
    }
}

function getTodayData(res) {
    currentLocation.innerHTML = res.location.name;
    currentTemp.innerHTML = res.current.temp_c;
    iconImg.setAttribute("src", `${res.current.condition.icon}`);
    atmosphere.innerHTML = res.current.condition.text;
    windSpead.innerHTML = res.current.wind_kph;
    rainChance.innerHTML = res.forecast.forecastday[0].day.daily_chance_of_rain;

    let dir = res.current.wind_dir;
    if (res.current.wind_dir == "E" ||
        res.current.wind_dir == "W" ||
        res.current.wind_dir == "N" ||
        res.current.wind_dir == "S"
    ) {
        windDir.innerHTML = direction(dir);

    } else {
        windDir.innerHTML = res.current.wind_dir;

    }

}
function getSecondDayData(res) {
    iconImg2.setAttribute("src", `${res.current.condition.icon}`);
    secondDayMaxTemp.innerHTML = res.forecast.forecastday[0].day.maxtemp_c;
    secondDayMinTemp.innerHTML = res.forecast.forecastday[0].day.mintemp_c;
    atmosphere2.innerHTML = res.current.condition.text;
}
function getThirdDayData(res) {
    iconImg3.setAttribute("src", res.current.condition.icon);
    thirdDayMaxTemp.innerHTML = res.forecast.forecastday[0].day.maxtemp_c;
    thirdDayMinTemp.innerHTML = res.forecast.forecastday[0].day.mintemp_c;
    atmosphere3.innerHTML = res.current.condition.text;
}


async function getSecondForecastWeather(localPosition) {
    const res = await getData(
        localPosition.coords.latitude,
        localPosition.coords.longitude,
        tomorrow
    );
    // console.log(res);
    getSecondDayData(res);


}


async function getThirdForecastWeather(position) {
    const res = await getData(
        position.coords.latitude,
        position.coords.longitude,
        afterTomorrow
    );
    // console.log(res);
    getThirdDayData(res);


}

async function getDayWether(position) {
    try {
        const res = await getData(
            position.coords.latitude,
            position.coords.longitude,
            today
        );

        getTodayData(res);
        await getSecondForecastWeather(position)

        await getThirdForecastWeather(position);
    } catch (error) {
        alert(error)
    }


}


(async () => {
    navigator.geolocation.getCurrentPosition(getDayWether, getError);
})();

function validInput(input) {
    let regex = /^[A-Z|a-z]{3,10} ?[A-Z|a-z]{0,10}$/;
    let isValid = regex.test(input.value);
    if (isValid) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        input.nextElementSibling.classList.replace("d-block", "d-none");

    } else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        input.nextElementSibling.classList.replace("d-none", "d-block");
    }
    return isValid;
}

let city;

async function getSecondaySearchWether() {
    const res = await getSearchData(city, tomorrow);
    if (res.ok) {
        const data = await res.json();

        getSecondDayData(data);

    } else if (res.status == 400) {
        alert("No location found matching that location");

    } else if (res.status > 400 && res.status <= 403) {
        alert("That is invalid request");

    }


    // console.log(res);
}

async function getTodaySearchWether() {
    const res = await getSearchData(city);
    if (res.ok) {
        const data = await res.json();

        getTodayData(data);
        await getSecondaySearchWether();
        await getThirdaySearchWether();

    } else if (res.status == 400) {
        alert("No location found matching that location");

    } else if (res.status > 400 && res.status <= 403) {
        alert("That is invalid request");

    }

    // console.log(res);
}

async function getThirdaySearchWether() {
    const res = await getSearchData(city, afterTomorrow);
    if (res.ok) {
        const data = await res.json();

        getThirdDayData(data);

    } else if (res.status == 400) {
        alert("No location found matching that location");

    } else if (res.status > 400 && res.status <= 403) {
        alert("That is invalid request");

    }
    // console.log(res);
}

searchBox.addEventListener("input", function (e) {
    const input = e.target;
    feedback.classList.replace("d-block", "d-none");
    validInput(input);
})


find.addEventListener("click", () => {
    if (validInput(searchBox)) {
        city = searchBox.value;
        // getSearchData(city);


        

        getTodaySearchWether();

       
    } else {
        feedback.classList.replace("d-none", "d-block");
        feedback.classList.add("text-danger");
        feedback.classList.add("text-bolder");
        feedback.classList.add("fs-3");
        feedback.classList.remove("text-success");
        feedback.innerHTML = "The locattion Must be characters and if You want you can add Just ONE Space";

    }
});




