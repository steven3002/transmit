class Delay:
    def __init__(self, weather_data):
        self.weather_data = weather_data

    def is_weather_favorable(self, transportation):
        favorable_conditions = self.get_favorable_conditions(transportation)
        if favorable_conditions is None:
            return False  # Unsupported transportation method

        delays = []
        for condition, favorable_value in favorable_conditions.items():
            actual_value = self.weather_data.get(condition)
            if actual_value is None:
                return False  # Missing weather data
            if actual_value / favorable_value >=1:
                ratio=actual_value / favorable_value
            else:
                ratio =   favorable_value/actual_value
            delays.append(self.interpolate_delay(ratio))

        average_delay = sum(delays) / len(delays)
        return average_delay

    @staticmethod
    def get_favorable_conditions(transportation):
        favorable_conditions = {
            "walking": {"temp": 55, "windgust": 15, "windspeed": 10, "winddir": 180, "pressure": 1015},
            "bicycle": {"temp": 70, "windgust": 20, "windspeed": 15, "winddir": 180, "pressure": 1015},
            "car": {"temp": 72, "windgust": 25, "windspeed": 20, "winddir": 180, "pressure": 1015},
            "drone": {"temp": 75, "windgust": 30, "windspeed": 25, "winddir": 360, "pressure": 1015},
        }
        return favorable_conditions.get(transportation)

    @staticmethod
    def interpolate_delay(ratio):
        no_delay = 0
        standard_ratio = 1
        critical_delay = 87
        critical_ratio = 1.5

        return no_delay + (ratio - standard_ratio) * (critical_delay - no_delay) / (
                    critical_ratio - standard_ratio)


