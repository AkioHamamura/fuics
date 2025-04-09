import { buttonVariants } from "@/components/ui/button";
import react from "@vitejs/plugin-react";
import {useState} from "react";

export interface WeatherData {
  location: Location | null
  current:  Current | null
}

export interface Current {
  last_updated_epoch: number | null
  last_updated:       string | null
  temp_c:             number | null
  temp_f:             number | null
  is_day:             number | null
  condition:          Condition | null
  wind_mph:           number | null
  wind_kph:           number | null
  wind_degree:        number | null
  wind_dir:           string | null
  pressure_mb:        number | null
  pressure_in:        number | null
  precip_mm:          number | null
  precip_in:          number | null
  humidity:           number | null
  cloud:              number | null
  feelslike_c:        number | null
  feelslike_f:        number | null
  windchill_c:        number | null
  windchill_f:        number | null
  heatindex_c:        number | null
  heatindex_f:        number | null
  dewpoint_c:         number | null
  dewpoint_f:         number | null
  vis_km:             number | null
  vis_miles:          number | null
  uv:                 number | null
  gust_mph:           number | null
  gust_kph:           number | null
}

export interface Condition {
  text: string | null
  icon: string | null
  code: number | null
}

export interface Location {
  name:            string | null
  region:          string | null
  country:         string | null
  lat:             number | null
  lon:             number | null
  tz_id:           string | null
  localtime_epoch: number | null
  localtime:       string | null
}

function App() {
//Ready an API call function to get the data
  //Also ready some variables to store the data
  //Also a variable to change the search bar and unit variable
    //Also a variable to change the location
  //BASE_URL: https://2hx4ndw6u0.execute-api.us-east-1.amazonaws.com/v1/weather/{proxy+}
  const BASE_URL = "https://2hx4ndw6u0.execute-api.us-east-1.amazonaws.com/v1/weather";
  const [searchTerm, setSearchTerm] = useState("");
    const [unit, setUnit] = useState("metric");
    const [weatherData, setWeatherData] = useState({} as WeatherData);
    const getCurrentWeatherData = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch(`${BASE_URL}/current.json?q=${searchTerm}`)
            .then(async res => {
              const data = await res.json();
              setWeatherData(data);
              console.log(data);
            })
            .catch(error => {
              console.error("Error fetching data:", error);
              alert("Error: " + error);
            });

    }


  return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">WeatherSphere</h1>
            <p className="text-sm text-gray-600">Your personal weather companion</p>

          </div>
          <div className="flex items-center space-x-2">
            <button id="unit-toggle"
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-200 transition">
              °C / °F
            </button>
            <button id="location-btn"
                    className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition">
              <i className="fas fa-location-arrow"></i>
            </button>
          </div>
        </header>

        <div className="relative mb-8">
          <form onSubmit={getCurrentWeatherData} className="flex items-center bg-white rounded-full shadow-md overflow-hidden">
            <input
                type="text"
                id="search-input"
                placeholder="Search for a city..."
                className="flex-grow px-5 py-3 text-gray-700 focus:outline-none rounded-full"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  console.log(searchTerm);
                }}
            />
            <button id="search-btn" className="px-5 py-3 bg-blue-500 text-white hover:bg-blue-600 transition"
            type={"submit"}>
              <i className="fas fa-search"></i>
            </button>
          </form>
          <div id="search-results"
               className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg hidden max-h-60 overflow-y-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="weather-card lg:col-span-2 p-6">
            <div id="current-weather" className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 id="current-location" className="text-2xl font-bold">
                    {weatherData ? weatherData.location?.name : "Loading..."}</h2>


                  <p id="current-date" className="text-gray-600">-- -- ----</p>
                </div>
                <div id="current-condition" className="text-right">
                  <p className="text-lg capitalize">--</p>
                  <p id="current-temp" className="temperature-display">--</p>
                </div>
              </div>

              <div className="flex-grow flex items-center justify-center my-4">
                <div id="current-icon" className="weather-icon w-32 h-32 flex items-center justify-center">
                  <i className="fas fa-cloud text-6xl text-gray-400 animate-pulse"></i>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-auto">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <i className="fas fa-wind text-blue-500 mb-1"></i>
                  <p className="text-sm text-gray-600">Wind</p>
                  <p id="current-wind" className="font-medium">-- km/h</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <i className="fas fa-tint text-blue-500 mb-1"></i>
                  <p className="text-sm text-gray-600">Humidity</p>
                  <p id="current-humidity" className="font-medium">--%</p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <i className="fas fa-compress-arrows-alt text-blue-500 mb-1"></i>
                  <p className="text-sm text-gray-600">Pressure</p>
                  <p id="current-pressure" className="font-medium">-- hPa</p>
                </div>
              </div>
            </div>
          </div>

          <div className="weather-card p-6">
            <h3 className="text-lg font-semibold mb-4">Hourly Forecast</h3>
            <div id="hourly-forecast" className="hourly-forecast flex overflow-x-auto pb-2 space-x-4">
              <div className="text-center flex-shrink-0 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-8 mx-auto mt-1"></div>
              </div>
              <div className="text-center flex-shrink-0 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-8 mx-auto mt-1"></div>
              </div>
              <div className="text-center flex-shrink-0 animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-8 mx-auto mt-1"></div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Air Quality</h3>
              <div id="air-quality" className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Loading...</span>
                  <span id="aqi-value"
                        className="px-3 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-800">--</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div id="aqi-bar" className="bg-gray-400 h-2 rounded-full"></div>
                </div>
                <p id="aqi-description" className="text-sm mt-2 text-gray-600">Air quality data is being loaded</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex border-b border-gray-200 mb-6">
            <button id="forecast-tab" className="tab-active px-4 py-2 mr-2">7-Day Forecast</button>
            <button id="history-tab" className="px-4 py-2 text-gray-600 hover:text-blue-600">Historical Data</button>
          </div>

          <div id="forecast-content" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            <div className="weather-card p-4 text-center animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
              <div className="h-6 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-10 mx-auto"></div>
            </div>
            <div className="weather-card p-4 text-center animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
              <div className="h-6 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-10 mx-auto"></div>
            </div>
            <div className="weather-card p-4 text-center animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
              <div className="h-6 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-10 mx-auto"></div>
            </div>
            <div className="weather-card p-4 text-center animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
              <div className="h-6 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-10 mx-auto"></div>
            </div>
            <div className="weather-card p-4 text-center animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
              <div className="h-6 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-10 mx-auto"></div>
            </div>
            <div className="weather-card p-4 text-center animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
              <div className="h-6 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-10 mx-auto"></div>
            </div>
            <div className="weather-card p-4 text-center animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-3"></div>
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3"></div>
              <div className="h-6 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-10 mx-auto"></div>
            </div>
          </div>

          <div id="history-content" className="hidden">
            <div className="weather-card p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h3 className="text-lg font-semibold">Past Weather Data</h3>
                <div className="mt-2 md:mt-0">
                  <input
                      type="date"
                      id="history-date"
                      className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button id="fetch-history"
                          className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Fetch Data
                  </button>
                </div>
              </div>

              <div id="history-data" className="text-center py-8">
                <i className="fas fa-clock text-4xl text-gray-300 mb-2"></i>
                <p className="text-gray-500">Select a date to view historical weather data</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Weather data provided by <a href="https://www.weatherapi.com/" className="text-blue-500 hover:underline"
                                         target="_blank">WeatherAPI.com</a></p>
          <p className="mt-1">© 2023 WeatherSphere. All rights reserved.</p>
        </footer>
      </div>
  );
}


export default App;
