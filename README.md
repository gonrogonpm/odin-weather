# WeatherNow! 🌦️

A simple web application to check the current weather and a 5-day forecast for any city worldwide. This project is built using modern JavaScript, webpack for bundling, and the Visual Crossing Weather API for weather data.

## Features

*   **City Weather Search:** Enter the name of any city or town to get its weather information.
*   **Current Weather:** Displays the current temperature, a representative weather icon, humidity percentage, precipitation probability, and wind speed.
*   **5-Day Forecast:** Shows a forecast for the next 5 days, including the day of the week, date, weather icon, and high/low temperatures.
*   **Timezone Aware:** Utilizes `date-fns` and `@date-fns/tz` to accurately display the current date and time based on the searched location's timezone.
*   **Loading Indicator:** Provides visual feedback (spinner) while fetching data from the API.
*   **Error Handling:** Informs the user if the searched city cannot be found by the API.
*   **Last Search Memory:** Stores the last successfully searched city in `localStorage` and automatically loads its weather on subsequent visits.
*   **Dynamic Backgrounds:** Features a selection of background images that change randomly on page load.

## Technologies Used

*   **Frontend:** HTML5, CSS3 (including CSS Variables, Grid Layout, Flexbox)
*   **JavaScript (ES6+):** Core application logic.
*   **webpack:** Module bundler for managing dependencies and creating the final asset bundle.
*   **date-fns & @date-fns/tz:** Libraries for robust and accurate date and timezone manipulation.
*   **Visual Crossing Weather API:** Source for weather data.
*   **Fontello:** Used for specific icons (inferred from `fontello.css`).

## Live Demo
[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20Live-blueviolet)](https://gonrogonpm.github.io/odin-weather/)

<!-- Añade la imagen de vista previa aquí -->
![Live Preview of ToDos App](./screenshots/live-preview-screenshot.png)

(https://gonrogonpm.github.io/odin-weather/)

## API Key Notice ⚠️

The Visual Crossing API key included directly in the source code (`main.js`) is intentionally public for educational purposes, as this project is part of a course requirement allowing peers to easily run it.

**Please be aware:** For real-world projects deployed outside this specific academic context, **API keys should *never* be exposed in client-side code.** They should be handled securely via a backend proxy or serverless function to prevent unauthorized use. The included key is from a free tier and may be suspended if usage limits are exceeded due to public exposure.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).