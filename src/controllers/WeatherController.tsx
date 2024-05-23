import * as React from "react";
import { InputAdornment, TextField, MenuItem, Box, InputBase, IconButton, Divider } from "@mui/material";
import { LocationOn, CalendarMonth, AccessTime, Search } from "@mui/icons-material";
import { timeOfDay, days, sampleData2 } from "../helpers/constants.ts";
import { WeatherCard } from "../views/WeatherCard.tsx";

const API_KEY = "7NRACK6RMYQDSNF4HR647ALKD";

const intToDay = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday"
}

const isDateToday = (someDate) => {
  const today = new Date()

  return someDate.getUTCDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
}

type WeatherControllerProps = {
  temp?: string;
}

export const WeatherController: React.FC<WeatherControllerProps> = ({
  temp
}: WeatherControllerProps) => {
  const [weatherData, setWeatherData] = React.useState<any>();
  
  const locationRef = React.useRef<HTMLInputElement>();
  const [selectedDay, setSelectedDay] = React.useState<string>("Sunday");
  const [selectedTime, setSelectedTime] = React.useState<string>("Afternoon");

  const handleLocationUpdate = React.useCallback(async () => {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationRef.current?.value}/next30days?key=${API_KEY}`;

    const apiWeatherData = await fetch(url).then(response => {
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("Bad request. Check input and try again.")
        } else if (response.status === 401) {
          throw new Error("Account unauthorized")
        } else if (response.status === 404) {
          throw new Error("Request not found")
        } else if (response.status === 429) {
          throw new Error("Too many requests. Try again later.")
        } else if (response.status === 500) {
          throw new Error("Internal server error. Try again later.")
        }
        throw new Error("Default error")
      }
      return response.json()
    });

    setWeatherData(apiWeatherData)
    //setWeatherData(sampleData2)
  }, [setWeatherData])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {handleLocationUpdate()}, []) // empty dependancy so it only runs on inital render

  const handleKeyPress = React.useCallback((e: any) => {
    if (e.keyCode === 13) {
      handleLocationUpdate();
    }
  }, [handleLocationUpdate]);
  
  const specificDateWeatherData = weatherData ? weatherData.days.map((day: any) => {
    const dayOfWeek = new Date(day.datetime).getUTCDay();
    
    if (intToDay[dayOfWeek] === selectedDay && day.hours) {
      return day
    }

    return undefined;
  }).filter((day: any) => !!day) : undefined;


  const weatherCards = React.useMemo(() => {
    if (!specificDateWeatherData) {
      return undefined;
    }

    return specificDateWeatherData.map((day: any) => {
      const isToday = isDateToday(new Date(day.datetime))
      
      return (
        <WeatherCard
          dateWeatherData={day}
          day={selectedDay}
          timeOfDay={selectedTime}
          isToday={isToday}
        />
    )}
  )}, [specificDateWeatherData, selectedDay, selectedTime]);

  return (
    <>
      <Box
        component="form"
        noValidate
        sx={{ display: "block" }}
      >
        <div>
          <InputBase
            sx={{ ml: 1, flex: 1}}
            placeholder="Search location"
            onKeyDown={handleKeyPress}
            inputRef={locationRef}
            startAdornment={<LocationOn color="action" />}
            endAdornment={
              <IconButton type="button" onClick={handleLocationUpdate}><Search /></IconButton>
            }
            defaultValue="New York"
          />
        </div>
        <div>
          <TextField
            select
            label="Day"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarMonth />
                </InputAdornment>
              )
            }}
            sx={{ m: 1, width: "20ch" }}
            size="small"
            defaultValue={"Sunday"}
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            {days.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Time"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTime />
                </InputAdornment>
              )
            }}
            sx={{ m: 1, width: "20ch" }}
            size="small"
            defaultValue={"Afternoon"}
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            {timeOfDay.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>  
        </div>
      </Box>

      <Divider variant="middle" />

      {weatherCards}
    </>
  )
}