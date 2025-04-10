import {useState, useEffect} from "react";
import WeatherCard from "@/components/ui/weatherCard.tsx";
import { FaSearch } from "react-icons/fa";


interface WeatherData {
  location: Location;
  current:  Current;
  forecast: Forecast;
}

interface Current {
  last_updated_epoch?: number;
  last_updated?:       string;
  temp_c:              number;
  temp_f:              number;
  is_day:              number;
  condition:           Condition;
  wind_mph:            number;
  wind_kph:            number;
  wind_degree:         number;
  wind_dir:            string;
  pressure_mb:         number;
  pressure_in:         number;
  precip_mm:           number;
  precip_in:           number;
  humidity:            number;
  cloud:               number;
  feelslike_c:         number;
  feelslike_f:         number;
  windchill_c:         number;
  windchill_f:         number;
  heatindex_c:         number;
  heatindex_f:         number;
  dewpoint_c:          number;
  dewpoint_f:          number;
  vis_km:              number;
  vis_miles:           number;
  uv:                  number;
  gust_mph:            number;
  gust_kph:            number;
  air_quality:         { [key: string]: number };
  time_epoch?:         number;
  time?:               string;
  snow_cm?:            number;
  will_it_rain?:       number;
  chance_of_rain?:     number;
  will_it_snow?:       number;
  chance_of_snow?:     number;
}


interface Condition {
  text: Text;
  icon: string;
  code: number;
}

enum Text {
  Clear = "Clear ",
  Cloudy = "Cloudy ",
  Overcast = "Overcast ",
  PartlyCloudy = "Partly Cloudy ",
  Sunny = "Sunny",
}

interface Forecast {
  forecastday: Forecastday[];
}

interface Forecastday {
  date:       Date;
  date_epoch: number;
  day:        Day;
  astro:      Astro;
  hour:       Current[];
}

interface Astro {
  sunrise:           string;
  sunset:            string;
  moonrise:          string;
  moonset:           string;
  moon_phase:        string;
  moon_illumination: number;
  is_moon_up:        number;
  is_sun_up:         number;
}

interface Day {
  maxtemp_c:            number;
  maxtemp_f:            number;
  mintemp_c:            number;
  mintemp_f:            number;
  avgtemp_c:            number;
  avgtemp_f:            number;
  maxwind_mph:          number;
  maxwind_kph:          number;
  totalprecip_mm:       number;
  totalprecip_in:       number;
  totalsnow_cm:         number;
  avgvis_km:            number;
  avgvis_miles:         number;
  avghumidity:          number;
  daily_will_it_rain:   number;
  daily_chance_of_rain: number;
  daily_will_it_snow:   number;
  daily_chance_of_snow: number;
  condition:            Condition;
  uv:                   number;
  air_quality:          { [key: string]: number };
}

interface Location {
  name:            string;
  region:          string;
  country:         string;
  lat:             number;
  lon:             number;
  tz_id:           string;
  localtime_epoch: number;
  localtime:       string;
}

