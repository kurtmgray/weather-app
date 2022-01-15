// API.js
const key = 'b869ab386745e03cf8ad4414c45af90f'

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