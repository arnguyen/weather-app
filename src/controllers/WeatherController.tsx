import * as React from "react";
import styled from "@emotion/styled";
import { LocationOn, CalendarMonth, AccessTime, Search, Help, Close } from "@mui/icons-material";
import { InputAdornment, TextField, MenuItem, Box, InputBase, IconButton, Divider, Modal } from "@mui/material";
import { timeOfDay, days, intToDay } from "../helpers/constants.ts";
import { isDateToday } from "../helpers/helpers.ts";
import { WeatherCard } from "../views/WeatherCard.tsx";

const API_KEY = "7NRACK6RMYQDSNF4HR647ALKD";

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const supportButtonStyle = {
  position: "absolute" as 'absolute',
  bottom: 0,
  right: 0,
  '@media(max-width: 780px)': {
    bottom: "unset",
    right: "unset",
    top: 0,
    left: 0
  }
};

const boxStyle = {
  paddingTop: "2ch",
  display: "block",
  '@media(max-width: 780px)': {
    width: "600px"
  }
}

const Page = styled.div({
  background: "rgba(251,247,245, 0.8)",
});

export const WeatherController: React.FC = () => {
  const [weatherData, setWeatherData] = React.useState<any>();
  const [showSupport, setShowSupport] = React.useState<boolean>(false);
  
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

    return specificDateWeatherData.map((day: any, idx: number) => {
      const isToday = isDateToday(new Date(day.datetime));
      const isFirstCard = idx === 0
      
      return (
        <WeatherCard
          dateWeatherData={day}
          day={selectedDay}
          timeOfDay={selectedTime}
          isToday={isToday}
          isFirstCard={isFirstCard}
        />
    )}
  )}, [specificDateWeatherData, selectedDay, selectedTime]);

  return (
    <Page>
      <Box
        component="form"
        noValidate
        sx={boxStyle}
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

      <Divider variant="middle" sx={{ "@media(max-width: 780px)": { width: "550px" } }} />

      {weatherCards}

      {showSupport && (
        <Modal
          open={showSupport}
          onClose={() => setShowSupport(false)}
        >
          <Box sx={modalStyle}>
            <IconButton sx={{ position: "absolute", right: 0, top: 0 }} type="button" onClick={() => setShowSupport(false)}><Close /></IconButton>
            Welcome to Whether Weather! Use the search bar at the top to search for locations.
            This forecast app shows each selected day in the next 30 days that has hourly forecast data.
            Use the time selector to switch between morning, afternoon, or evening forecasts. If you have any
            questions, please reach out to me <a href="mailto:ngandrewr@gmail.com">here</a>. Happy forecasting!
          </Box>
        </Modal>
      )}

      <IconButton 
        type="button" 
        onClick={() => setShowSupport(true)}
        sx={supportButtonStyle}
      >
        <Help />
      </IconButton>
    </Page>
  )
}