function App() {
  const BASE_URL = "https://2hx4ndw6u0.execute-api.us-east-1.amazonaws.com/v1/weather";
  const [searchTerm, setSearchTerm] = useState("");
  const [unit] = useState("metric");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [locationTime, setLocationTime] = useState(0);
  const [menuOpen, setMenuOpen] = useState(true); //0: Forecast, 1: History

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`${BASE_URL}/forecast.json?aqi=yes&days=7&q=${latitude},${longitude}`);
            if (!response.ok) throw new Error("Failed to fetch weather data");
            const data: WeatherData = await response.json();
            setWeatherData(data);

            const currTime = (data.location.localtime_epoch);
            //get the time in hours of currTime
            const date = new Date(currTime * 1000);
            const hours = date.getHours();
            setLocationTime(hours);
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to fetch your location. Please search manually.");
        }
    );
  }, []);

  const getCurrentWeatherData = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/forecast.json?aqi=yes&days=7&q=${searchTerm}`);
      if (!response.ok) throw new Error("Failed to fetch weather data");
      const data: WeatherData = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error: " + error);
    }
  };

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
    const forecastTab = document.getElementById("forecast-tab");
    const historyTab = document.getElementById("history-tab");
    const forecastContent = document.getElementById("forecast-content");
    const historyContent = document.getElementById("history-content");

    if (menuOpen) {
      forecastTab?.classList.add("tab-active");
      historyTab?.classList.remove("tab-active");
      forecastContent?.classList.remove("hidden");
      historyContent?.classList.add("hidden");
    } else {
      forecastTab?.classList.remove("tab-active");
      historyTab?.classList.add("tab-active");
      forecastContent?.classList.add("hidden");
      historyContent?.classList.remove("hidden");
    }


  }
  return (
      <div>

  <div className="container mx-auto px-4 py-8 max-w-6xl">
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-blue-600">AetherFull</h1>
        <p className="text-sm text-gray-600">A Hyper-minimalistic weather app</p>

      </div>
      <div className="flex items-center space-x-2">
      <button id="unit-toggle"
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-200 transition">
              °C / °F
            </button>

          </div>
        </header>

        <div className="relative mb-8">
          <form
              onSubmit={getCurrentWeatherData}
              className="flex items-center bg-white rounded-full shadow-md overflow-hidden"
          >
            <input
                type="text"
                id="search-input"
                placeholder="Search for a city..."
                className="flex-grow px-5 py-3 text-gray-700 focus:outline-none rounded-full"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
                id="search-btn"
                className="px-5 py-4 bg-blue-500 text-white hover:bg-blue-600 transition"
                type="submit">
              <FaSearch />

            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="weather-card lg:col-span-2 p-6">
            <div id="current-weather" className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 id="current-location" className="text-2xl font-bold">
                    {weatherData?.location?.name ?? "Loading..."}
                  </h2>
                  <p id="current-date" className="text-gray-600">
                    {weatherData?.location?.localtime ?? "-- -- ----"}
                  </p>
                </div>
                <div id="current-condition" className="text-right">
                  <p className="text-lg capitalize">
                    {weatherData?.current?.condition?.text ?? "--"}
                  </p>
                  <p id="current-temp" className="temperature-display">
                    {unit === "metric"
                        ? weatherData?.current?.temp_c ?? "--"
                        : weatherData?.current?.temp_f ?? "--"}
                  </p>
                </div>
              </div>
              <div className="flex-grow flex items-center justify-center my-4">
                <div id="current-icon" className="weather-icon w-32 h-32 flex items-center justify-center">
                  {weatherData?.current?.condition?.icon ? (
                      <img
                          src={weatherData.current.condition.icon}
                          alt={weatherData.current.condition.text || "Weather Icon"}
                          className="w-full h-full"
                      />
                  ) : (
                      <i className="fas fa-cloud text-6xl text-gray-400 animate-pulse"></i>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-auto">
                <div className="bg-blue-50 p-3 rounded-lg text-center">

                  <i className="fas fa-wind text-blue-500 mb-1"></i>
                  <p className="text-sm text-gray-600">Wind</p>
                  <p id="current-wind" className="font-medium">
                    {unit === "metric"
                        ? `${weatherData?.current?.wind_kph ?? "--"} km/h`
                        : `${weatherData?.current?.wind_mph ?? "--"} mph`}
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <i className="fas fa-tint text-blue-500 mb-1"></i>
                  <p className="text-sm text-gray-600">Humidity</p>
                  <p id="current-humidity" className="font-medium">
                    {weatherData?.current?.humidity ?? "--"}%
                  </p>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <i className="fas fa-compress-arrows-alt text-blue-500 mb-1"></i>
                  <p className="text-sm text-gray-600">Pressure</p>
                  <p id="current-pressure" className="font-medium">
                    {weatherData?.current?.pressure_mb ?? "--"} hPa
                  </p>
                </div>
              </div></div></div>

              <div className="weather-card p-6 ">
                <h3 className="text-lg font-semibold mb-4">Hourly Forecast</h3>
                <div id="hourly-forecast" className="hourly-forecast flex overflow-x-auto pb-2 space-x-4">
                  {weatherData?.forecast?.forecastday[0]?.hour.slice(locationTime + 1, locationTime + 24).map((hour, index) => (
                        <div key={index} className="text-center flex-shrink-0">
                            <div className="w-16 h-16 bg-gray-200 rounded-full mb-2">
                              {hour.condition.icon ? (
                                  <img
                                      src={hour.condition.icon}
                                      alt={hour.condition.text || "Weather Icon"}
                                      className="w-full h-full rounded-full"
                                  />
                              ) : (
                                  <i className="fas fa-cloud text-6xl text-gray-400 animate-pulse"></i>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(hour.time ?? "").toLocaleTimeString([], { hour: 'numeric', hour12: true })}
                            </p>
                            <p className="text-sm font-medium">{hour.temp_c}°C</p>
                        </div>
                    ))}


                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Air Quality</h3>
                  <div id="air-quality" className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{weatherData? weatherData?.current?.air_quality?.pm10 : "Loading..."}</span>
                      <span id="aqi-value"
                            className="px-3 py-1 rounded-full text-xs font-bold bg-gray-200 text-gray-800">PM10</span>
                    </div>

                    <div id="aqi-description" className="text-sm mt-2 text-gray-600">
                      { weatherData? weatherData?.current?.air_quality?.pm10 < 54?
                              <div><div className="w-full bg-gray-200 rounded-full h-2">
                                <div id="aqi-bar" className="bg-green-500 my-4 h-2 rounded-full"></div></div>
                                Air quality is good</div> :
                              weatherData?.current?.air_quality?.pm10 < 154 ? <div><div className="w-full bg-gray-200 rounded-full h-2">
                                <div id="aqi-bar" className="bg-yellow-400 my-4 h-2 rounded-full"></div></div>Air quality is moderate </div>:
                                  weatherData?.current?.air_quality?.pm10 < 254? <div><div className="w-full bg-gray-200 rounded-full h-2">
                                <div id="aqi-bar" className="bg-orange-500 my-4 h-2 rounded-full"></div></div>Air quality is unhealthy for sensitive groups </div>:
                                    weatherData?.current?.air_quality?.pm10 < 354? <div><div className="w-full bg-gray-200 rounded-full h-2">
                                <div id="aqi-bar" className="bg-red-600 my-4 h-2 rounded-full"></div></div>Air quality is unhealthy </div>:
                                      weatherData?.current?.air_quality?.pm10 < 424? <div><div className="w-full bg-gray-200 rounded-full h-2">
                                <div id="aqi-bar" className="bg-purple-900 my-4 h-2 rounded-full"></div></div>Air quality is very unhealthy </div>:
                                          <div><div className="w-full bg-gray-200 rounded-full h-2">
                                <div id="aqi-bar" className="bg-amber-800 my-4 h-2 rounded-full"></div></div>Air quality is hazardous </div>:

                        "Air quality data is being loaded"
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex border-b border-gray-200 mb-6">
                <button onClick={handleMenuClick} id="forecast-tab" className="tab-active px-4 py-2 mr-2">3-Day Forecast</button>
                <button onClick={handleMenuClick} id="history-tab" className="px-4 py-2 text-gray-600 hover:text-blue-600">Historical Data
                </button>
              </div>

              <div id="forecast-content" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                    {weatherData?.forecast?.forecastday.map((day) => (<WeatherCard forecastDay={day}/>))}</div>

              <div id="history-content" className="hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                {weatherData?.forecast?.forecastday.map((day) => (<WeatherCard forecastDay={day}/>))}
              </div>
            </div>

    <footer className="mt-12 text-center text-sm justify-items-center text-gray-500">

      <p>Weather data provided by <a href="https://www.weatherapi.com/" className="text-blue-500 hover:underline"
                                     target="_blank">WeatherAPI.com</a></p>
      <p>Hosting provided by <a href="https://aws.amazon.com/" className="text-blue-500 hover:underline"
                                     target="_blank">aws.amazon.com</a></p>

      <p className="mt-1">© 2025 Akio Hamamura. All rights reserved.</p>


      <p className={"mt-3"}>
        <a href="https://www.buymeacoffee.com/AkioHamamura" target="_blank">
          <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee"
               style={{height: "60px", width: "217px"}}/>
        </a>
      </p>

    </footer>
  </div>
      </div>
  );
}


export default App;
