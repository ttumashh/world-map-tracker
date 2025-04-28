import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';

const geoUrl = '/countries.geojson';

const CountryMap = () => {
  const [countriesData, setCountriesData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userCountries, setUserCountries] = useState([]);
  const router = useRouter();

  const isValidGeometry = (geo) => {
    try {
      if (!geo?.type || !geo?.coordinates) return false;
      if (geo.type === 'MultiPolygon') {
        return geo.coordinates.some(polygon =>
          polygon.some(ring =>
            ring.length >= 4 && typeof ring[0][0] === 'number'
          )
        );
      }
      return geo.coordinates.some(ring =>
        ring.length >= 4 && typeof ring[0][0] === 'number'
      );
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      router.push('/login');
    } else {
      setUserId(storedUserId);
    }
  }, [router]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(geoUrl);
        const data = await res.json();
        setCountriesData(data);
      } catch (error) {
        console.error('Failed to load countries.geojson:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchUserCountries = async () => {
      if (userId) {
        try {
          const response = await axios.get(`/api/countries?userId=${userId}`);
          setUserCountries(response.data);
        } catch (error) {
          console.error('Failed to load user countries:', error);
        }
      }
    };

    fetchUserCountries();
  }, [userId]);

  const handleCountryClick = (geo) => {
    const countryCode = geo.properties['ISO3166-1-Alpha-3'];
    const countryName = geo.properties.name;

    if (selectedCountry && selectedCountry.code === countryCode) {
      setSelectedCountry(null);
      return;
    }

    setSelectedCountry({ code: countryCode, name: countryName });
  };

  const handleAddOrUpdateStatus = async (status) => {
    if (!selectedCountry) return;

    try {
      await axios.post('/api/countries', {
        userId: Number(userId),
        isoCode: selectedCountry.code,
        status: status,
        countryName: selectedCountry.name,
      });
      await refreshUserCountries();
      setSelectedCountry(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteStatus = async () => {
    if (!selectedCountry) return;

    try {
      const country = userCountries.find(c => c.isoCode === selectedCountry.code);

      if (country) {
        await axios.delete(`/api/countries?id=${country.id}&userId=${userId}`);
        await refreshUserCountries();
        setSelectedCountry(null);
      }
    } catch (error) {
      console.error('Error deleting country:', error);
    }
  };

  const refreshUserCountries = async () => {
    try {
      const response = await axios.get(`/api/countries?userId=${userId}`);
      setUserCountries(response.data);
    } catch (error) {
      console.error('Failed to refresh user countries:', error);
    }
  };

  const getCountryStatus = (isoCode) => {
    const country = userCountries.find(c => c.isoCode === isoCode);
    return country ? country.status : null;
  };

  const getFillColor = (isoCode) => {
    const status = getCountryStatus(isoCode);
    if (status === 'visited') return '#3498db';
    if (status === 'planned') return '#2ecc71';
    if (selectedCountry && selectedCountry.code === isoCode) return '#f39c12';
    return '#bdc3c7';
  };

  if (!countriesData) {
    return <div className="text-center text-xl text-gray-600">Loading map...</div>;
  }

  return (
    <div style={{ display: 'flex', padding: '20px', background: '#f4f7fa' }}>
      <div style={{ width: '80%' }}>
        <ComposableMap projectionConfig={{ scale: 180 }}>
          <Geographies geography={countriesData}>
            {({ geographies }) =>
              geographies
                .filter((geo) => isValidGeometry(geo.geometry))
                .map((geo) => {
                  const iso3Code = geo.properties['ISO3166-1-Alpha-3'];
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => handleCountryClick(geo)}
                      style={{
                        default: {
                          fill: getFillColor(iso3Code),
                          outline: 'none',
                          stroke: '#000000',
                          strokeWidth: 0.1,
                        },
                        hover: {
                          fill: '#F53',
                          outline: 'none',
                          stroke: '#000000',
                          strokeWidth: 0.3,
                        },
                        pressed: {
                          fill: '#E42',
                          outline: 'none',
                          stroke: '#000000',
                          strokeWidth: 0.3,
                        },
                      }}
                    />
                  );
                })
            }
          </Geographies>
        </ComposableMap>
      </div>

      <div style={{ width: '20%', paddingLeft: '20px' }}>
        {selectedCountry && (
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          }}>
            <h2 style={{ textAlign: 'center', fontSize: '18px', marginBottom: '15px' }}>{selectedCountry.name}</h2>

            <button
              onClick={() => handleAddOrUpdateStatus('visited')}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
            >
              Mark as Visited
            </button>

            <button
              onClick={() => handleAddOrUpdateStatus('planned')}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#27ae60'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2ecc71'}
            >
              Mark as Planned
            </button>

            {getCountryStatus(selectedCountry.code) && (
              <button
                onClick={handleDeleteStatus}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '10px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
              >
                Remove Status
              </button>
            )}
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: '20px', right: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#2ecc71',
            borderRadius: '50%',
            marginRight: '10px',
          }}></div>
          <span>Planned</span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '10px',
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#3498db',
            borderRadius: '50%',
            marginRight: '10px',
          }}></div>
          <span>Visited</span>
        </div>
      </div>
    </div>
  );
};

export default CountryMap;
