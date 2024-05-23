import * as React from "react";
import styled from "@emotion/styled";
import { ThunderstormSharp, CloudSharp, WbSunnySharp, WaterDrop, Air } from "@mui/icons-material";
import { LineChart } from "@mui/x-charts";
import { keyToLabel, colors } from "../helpers/constants.ts";
import { formatHour } from "../helpers/formatters.ts";

const Card = styled.div({
  display: "inline-block"
})

const Details = styled.div({
  display: "inline-flex",

})

type WeatherCardProps = {
  dateWeatherData: any;
  day: string;
  timeOfDay: string;
  isToday: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  dateWeatherData,
  day,
  timeOfDay,
  isToday,
}: WeatherCardProps) => {
  const hourlyWeatherData = dateWeatherData.hours.map((obj) => ({
    ...obj,
    datetime: Number(obj.datetime.substr(0,2))
  }));

  const periodMin = timeOfDay === "Morning" ? 8 : timeOfDay === "Afternoon" ? 12 : 17
  const periodMax = timeOfDay === "Morning" ? 12 : timeOfDay === "Afternoon" ? 17 : 21

  return (
    <Card>
      <div>{isToday ? "Today" : `${day} the ${dateWeatherData.datetime.substr(8,2)}`}</div>
      <Details>
        <WbSunnySharp /> {dateWeatherData.conditions} {dateWeatherData.temp}&deg;F 
        <WaterDrop sx={{marginLeft: "1ch"}} /> {dateWeatherData.precipprob === 0 ? "No rain" : `${dateWeatherData.precipprob}% chance rain`}
        <Air sx={{marginLeft: "1ch"}} /> {dateWeatherData.windspeed}mph winds
      </Details>
      <LineChart
        height={300}
        width={500}
        legend={{ hidden: true }}
        xAxis={[
          {
            dataKey: "datetime",   
            valueFormatter: (value) => formatHour(value),
            min: periodMin,
            max: periodMax,
          }
        ]}
        series={Object.keys(keyToLabel).map((key) => ({
          dataKey: key,
          label: keyToLabel[key],
          color: colors[key],

        }))}
        dataset={hourlyWeatherData}
      />
    </Card>
  )
}