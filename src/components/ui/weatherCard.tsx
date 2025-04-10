

interface Forecastday {
    date:       Date;
    date_epoch: number;
    day:        Day;
    astro:      Astro;
    hour:       Current[];
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
export interface Astro {
    sunrise:           string;
    sunset:            string;
    moonrise:          string;
    moonset:           string;
    moon_phase:        string;
    moon_illumination: number;
    is_moon_up:        number;
    is_sun_up:         number;
}

export interface Day {
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

export interface Condition {
    text: string;
    icon: string;
    code: number;
}

export interface Hour {
    time_epoch: number;
    time: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: Condition;
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    snow_cm: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    will_it_rain: number;
    chance_of_rain: number;
    will_it_snow: number;
    chance_of_snow: number;
    vis_km: number;
    vis_miles: number;
    gust_mph: number;
    gust_kph: number;
    uv: number;
    air_quality: { [key: string]: number };
}
export default function WeatherCard({ forecastDay }: { forecastDay: Forecastday | undefined }) {

    if (!forecastDay) {
        return null;
    }
    const day = forecastDay.day;
    const date = forecastDay.date;
    const month = new Date(date).getMonth();
    const dayy = new Date(date).getDate() + 1;
    const minTemp = day.mintemp_c;
    const maxTemp = day.maxtemp_c;
    function monthName(month: number) {
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
        return monthNames[month];
    }
    return (
        <div className="weather-card p-4 text-center">
            <div className="text-lg font-semibold mb-3">

                {monthName(month)} {dayy}
            </div>
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3">
                {day.condition.icon ? (
                    <img
                        src={day.condition.icon}
                        alt={day.condition.text || "Weather Icon"}
                        className="w-full h-full rounded-full"
                    />
                ) : (
                    <i className="fas fa-cloud text-6xl text-gray-400 animate-pulse"></i>
                )}
            </div>
            <div className="text-sm font-medium mb-1">
                <span className={"text-blue-400"}>{minTemp}°C</span> / <span className={"text-red-400"}>{maxTemp}°C</span>
            </div>

            <div className="text-sm text-gray-600">{day.condition.text}</div>
        </div>
    );
}


