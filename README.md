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
npm install express prisma @prisma/client cors dotenv bcrypt jsonwebtoken
npm install -D nodemon
