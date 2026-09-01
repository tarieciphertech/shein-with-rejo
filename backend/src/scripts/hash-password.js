import bcrypt from 'bcryptjs'

const password = process.argv[2]

if (!password || process.argv[2].startsWith('-')) {
  console.error('Usage: npm run hash-password -- "your-password"')
  process.exit(1)
}

if (password.length < 10) {
  console.error('Please use a password of at least 10 characters.')
  process.exit(1)
}

console.log(bcrypt.hashSync(password, 12))
