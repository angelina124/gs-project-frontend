import React, {useState, useEffect} from "react";
import { retrieveHistoricalData, forecastFuture} from "../../utilities/forecast"
import { ResponsiveLine } from '@nivo/line'

const colors = ["hsl(176, 70%, 80%)", "hsl(380, 70%, 80%)", "hsl(25, 70%, 60%)", 
"hsl(120, 70%, 80%)", "hsl(50, 70%, 70%)", "hsl(210, 70%, 80%)", 
"hsl(300, 70%, 80%)", "hsl(260, 60%, 80%)"]

const MyResponsiveLine = ({ data }) => (
    <ResponsiveLine
        data={data}
        colors={colors}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
        yFormat=" >-.2f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />)


const ForecasterHome = () => {
  const [data, setData] = useState([])
  const [forecastData, setForecastData] = useState([])
  const [error, setError] = React.useState(false)
  const [percentages, setPercentages] = React.useState([0,0,0,0,0,0,0,0])
  const [totalPercent, setTotalPercent] = React.useState(0)
  const [inputErrors, setInputErrors] = React.useState([false, false, false, false, false, false, false, false])
  const [formError, setFormError] = React.useState(false)

  if(data.length === 0 && error === false){
    retrieveHistoricalData().then((res) => {
      setData(res.data)
      setError(res.error)
    })
  }

  const handleSubmit = e => {
    if(totalPercent === 100 && inputErrors.reduce((acc, p) => acc + p) === 0){
      const requestData = {}
      data.forEach((sectorData, i) => {
        requestData[sectorData.category] = percentages[i]
      })
      forecastFuture(requestData).then((res) => {
        console.log("res is " + JSON.stringify(res))
        setForecastData([{...res}])
      })
      
    } else{
      setFormError(true)
    }
  };


  const onPercentageChange = (percent, i) => {
    if(data[i].minimum > percent){
      const temp = [...inputErrors]
      temp[i] = true
      setInputErrors(temp)
    } else if (!isNaN(Number(percent))) {
        const percentagesTemp = percentages
        percentagesTemp[i] = Number(percent)
        setPercentages(percentagesTemp)

        const errorTemp = [...inputErrors]
        errorTemp[i] = false
        setInputErrors(errorTemp)

        setTotalPercent(percentages.reduce((acc, p) => acc + p))
    }
  }
  
  return (
    <>
       <div style={{width: "100%", height: "100%", paddingBottom: 100}}>
          <div style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly"}}>
            <div style={{width: "15%", justifyContent: "space-between", marginTop: 50}}>
                <h3 style={{color: "hsl(210, 70%, 50%)", marginBottom: 20}}>Total: {totalPercent}%</h3>
                <form>
                  <div style={{marginBottom: 10}}>
                  { data.map((sectorData, i) => 
                        (
                          <div style={{display: "flex", flexDirection: "column", marginBottom: 2}}>
                            <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                              <label style={{fontSize: 14, fontWeight: "bold"}}>{sectorData.category}</label>
                                <input 
                                  style={
                                    {
                                      width: 40, 
                                      fontSize: 14, 
                                      height: 25, 
                                      fontFamily: "Helvetica", 
                                      borderColor: sectorData.color,
                                      borderRadius: 2
                                    }}
                                    onChange={((e) => onPercentageChange(e.target.value, i))}
                                  />
                            </div>  
                          {inputErrors[i] === true ? <p style={{color: "red", fontSize: 12}}>Invalid percentage. Percentage must at least {sectorData.minimum}.</p> : <p/>}
                          </div>
                        )
                      )
                    }
                  </div>
                  <button style={
                    {
                      width: "100%", 
                      backgroundColor: "hsl(100, 70%, 80%)", 
                      color: "black", 
                      borderRadius: 10, 
                      borderStyle: "solid", 
                      borderColor:  "hsl(100, 70%, 70%)"
                    }} 
                    type="button"
                    onClick={handleSubmit}
                    >
                    Submit
                  </button>
                </form>
                {totalPercent !== 100 ? <p style={{color: "red", fontSize: 12, paddingTop: 5}}>Invalid distribution. Percentages must sum to 100%</p> : <p/>}
              </div>
              <div style={{display: "flex", flexDirection: "column", width: "70%", justifyContent: "space-between"}}>
                <div style={{height: 350, marginBottom: 50}}>
                  <h4 style={{color: "hsl(210, 70%, 50%)"}}>Historical Data</h4>
                  <MyResponsiveLine data={data}/>
                </div>

                <div style={{height: 350}}>
                  <h4 style={{color: "hsl(210, 70%, 50%)"}}> Forecasted Data</h4>
                  <MyResponsiveLine data={forecastData}/>
                </div>
              </div>
            </div>
          </div>
    </>
  );
};

export default ForecasterHome;
