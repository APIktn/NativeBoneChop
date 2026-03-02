tech stack
//////////////////////////////////////////////////
client
npx expo start 
npx expo start --tunnel
npx expo start --no-dev --minify --tunnel

npx create-expo-app client
npx expo install expo-secure-store
npx expo install expo-av
npx expo install @expo/vector-icons
npm install axios
npm install --save-dev react-test-renderer@19.1.0
npm install --save-dev @testing-library/react-native@13.2.0

//////////////////////////////////////////////////
server

server
npm run start:dev
npm run test

npm install -g @nestjs/cli
nest new server
npm install @nestjs/config
npm install class-validator class-transformer
npm install prisma@6.19.2 @prisma/client@6.19.2
npx prisma init
npx prisma generate
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install @nestjs/mapped-types
npm install -D @types/bcrypt
npm install @nestjs/platform-express multer
npm install -D @types/multer
npm install cloudinary

nest g module test
nest g service test
nest g controller test

npx prisma migrate dev --name init
npx prisma migrate deploy

//////////////////////////////////////////////////
note

https://icons.expo.fyi/Index