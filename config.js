config = {}

config.port = process.env.PORT

config.database = process.env.DATABASE

config.secret = process.env.SECRET

config.emailUser = process.env.EMAIL_USER
config.emailPassword = process.env.EMAIL_PASSWORD
config.emailHost = process.env.EMAIL_HOST
config.emailPort = process.env.EMAIL_PORT

module.exports = config