import axios from 'axios'

const API_URL = 'http://localhost:8080'
const forecastPath = "/api/v1/forecast"

const colors = ["hsl(176, 70%, 80%)", "hsl(380, 70%, 80%)", "hsl(25, 70%, 60%)", 
"hsl(120, 70%, 80%)", "hsl(50, 70%, 70%)", "hsl(210, 70%, 80%)", 
"hsl(300, 70%, 80%)", "hsl(260, 60%, 80%)"]

const retrieveHistoricalData = () => {
    return axios.get(`${API_URL}${forecastPath}`).then((res) => {
        if(!res.error){
            const data = res.data.map((sectorData, j) => ({
                ...sectorData,
                data: sectorData.data.map((y, i) => ({x: `${i}`, y})),
                id: sectorData.category,
                color: colors[j]
            }))
            return {...res, data}
        }
        return res;
    })
}

const forecastFuture = (data) => {
    return axios.post(`${API_URL}${forecastPath}`, data)
        .then((res) => {
            console.log(res)
            const data = res.data.response.map
                ((y, i) => ({x: `${i}`, y}))
            return {...res, data, id: "forecast", color: colors[0]}
        })
}

export  { retrieveHistoricalData, forecastFuture}