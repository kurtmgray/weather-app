import './style.css'

const main = document.querySelector('.main')
const location = document.querySelector('.location')
const date = document.querySelector('.date')
const time = document.querySelector('.time')
const temp = document.querySelector('.temp')
const units = document.querySelector('.units')
const currentIcon = document.querySelector('.current-icon')
const feelsTemp = document.querySelector('.feels-temp')
const humidityPercent = document.querySelector('.humidity-percent')
const precipPercent = document.querySelector('.precip-percent')
const windSpeed = document.querySelector('.wind-speed')
const weekContainer = document.querySelector('.week-container')

const key = 'b869ab386745e03cf8ad4414c45af90f'
let city

// best place to put the following? utility.js module?
let u = 'imperial' // for a toggle between units, used in the API request urls
let speed = 'mph' // set to 'mph' or 'k/ph' depending on u value
let cF = 'F' // set to C or F depending on u value

// UI.js
const updateUI = async (data) => {
    const { cData, wData } = data
    console.log(cData)
    console.log(wData)
    console.log(wData.current.weather[0].main)
    
    main.innerHTML = `<h1>${wData.current.weather[0].main}</h1>`
    
    currentIcon.src = `http://openweathermap.org/img/wn/${wData.current.weather[0].icon}.png` 
    
    // better to declare or do inline?
    const tmp = Math.round(wData.current.temp)
    temp.innerHTML = `<h1>${tmp}º ${cF}</h1>`

    location.innerHTML = `<h3>${cData.name}, ${cData.sys.country}</h3>`
    
    // need to convert date, .dt is unix(?)
    const dat = new Date(cData.dt)
    date.innerHTML = `<p>${dat.toDateString()}</p>`
    time.innerHTML = `<p>${dat.toLocaleTimeString()}</p>`

    // need to develop C or F toggle
    units.innerHTML = ``
        
    const flk = Math.round(wData.current.feels_like)
    feelsTemp.innerHTML = `${flk}º ${cF}`

    humidityPercent.innerHTML = `${wData.current.humidity}%`
    precipPercent.innerHTML = `${wData.daily[0].pop * 100}%`
    windSpeed.innerHTML = `${wData.current.wind_speed} ${speed}`

    // separate fuction for the forLoop on the forecast container, or ok to do in here?
    const daily = wData.daily
    console.log(daily)
    for (let i = 1; i < daily.length; i++) {
        const dayContainer = document.createElement('div')
        dayContainer.classList.add('day-container')
        
        // figure out how to grab day from date
        const dayH3 = document.createElement('h3')
        dayH3.innerText = 'Someday'
        dayContainer.appendChild(dayH3)

        const highH1 = document.createElement('h1')
        highH1.innerText = Math.round(daily[i].temp.max)
        dayContainer.appendChild(highH1)

        const lowP = document.createElement('p')
        lowP.innerText = Math.round(daily[i].temp.min)
        dayContainer.appendChild(lowP)

        const img = document.createElement('img')
        img.src = `http://openweathermap.org/img/wn/${daily[i].weather[0].icon}.png`
        img.max = '100'    
        dayContainer.appendChild(img)

        weekContainer.appendChild(dayContainer)
    }


}

// where does this go?
const getCityName = () => {
    city = document.querySelector('.search-box').value;
}

// API.js?
const getCoordinates = async (city) => {
    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
    const query = `?q=${city}&appid=${key}&units=${u}`
    const response = await fetch(baseUrl + query)
    const cData = await response.json()
    return cData
}

const getWeather = async (lat, lon) => {
    const baseUrl = 'https://api.openweathermap.org/data/2.5/onecall'
    const query = `?lat=${lat}&lon=${lon}&appid=${key}&units=${u}` 
    const response = await fetch(baseUrl + query)
    const wData = await response.json()
    return wData
}

const updateCity = async (city) => {
    const cData = await getCoordinates(city)
    const wData = await getWeather(cData.coord.lat, cData.coord.lon)
    return { cData, wData }
}

// UI.js? something else?
const form = document.querySelector('.search-form')
form.addEventListener('submit', (e) => {
    e.preventDefault()
    getCityName()
    updateCity(city)
        .then(data => updateUI(data))
})