

export default ()=>({
    port: parseInt(process.env.PORT || '3009',10),
    datatbase: {
        uri:process.env.MONGO_URI || 'mongodb+srv://achukappithan4236:3bNu4vRXiud0wGoI@cluster0.vcub27g.mongodb.net/FobVerse?retryWrites=true&w=majority&appName=Cluster0'
    },

  email: {
    user: process.env.EMAIL_USER || 'fobverseweb@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'wzdn oqol kgfp tlav',
  },
  app: {
    baseUrl: process.env.APP_BASE_URL || 'http://localhost:3008',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200',
  },
  jwt: {
    verificationSecret: process.env.JWT_VERIFICATION_SECRET || '070b7e664a136486a860b16cd3fcf0edad5b72a803296fac030fa8f9290bc5c8',
    verificationExpiresIn: process.env.JWT_VERIFICATION_EXPIRES_IN || '6h', 

    authSecret: process.env.JWT_AUTH_SECRET || 'ca34962aea35a47c58fce118d56d62e44a73f4b60dddaec69da5a713b37544e3',
    authExpiresIn: process.env.JWT_AUTH_EXPIRES_IN || '7d',
  }
})