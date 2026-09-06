import { MapPin } from "lucide-react"

function CitySelector({
  cities,
  city,
  onCityChange,
}) {
  return (
    <div className="top-controls">
      <div className="city-control">
        <label>Select City</label>

        <div className="city-select-wrapper">
          <MapPin size={17} />

          <select
            value={city}
            onChange={(event) => onCityChange(event.target.value)}
          >
            {cities.map((item) => (
              <option key={item.city} value={item.city}>
                {item.city}, {item.country}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default CitySelector