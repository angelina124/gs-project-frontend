import axios from 'axios'

const API_URL = 'http://localhost:8080'
const forecastPath = "/api/v1/forecast"

const colors = ["hsl(176, 70%, 80%)", "hsl(380, 70%, 80%)", "hsl(25, 70%, 60%)", 
"hsl(120, 70%, 80%)", "hsl(50, 70%, 70%)", "hsl(210, 70%, 80%)", 
"hsl(300, 70%, 80%)", "hsl(290, 60%, 70%)"]

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

export default retrieveHistoricalData