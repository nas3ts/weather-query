//initializing variables to be used
        const searchError = document.getElementById("search-error");
        const resultErr = document.getElementById("results-error");
        const weatherKey = '3876c435ee5e4709c70ff25a01d6121c'; // openweather api key

        // checks input validity and returns boolean value  
        function validateSearch (input) {

            if (!input.checkValidity()) {
                searchError.innerHTML = input.validationMessage;
                return false;
            } 
            return true;
        }
        
        //clear all input errors shown, when user clicks input field    (**working)
        function clearError() {
            searchError.innerHTML = "";
        }

        // triggering search
        const city = document.getElementById("city"); // catching user input
        const button = document.getElementById("search-button"); // search button

        city.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                button.click();
            }
        })

        
        //function called by onclick event  (**working)
            function handleSearch() {
                
                if (validateSearch(city)) { // input goes through validation
                    const validatedCity = city.value.trim();    // input value taken and all white spaces removed
                    fetchWeather(validatedCity);
                }
            }

        //function called by oninput event
            function showCities() {
                const currentInput = city.value.trim(); // input value taken and all white spaces removed
                const cityOptions = document.getElementById("city-options");
                cityOptions.innerHTML = ""; // clearing previous options

                if (city.checkValidity()) { // input goes through validation without error output
                    fetchCities(currentInput); 
                }
            }
  
            
        // city search
            function fetchCities(city) {
                const limit = 4;
                const cityUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${weatherKey}`;
                const cities = document.getElementById("city-options");

                fetch(cityUrl)
                    .then(response => response.json())
                    .then(data => {
                        const citySuggestions = data.map(city => `${city.name}, ${city.country}`);
                        cities.innerHTML = citySuggestions.join("<br>");
                    })
                    .catch(error => {
                        // searchError.innerHTML = "City not found";
                    })
            }

        // actual weather search
            function fetchWeather(city) {
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${weatherKey}&units=metric`; // open weather API call (specified in metric units)
                const local = document.getElementById("location");
                const wicon = document.getElementById("weather-icon");
                const currentTemp = document.getElementById("current-temp");
                const desc = document.getElementById("description");
                const wind = document.getElementById("wind-speed");
                const hum = document.getElementById("humidity");

                fetch(weatherUrl)
                    .then(response => response.json())
                    .then(data => {
                        // variables carrying required data
                        const cityName= data.name;
                        const countryCode = data.sys.country;

                        // current weather icon
                        const iconCode = data.weather[0].icon;
                        const iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

                        const temp = data.main.temp;
                        const weather = data.weather[0].description;  // main weather description
                        const humid = data.main.humidity;
                        const windSpeed = data.wind.speed;

                        local.innerHTML = cityName + ", " + countryCode;
                        wicon.setAttribute('src', iconUrl);
                        currentTemp.innerHTML = Math.round(temp);
                        desc.innerHTML = weather;
                        wind.innerHTML = windSpeed;
                        hum.innerHTML = humid;
                    })
                    .catch(error => {
                        searchError.innerHTML = "City not found";
                    })
            }