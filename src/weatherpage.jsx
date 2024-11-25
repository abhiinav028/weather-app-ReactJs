import { useState, useEffect } from 'react';
import './weatherpage.css';
import video from "./assets/bg6.mp4";

const WeatherPage = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    const apiKey = '880d4d21260d1b76c569ac6b1afcbca2';

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString());
        };
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchWeather = async () => {
        if (!city) {
            setError('Please enter a city name.');
            return;
        }
        try {
            setError('');
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
            );
            if (!response.ok) throw new Error('City not found.');
            const data = await response.json();
            setWeather(data);
        } catch (err) {
            setError(err.message);
            setWeather(null);
        }
    };

    const getWeatherIcon = (condition) => {
        if (condition.includes('rain')) return '🌧️';
        if (condition.includes('cloud')) return '☁️';
        if (condition.includes('clear')) return '☀️';
        if (condition.includes('snow')) return '❄️';
        if (condition.includes('thunderstorm')) return '⛈️';
        if (condition.includes('mist') || condition.includes('haze')) return '🌫️';
        return '🌍';
    };

    return (
        <div className="weather-app">
            {/* Navigation Bar */}
            <nav className="navbar">
                <h2 className="navbar-logo">W <span>.</span></h2>
                <ul className="navbar-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#news">News</a></li>
                    <li><a href="#precautions">Precautions</a></li>
                    <li><a href="#live-update">Live Update</a></li>
                    <li><a href="#help-line">Help Line</a></li>
                </ul>
            </nav>

            {/* Current Time */}
            <div className="top-bar">
                <p>Current Time: {currentTime}</p>
            </div>

            {/* Background Video */}
            <video
                className="video"
                autoPlay
                muted
                loop
                playsInline
                src={video}
            ></video>

            {/* Weather App */}
            <h1>Weather App</h1>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button onClick={fetchWeather}>Get Weather</button>
            </div>
            {error && <p className="error">{error}</p>}
            {weather && (
                <div className="weather-info">
                    <h2>
                        {weather.name}, {weather.sys.country}
                    </h2>
                    <p>Temperature: {weather.main.temp}°C</p>
                    <p>Condition: {getWeatherIcon(weather.weather[0].description)} {weather.weather[0].description}</p>
                    <p>Humidity: {weather.main.humidity}%</p>
                    <p>Wind Speed: {weather.wind.speed} m/s</p>
                </div>
            )}
        </div>
    );
};

export default WeatherPage;
