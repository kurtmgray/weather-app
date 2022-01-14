import './style.css'

const main = document.querySelector('.main')
const location = document.querySelector('.location')
const date = document.querySelector('.date')
const time = document.querySelector('.time')
const temp = document.querySelector('.temp')
const unitBtns = document.querySelector('.unit-buttons')
const currentIcon = document.querySelector('.current-icon')
const feelsTemp = document.querySelector('.feels-temp')
const humidityPercent = document.querySelector('.humidity-percent')
const precipPercent = document.querySelector('.precip-percent')
const windSpeed = document.querySelector('.wind-speed')
const weekContainer = document.querySelector('.week-container')

const key = 'b869ab386745e03cf8ad4414c45af90f'
const defaultCity = 'Los Angeles'
const defaultUnits = 'imperial'
let currentCity = defaultCity

const updateUI = async (data) => {
    const { cData, wData, units } = data
    console.log(cData)
    console.log(wData)
    
    main.innerHTML = `<h1>${wData.current.weather[0].main}</h1>`
    
    currentIcon.src = `http://openweathermap.org/img/wn/${wData.current.weather[0].icon}.png` 
    
    const roundedTemp = Math.round(wData.current.temp)
    temp.innerHTML = `<h1>${roundedTemp}º ${units === 'imperial' ? 'F' : 'C'}</h1>` // use ternary and change c/f inline

    location.innerHTML = `<h3>${cData.name}, ${cData.sys.country}</h3>`
    
    const dat = new Date(cData.dt * 1000)

    date.innerHTML = `<p>${dat.toDateString()}</p>`
    time.innerHTML = `<p>${dat.toLocaleTimeString()}</p>`

    unitBtns.innerHTML = `
        <button class="units-toggle-c" id="metric">C</button>
        <button class="units-toggle-f" id="imperial">F</button>
    `
        
    const flk = Math.round(wData.current.feels_like)
    feelsTemp.innerHTML = `${flk}º ${units === 'imperial' ? 'F' : 'C'}`

    humidityPercent.innerHTML = `${wData.current.humidity}%`
    precipPercent.innerHTML = `${wData.daily[0].pop * 100}%`
    
    const roundWind = Math.round(wData.current.wind_speed)
    windSpeed.innerHTML = `${roundWind} ${units === 'imperial' ? 'mph' : 'k/ph'}`

    weekContainer.innerHTML = ''

    const daily = wData.daily
    console.log(daily)
    
    for (let i = 1; i < daily.length; i++) {
        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const forecastTimestamp = new Date(daily[i].dt * 1000)
        const dayOfWeek = days[forecastTimestamp.getDay()]

        const dayContainer = document.createElement('div')
        dayContainer.classList.add('day-container')
        
        // figure out how to grab day from date
        const dayH3 = document.createElement('h3')
        dayH3.innerText = `${dayOfWeek}`
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

// where does this go? view 
const getCityName = () => {
    const city = document.querySelector('.search-box').value;
    currentCity = city
    return city
}

// API.js
const getCoordinates = async (city, units) => {
    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
    const query = `?q=${city}&appid=${key}&units=${units}`
    const response = await fetch(baseUrl + query)
    const cData = await response.json()
    return cData
}

const getWeather = async (lat, lon, units) => {
    const baseUrl = 'https://api.openweathermap.org/data/2.5/onecall'
    const query = `?lat=${lat}&lon=${lon}&appid=${key}&units=${units}` 
    const response = await fetch(baseUrl + query)
    const wData = await response.json()
    return wData
}

const fetchCityData = async (city, units) => {
    const cData = await getCoordinates(city, units)
    const wData = await getWeather(cData.coord.lat, cData.coord.lon, units)
    return { cData, wData, units }
}

export { fetchCityData }

// index.js
const init = async () => {
    console.log(defaultUnits)
    const data = await fetchCityData(defaultCity, defaultUnits)
    updateUI(data)
    
    const form = document.querySelector('.search-form')
    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const city = getCityName()
        const data = await fetchCityData(city, defaultUnits)
        updateUI(data)
        form.reset()
    })
    
    unitBtns.addEventListener('click', async (e) => {
        const units = e.target.id
        const data = await fetchCityData(currentCity, units)
        updateUI(data, units)
    })
}
init()