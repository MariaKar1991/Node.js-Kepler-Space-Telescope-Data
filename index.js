const { parse } = require('csv-parse')
const fs = require('fs')

const habitablePlanets = []

function isHabitablePlanet(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  )
}

fs.createReadStream('kepler_data.csv') // source
  .pipe(
    parse({
      comment: '#',
      columns: true, // returns each row as an object
    }),
  ) // destination
  .on('data', (data) => {
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data)
    }
  })
  .on('error', (error) => {
    console.log(error)
  })
  .on('end', () => {
    console.log(
      habitablePlanets.map((planet) => {
        return planet['kepler_name']
      }),
    )
    console.log(`${habitablePlanets.length} habitable planets found!`)
  })
