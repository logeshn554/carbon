import Input from '../ui/Input';
import Select from '../ui/Select';
import Icon from '../ui/Icons';

const fuelTypeOptions = [
  { value: 'none', label: "I don't drive / No car" },
  { value: 'petrol', label: 'Petrol / Gasoline' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric (EV)' },
  { value: 'hybrid', label: 'Hybrid' },
];

export default function TransportForm({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <fieldset>
      <legend className="sr-only">Transportation Information</legend>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Select
            id="carFuelType"
            label="Vehicle Fuel Type"
            value={data.carFuelType || 'none'}
            options={fuelTypeOptions}
            onChange={(e) => handleChange('carFuelType', e.target.value)}
          />
          <Input
            id="dailyCarKm"
            label="Daily Car Distance (km)"
            type="number"
            min="0"
            max="1000"
            placeholder="0"
            value={data.dailyCarKm || ''}
            onChange={(e) => handleChange('dailyCarKm', parseFloat(e.target.value) || 0)}
            hint={data.carFuelType === 'none' ? "Set to 0 if you don't drive" : 'Average km driven per day'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            id="publicTransportKmPerWeek"
            label="Public Transport Distance (km/week)"
            type="number"
            min="0"
            max="10000"
            placeholder="0"
            value={data.publicTransportKmPerWeek || ''}
            onChange={(e) => handleChange('publicTransportKmPerWeek', parseFloat(e.target.value) || 0)}
            hint="Bus, metro, tram — total km per week"
          />
          <Input
            id="cyclingKmPerWeek"
            label="Cycling Distance (km/week)"
            type="number"
            min="0"
            max="1000"
            placeholder="0"
            value={data.cyclingKmPerWeek || ''}
            onChange={(e) => handleChange('cyclingKmPerWeek', parseFloat(e.target.value) || 0)}
            hint="Cycling produces zero direct emissions"
          />
        </div>

        <div className="section-divider" />

        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
            <Icon name="plane" size={16} />
            Air Travel
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              id="shortFlightsPerYear"
              label="Short-haul Flights per Year"
              type="number"
              min="0"
              max="100"
              placeholder="0"
              value={data.shortFlightsPerYear || ''}
              onChange={(e) => handleChange('shortFlightsPerYear', parseInt(e.target.value) || 0)}
              hint="Under 3 hours — ~255 kg CO₂ per return flight"
            />
            <Input
              id="longFlightsPerYear"
              label="Long-haul Flights per Year"
              type="number"
              min="0"
              max="50"
              placeholder="0"
              value={data.longFlightsPerYear || ''}
              onChange={(e) => handleChange('longFlightsPerYear', parseInt(e.target.value) || 0)}
              hint="Over 3 hours — ~1,620 kg CO₂ per return flight"
            />
          </div>
        </div>

        {/* Live preview */}
        {(data.dailyCarKm > 0 || data.shortFlightsPerYear > 0 || data.longFlightsPerYear > 0) && (
          <div
            className="rounded-xl p-4 flex items-start gap-3 animate-fade-in"
            style={{ border: '1px solid rgba(0,194,123,0.18)', background: 'rgba(0,194,123,0.05)' }}
          >
            <Icon name="info" size={15} style={{ color: '#00C27B' }} className="flex-shrink-0 mt-0.5 text-current" />
            <p className="text-sm font-medium" style={{ color: '#00C27B' }}>
              Quick estimate:
              {data.dailyCarKm > 0 && ` Car: ~${Math.round(data.dailyCarKm * 0.21 * 365)} kg/yr`}
              {data.shortFlightsPerYear > 0 && ` · Short flights: ~${data.shortFlightsPerYear * 255} kg/yr`}
              {data.longFlightsPerYear > 0 && ` · Long flights: ~${data.longFlightsPerYear * 1620} kg/yr`}
            </p>
          </div>
        )}
      </div>
    </fieldset>
  );
}
