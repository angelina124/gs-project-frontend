import axios from 'axios'

const API_URL = 'http://localhost:8080'
const forecastPath = "/api/v1/forecast"

const colors = ["hsl(176, 70%, 50%)", "hsl(336, 70%, 50%)", "hsl(25, 70%, 50%)", 
"hsl(120, 70%, 50%)", "hsl(50, 70%, 50%)", "hsl(210, 70%, 50%)", 
"hsl(300, 70%, 50%)", "hsl(280, 70%, 50%)"]

const retrieveHistoricalData = () => {
    return axios.get(`${API_URL}${forecastPath}`).then((res) => {
        if(!res.error){
            const data = res.data.map((sectorData, j) => ({
                data: sectorData.data.map((y, i) => ({x: `${i}`, y})),
                id: sectorData.category,
                color: colors[j]
            }))
            console.log(data)
            return {...res, data}
        }
        return res;
    })
}

export default retrieveHistoricalData