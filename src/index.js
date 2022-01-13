import './style.css'

const description = document.querySelector('.description')
const city = document.querySelector('.city')
const date = document.querySelector('.date')
const time = document.querySelector('.time')
const temp = document.querySelector('.temp')
const units = document.querySelector('.units')
const timeIcon = document.querySelector('.time-icon')
const description = document.querySelector('.description')
const description = document.querySelector('.description')




// user interface




// data fetching
const key = 'b869ab386745e03cf8ad4414c45af90f'
let city

const getCityName = () => {
    city = document.querySelector('.search-box').value;
}

const getCoordinates = async (city) => {
    const baseUrl = 'https://api.openweathermap.org/data/2.5/weather'
    const query = `?q=${city}&appid=${key}`
    const response = await fetch(baseUrl + query)
    const cData = await response.json()
    return cData
}

const getWeather = async (lat, lon) => {
    const baseUrl = 'https://api.openweathermap.org/data/2.5/onecall'
    const query = `?lat=${lat}&lon=${lon}&appid=${key}` 
    const response = await fetch(baseUrl + query)
    const wData = await response.json()
    return wData
}

const updateCity = async (city) => {
    const coords = await getCoordinates(city)
    const weather = await getWeather(coords.coord.lat, coords.coord.lon)
    console.log(weather)
    return weather
}

const form = document.querySelector('.search-form')
form.addEventListener('submit', (e) => {
    e.preventDefault()
    getCityName()
    updateCity(city)
})