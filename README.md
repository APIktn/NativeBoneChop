tech stack
//////////////////////////////////////////
client

npx create-expo-app client
npm install @gluestack-ui/themed @gluestack-ui/config
npm install react-native-svg react-native-safe-area-context
npm install axios
npm install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context
npm install @react-navigation/native-stack

//////////////////////////////////////////
server

npm init -y
npm install express @prisma/client cors dotenv bcrypt jsonwebtoken
npm install -D prisma typescript ts-node-dev @types/node @types/express @types/cors @types/bcrypt @types/jsonwebtoken
npx tsc --init
npx prisma init

npx prisma generate
npx prisma migrate dev --name init
npx prisma db pull
npx prisma migrate deploy
npx prisma db push

env
DATABASE_URL="mysql://root:password@localhost:3306/nativebonechop"
