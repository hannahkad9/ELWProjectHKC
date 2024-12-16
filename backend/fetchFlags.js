import axios from 'axios';
import { writeFileSync } from 'fs';


async function fetchFlags() {
    const url = 'https://restcountries.com/v3.1/all';
    try {
        // Fetch data from the API
        const response = await axios.get(url, { timeout: 10000 });

        // Extract relevant data and add an auto-incrementing `id`
        let idCounter = 1;
        const flagsData = response.data.map((country) => ({
            id: idCounter++, // Assign an incrementing ID
            name: country.name.common,
            country: country.cca2,
            flag: Array.isArray(country.flags) ? country.flags[1] || country.flags[0] : country.flags.svg,
        }));

        // Write to a JSON file
        writeFileSync('flags.json', JSON.stringify(flagsData, null, 2));

        console.log('JSON file with all flags and IDs has been created!');
    } catch (error) {
        console.error('Error fetching data from API:', error.message);
        if (error.response) {
            console.error('Server Response:', error.response.status, error.response.data);
        }
    }
}

// Run the function
fetchFlags();
