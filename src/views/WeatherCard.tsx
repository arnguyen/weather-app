import * as React from "react";
import styled from "@emotion/styled";
import { AcUnit, ThunderstormSharp, Cloud, WbSunny, WaterDrop, Air } from "@mui/icons-material";
import { LineChart } from "@mui/x-charts";
import { keyToLabel, colors } from "../helpers/constants.ts";
import { formatHour } from "../helpers/helpers.ts";

const Card = styled.div({
  display: "inline-block",
  margin: "3ch",
})

const Header = styled.div<{ isFirstCard?: boolean }>(({ isFirstCard }) => ({
  marginBottom: "1.5ch",
  fontSize: "2ch",
  fontWeight: isFirstCard ? "bold" : "normal"
}));

const Details = styled.div({
  display: "inline-flex",
})

type WeatherCardProps = {
  dateWeatherData: any;
  day: string;
  timeOfDay: string;
  isToday: boolean;
  isFirstCard: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  dateWeatherData,
  day,
  timeOfDay,
  isToday,
  isFirstCard,
}: WeatherCardProps) => {
  const hourlyWeatherData = dateWeatherData.hours.map((obj) => ({
    ...obj,
    datetime: Number(obj.datetime.substr(0,2))
  }));

  const periodMin = timeOfDay === "Morning" ? 8 : timeOfDay === "Afternoon" ? 12 : 17
  const periodMax = timeOfDay === "Morning" ? 12 : timeOfDay === "Afternoon" ? 17 : 21

  let weatherIcon;
  if (dateWeatherData.conditions.toLowerCase().includes("snow")) {
    weatherIcon = <AcUnit />
  } else if (dateWeatherData.conditions.toLowerCase().includes("rain")) {
    weatherIcon = <ThunderstormSharp />
  } else if 
    (dateWeatherData.conditions.toLowerCase().includes("cloudy") || 
      dateWeatherData.conditions.toLowerCase().includes("overcast")
    ) {
      weatherIcon = <Cloud />
  } else {
    weatherIcon = <WbSunny />
  }

  return (
    <Card>
      <Header isFirstCard={isFirstCard}>{isToday ? "Today" : `${day} ${dateWeatherData.datetime.substr(8,2)}`}</Header>
      <Details>
        {weatherIcon} {dateWeatherData.conditions}, {dateWeatherData.temp}&deg;F 
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