import * as fs from 'fs'
import { parse } from 'csv-parse'

// Define the interface for the CSV data
interface CSVRow {
  Account: string
  Alocation: string
}

// Function to read the CSV file, parse it, and convert it to JSON
async function convertCsvToJson(csvFilePath: string, jsonFilePath: string) {
  try {
    // Read the CSV file
    const csvData = fs.readFileSync(csvFilePath, 'utf-8')

    // Parse the CSV data
    parse(
      csvData,
      {
        columns: true,
        trim: true,
        skip_empty_lines: true,
      },
      (err, records: CSVRow[]) => {
        if (err) {
          throw err
        }

        // Convert the parsed CSV data to JSON object
        const jsonObject: { [key: string]: number } = {}

        records.forEach((record) => {
          jsonObject[record.Account] = parseInt(record.Alocation, 10)
        })

        // Write the JSON object to a file
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonObject, null, 2))

        console.log('CSV has been converted to JSON successfully!')
      }
    )
  } catch (error) {
    console.error('Error:', error)
  }
}

// Example usage
const csvFilePath = 'inputFiles/listInput.csv' // Path to your CSV file
const jsonFilePath = 'inputFiles/allowListObj.json' // Path to the output JSON file

convertCsvToJson(csvFilePath, jsonFilePath)
