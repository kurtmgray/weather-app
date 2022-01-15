// view.js 
const main = document.querySelector('.main')
const currentIcon = document.querySelector('.current-icon')
const temp = document.querySelector('.temp')
const unitBtns = document.querySelector('.unit-buttons')
const location = document.querySelector('.location')
const date = document.querySelector('.date')
const time = document.querySelector('.time')

const feelsTemp = document.querySelector('.feels-temp')
const humidityPercent = document.querySelector('.humidity-percent')
const precipPercent = document.querySelector('.precip-percent')
const windSpeed = document.querySelector('.wind-speed')
const weekContainer = document.querySelector('.week-container')

let currentCity

const updateUI = async (data) => {
    const { cData, wData, units } = data
    currentCity = cData.name
    
    console.log(cData)
    console.log(wData)
    
    main.innerHTML = `<h1>${wData.current.weather[0].main}</h1>`
    
    currentIcon.src = `http://openweathermap.org/img/wn/${wData.current.weather[0].icon}.png` 
    
    const roundedTemp = Math.round(wData.current.temp)
    temp.innerHTML = `<h1>${roundedTemp}º ${units === 'imperial' ? 'F' : 'C'}</h1>`

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
        
        const dayH3 = document.createElement('h3')
        dayH3.innerText = `${dayOfWeek}`
        dayContainer.appendChild(dayH3)

        const roundedHiTemp = Math.round(daily[i].temp.max)
        const highH1 = document.createElement('h1')
        highH1.innerText = `${roundedHiTemp}º ${units === 'imperial' ? 'F' : 'C'}`
        dayContainer.appendChild(highH1)

        const roundedLoTemp = Math.round(daily[i].temp.min)
        const lowP = document.createElement('p')
        lowP.innerText = `${roundedLoTemp}º ${units === 'imperial' ? 'F' : 'C'}`
        dayContainer.appendChild(lowP)

        const img = document.createElement('img')
        img.src = `http://openweathermap.org/img/wn/${daily[i].weather[0].icon}.png`
        img.max = '100'    
        dayContainer.appendChild(img)

        weekContainer.appendChild(dayContainer)
    }
}

const getCityName = () => {
    const newCity = document.querySelector('.search-box').value;
    if (newCity === '') {
        return currentCity
    } else {
        return newCity
    }   
}

export { updateUI, getCityName }