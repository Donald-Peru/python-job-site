export const COUNTRIES = [
  { 
    name: 'USA', 
    code: 'US',
    states: [
      { name: 'Alabama', cities: ['Huntsville', 'Montgomery'] },
      { name: 'Alaska', cities: ['Anchorage', 'Juneau', 'Fairbanks'] },
      { name: 'Arizona', cities: ['Phoenix', 'Tucson', 'Mesa', 'Scottsdale', 'Glendale'] },
      { name: 'Arkansas', cities: ['Little Rock', 'Bentoville', 'Fayetteville'] },
      { name: 'California', cities: ['Los Angeles', 'San Diego', 'San Jose', 'San Francisco', 'Fresno', 'Sacramento', 'Long Beach', 'Bakersfield', 'Oakland', 'Santa Ana', 'Anaheim', 'Huntington Beach', 'Stockton', 'Fremont', 'Pasadena', 'San Bernardino', 'Santa Clarita', 'Modesto', 'Fontana', 'Oxnard', 'Moreno Valley', 'Richmond'] },
      { name: 'Colorado', cities: ['Denver', 'Colorado Springs', 'Aurora'] },
      { name: 'Connecticut', cities: ['Bridgeport', 'Hartford', 'Stamford', 'New Haven'] },
      { name: 'Delaware', cities: ['Wilmington', 'Dover'] },
      { name: 'District of Columbia', cities: ['Washington'] },
      { name: 'Florida', cities: ['Jacksonville', 'Miami', 'Tampa', 'Tallahassee', 'Orlando'] },
      { name: 'Georgia', cities: ['Atlanta', 'Savannah', 'Alpharetta'] },
      { name: 'Hawaii', cities: ['Honolulu'] },
      { name: 'Idaho', cities: ['Boise'] },
      { name: 'Illinois', cities: ['Chicago', 'Aurora'] },
      { name: 'Indiana', cities: ['Indianapolis'] },
      { name: 'Iowa', cities: ['Des Moines'] },
      { name: 'Kansas', cities: ['Wichita', 'Overland Park', 'Junction City', 'Olathe'] },
      { name: 'Kentucky', cities: ['Louisville', 'Lexington'] },
      { name: 'Louisiana', cities: ['New Orleans', 'Baton Rouge'] },
      { name: 'Maine', cities: ['Portland'] },
      { name: 'Maryland', cities: ['Baltimore'] },
      { name: 'Massachusetts', cities: ['Boston', 'Cambridge', 'Worcester'] },
      { name: 'Michigan', cities: ['Detroit', 'Grand Rapids'] },
      { name: 'Minnesota', cities: ['Minneapolis', 'St. Paul'] },
      { name: 'Mississippi', cities: ['Jackson'] },
      { name: 'Missouri', cities: ['Kansas City', 'St. Louis'] },
      { name: 'Montana', cities: ['Bozeman', 'Missoula', 'Helena'] },
      { name: 'Nebraska', cities: ['Omaha', 'Aurora', 'Lincoln'] },
      { name: 'Nevada', cities: ['Las Vegas', 'Henderson'] },
      { name: 'New Hampshire', cities: ['Manchester', 'Nashua', 'Concord'] },
      { name: 'New Jersey', cities: ['Jersey City', 'Newark', 'Princeton', 'Hoboken'] },
      { name: 'New Mexico', cities: ['Albuquerque', 'Las Cruces'] },
      { name: 'New York', cities: ['New York', 'Buffalo'] },
      { name: 'North Carolina', cities: ['Charlotte', 'Raleigh', 'Greensboro'] },
      { name: 'North Dakota', cities: ['Fargo', 'Bismarck'] },
      { name: 'Ohio', cities: ['Columbus', 'Cincinnati', 'Akron'] },
      { name: 'Oklahoma', cities: ['Oklahoma City', 'Tulsa'] },
      { name: 'Oregon', cities: ['Portland', 'Salem'] },
      { name: 'Pennsylvania', cities: ['Philadelphia', 'Pittsburgh'] },
      { name: 'Rhode Island', cities: ['Warwick', 'Providence'] },
      { name: 'South Carolina', cities: ['Charleston', 'Columbia', 'Greenville'] },
      { name: 'South Dakota', cities: ['Sioux Falls'] },
      { name: 'Tennessee', cities: ['Nashville', 'Memphis'] },
      { name: 'Texas', cities: ['Houston', 'San Antonio', 'Dallas', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Lubbock', 'Grand Prairie', 'Texas City'] },
      { name: 'Utah', cities: ['Salt Lake City'] },
      { name: 'Vermont', cities: ['Burlington'] },
      { name: 'Virginia', cities: ['Virginia Beach', 'Richmond', 'Newport News', 'Arlington'] },
      { name: 'Washington', cities: ['Seattle', 'Spokane', 'Spokeville'] },
      { name: 'West Virginia', cities: ['Charleston'] },
      { name: 'Wisconsin', cities: ['Milwaukee', 'Madison'] },
      { name: 'Wyoming', cities: ['Cheyenne', 'Casper'] }
    ]
  },
  { 
    name: 'UK', 
    code: 'GB',
    states: [
      { name: 'England', cities: ['London', 'Manchester', 'Bristol', 'Birmingham', 'Cambridge', 'Oxford'] },
      { name: 'Scotland', cities: ['Edinburgh', 'Glasgow'] },
      { name: 'Wales', cities: ['Cardiff', 'Swansea'] },
      { name: 'Northern Ireland', cities: ['Belfast'] }
    ]
  },
  { 
    name: 'India', 
    code: 'IN',
    states: [
      { name: 'Karnataka', cities: ['Bangalore', 'Mysore'] },
      { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur'] },
      { name: 'Telangana', cities: ['Hyderabad'] },
      { name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore'] },
      { name: 'Delhi', cities: ['New Delhi', 'Noida', 'Gurugram'] }
    ]
  },
  { 
    name: 'Canada', 
    code: 'CA',
    states: [
      { name: 'Ontario', cities: ['Toronto', 'Ottawa', 'Waterloo', 'Mississauga'] },
      { name: 'British Columbia', cities: ['Vancouver', 'Victoria'] },
      { name: 'Quebec', cities: ['Montreal', 'Quebec City'] },
      { name: 'Alberta', cities: ['Calgary', 'Edmonton'] }
    ]
  },
  { 
    name: 'Australia', 
    code: 'AU',
    states: [
      { name: 'New South Wales', cities: ['Sydney'] },
      { name: 'Victoria', cities: ['Melbourne'] },
      { name: 'Queensland', cities: ['Brisbane'] }
    ]
  },
  { 
    name: 'Germany', 
    code: 'DE',
    states: [
      { name: 'Berlin', cities: ['Berlin'] },
      { name: 'Bavaria', cities: ['Munich'] },
      { name: 'Hesse', cities: ['Frankfurt'] },
      { name: 'Hamburg', cities: ['Hamburg'] }
    ]
  }
];

export const CURRENCIES = ['USD', 'GBP', 'EUR', 'INR', 'CAD', 'AUD', 'SGD'];
export const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance'];
export const WORK_SETUPS = ['Remote', 'Onsite', 'Hybrid'];
export const SENIORITY_LEVELS = ['Entry', 'Mid', 'Senior', 'Lead', 'Manager'];
