import React, {useState, useEffect} from "react";
import retrieveHistoricalData from "../../utilities/forecast"
import { ResponsiveLine } from '@nivo/line'

const MyResponsiveLine = ({ data }) => (
    <ResponsiveLine
        data={data}
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
            legend: 'category',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'value',
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
  const [error, setError] = React.useState(false)

  if(data.length === 0 && error === false){
    retrieveHistoricalData().then((res) => {
      setData(res.data)
      setError(res.error)
    })
  }

  
  return (
    <>
       <div style={{width: "100%", height: "100%"}}>
            <h3>Investment Forecaster</h3>
            <div style={{width: "70%", height: 300}}>
              <h4>Historical Data</h4>
              <MyResponsiveLine data={data}/>
            </div>
            
          </div>
    </>
  );
};

export default ForecasterHome;
