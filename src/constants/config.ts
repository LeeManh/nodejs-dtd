import minimist from 'minimist'
const args = minimist(process.argv.slice(2))

export const isProduction = Boolean(args?.['production'])
