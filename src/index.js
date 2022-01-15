// index.js
import { updateUI, getCityName } from './view.js'
import { fetchCityData } from './api.js'
import './style.css'

const init = async () => {
    const defaultCity = 'Los Angeles'
    const defaultUnits = 'imperial'
    const data = await fetchCityData(defaultCity, defaultUnits)
    updateUI(data)
    
    const form = document.querySelector('.search-form')
    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const newCity = getCityName()
        const data = await fetchCityData(newCity, defaultUnits)
        updateUI(data)
        form.reset()
    })
    
    const unitBtns = document.querySelector('.unit-buttons')
    unitBtns.addEventListener('click', async (e) => {
        const newUnits = e.target.id
        const currentCity = getCityName()
        const data = await fetchCityData(currentCity, newUnits)
        updateUI(data, newUnits)
    })
}
init()