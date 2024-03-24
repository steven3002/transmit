class Delay:
    def __init__(self, weather_data):
        self.temp = float(weather_data["temp"])
        self.wind_gust = float(weather_data["windgust"])
        self.wind_speed = float(weather_data["windspeed"])
        self.wind_dir = float(weather_data["winddir"])
        self.pressure = float(weather_data["pressure"])
    def is_weather_favorable(self, transportation):

        if transportation == "walking":
            favorable_temp = 65
            favorable_wind_gust = 15
            favorable_wind_speed = 10
            favorable_wind_dir = 180
            favorable_pressure = 1015
        elif transportation == "bicycle":
            favorable_temp = 70
            favorable_wind_gust = 20
            favorable_wind_speed = 15
            favorable_wind_dir = 180
            favorable_pressure = 1015
        elif transportation == "car":
            favorable_temp = 72
            favorable_wind_gust = 25
            favorable_wind_speed = 20
            favorable_wind_dir = 180
            favorable_pressure = 1015
        elif transportation == "drone":
            favorable_temp = 75
            favorable_wind_gust = 30
            favorable_wind_speed = 25
            favorable_wind_dir = 360
            favorable_pressure = 1015
        else:
            return False  # Unsupported transportation method

        # Calculate delay based on weather conditions compared to favorable conditions
        temp_ratio = self.temp / favorable_temp
        wind_gust_ratio = self.wind_gust / favorable_wind_gust
        wind_speed_ratio = self.wind_speed / favorable_wind_speed
        wind_dir_ratio = self.wind_dir / favorable_wind_dir
        pressure_ratio = self.pressure / favorable_pressure
        delays = [temp_ratio, wind_dir_ratio,wind_speed_ratio,wind_gust_ratio,pressure_ratio]
        delay=0
        for items in delays :
            delay+=self.interpolate_delay(items)

        return delay/len(delays)

    def interpolate_delay(self, length_target):
        no_delay = 0
        standard_ratio = 1
        critical_delay = 87
        critical_ratio = 1.5

        return no_delay + (length_target - standard_ratio) * (critical_delay - no_delay) / (
                    critical_ratio - standard_ratio)


