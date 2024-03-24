class Delay:
    def __init__(self):
        pass
    def is_weather_favorable(weather_data, transportation):
        # Extract relevant weather parameters
        temp = weather_data["temp"]
        humidity = weather_data["humidity"]
        wind_gust = weather_data["windgust"]
        wind_speed = weather_data["windspeed"]
        wind_dir = weather_data["winddir"]
        pressure = weather_data["pressure"]
        cloud_cover = weather_data["cloudcover"]
        precipitation_type = weather_data["preciptype"][0] if weather_data["preciptype"] else None

        # Check conditions based on transportation method
        if transportation == "walking":
            return (50 <= temp <= 80) and (40 <= humidity <= 60) and (wind_speed <= 10) and (cloud_cover <= 30) and (precipitation_type is None or precipitation_type == "rain")
        elif transportation == "bicycle":
            return (50 <= temp <= 80) and (40 <= humidity <= 60) and (wind_speed <= 15) and (cloud_cover <= 30) and (precipitation_type is None)
        elif transportation == "car":
            return (60 <= temp <= 75) and (30 <= humidity <= 70) and (wind_speed <= 30) and (cloud_cover <= 30) and (precipitation_type is None)
        elif transportation == "drone":
            return (50 <= temp <= 90) and (humidity <= 70) and (wind_speed <= 10) and (cloud_cover <= 30) and (precipitation_type is None)
        else:
            return False  # Unsupported transportation method

    # Example weather data for two days
    weather_data_day1 = {
        "temp": 52.6,
        "humidity": 53.8,
        "windgust": 24.6,
        "windspeed": 16.8,
        "winddir": 310,
        "pressure": 1019.5,
        "cloudcover": 10.5,
        "preciptype": ["rain"]
    }

    weather_data_day2 = {
        "temp": 57.6,
        "humidity": 53.3,
        "windgust": 28,
        "windspeed": 18.6,
        "winddir": 265.3,
        "pressure": 1016.2,
        "cloudcover": 12.7,
        "preciptype": ["rain"]
    }

    # Check weather favorability for different transportation methods
    transportation_methods = ["walking", "bicycle", "car", "drone"]
    for transportation in transportation_methods:
        print(f"Is weather favorable for {transportation}?")
        print("Day 1:", is_weather_favorable(weather_data_day1, transportation))
        print("Day 2:", is_weather_favorable(weather_data_day2, transportation))
        print()
