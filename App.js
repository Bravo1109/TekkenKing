import 'react-native-gesture-handler';
import { StyleSheet, View, Text, Platform, SafeAreaView, Image, TouchableOpacity} from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import React, { useState, useContext, useEffect, useCallback } from "react";
import Home from './Screens/Home';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { getFocusedRouteNameFromRoute, NavigationContainer, useNavigation  } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Chat from './Screens/Chat';
import SignIn from './Screens/SignIn';
import StartPage from './Screens/StartPage';
import Profile from './Screens/Profile';
import SignUp from './Screens/SignUp';
import PhotoRegistration from './Screens/PhotoRegistration';
import MyProfile from './Screens/MyProfile';
import MainScreen from './Screens/MainScreen';
import MatchProfile from './Screens/MatchProfile';
import RatingList from './Screens/RatingList';
import CelebrityList from './Screens/CelebrityList';
import DatingNews from './Screens/DatingNews';
import DatingNewsOpened from './Screens/DatingNewsOpened';
import Parties from './Screens/Parties';
import PartyOpened from './Screens/PartyOpened';
import Swipes from './Screens/Swipes';
import LikesList from './Screens/LikesList';
import Sex from './Screens/Sex';
import NameBirthday from './Screens/NameBirthday';
import BattleHistory from './Screens/BattleHistory';
import BattleProcess from './Screens/BattleProcess';
import SelectionScreen from './Screens/SelectionScreen';
import MissHourney from './Screens/Games/MissHourney';
import Roulette from './Screens/Games/Roulette';
import Tarot from './Screens/Games/Tarot';
import Store from './Screens/Store';
import Stores from './Screens/Stores';
import Companies from './Screens/Companies';
import Goods from './Screens/Goods';
import Good from './Screens/Good';
import LobbyRandom from './Screens/LobbyRandom';
import AlfredRating from './Screens/AlfredRating';
import ActiveDialog from './images/activedialog.svg'
import ActiveLikes from './images/activeswipes.svg'
import ActiveSelection from './images/selection.svg'
import UnreadSelection from './images/selectionUpdates.svg'
import ActiveProfile from './images/activeprofile.svg'
import ActiveGames from './images/activegames.svg'
import UnreadMessages from './images/unreadmessages.svg'
import UnreadLikes from './images/unreadLikes.svg'
import { UnreadContext } from './Screens/UnreadContext';
import AppContext from './Screens/AppContext';
import ModalSlider from './Screens/ModalSlider';
import { SwipesProvider } from './Screens/ParamsContext';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
 
const myStyles = {
  title: "Chat List",
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: "#172136",
    shadowColor: "#172136",
  },
  backgroundColor: "#172136"
}
 
const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'pink' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: '#fff'
      }}
      text2Style={{
        fontSize: 15,
        fontWeight: '400',
        color: '#fff'
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
  tomatoToast: ({ text1, text2, props }) => {
    const navigation = useNavigation();

    return (
    <TouchableOpacity
      style={{ width: '90%' }} 
      activeOpacity={1}
      onPress={() => {
        console.log('pressed')
        Toast.hide();
        navigation.navigate(props.screen);
      }}
    >
    <BlurView style={{ width: '100%', borderRadius: 10, overflow: 'hidden',
     backgroundColor: 'rgba(0, 0, 0, 0.2)',  }}>
      {Platform.OS === 'android' && <LinearGradient
              colors={['#1D1D1D', '#1D1D1D']}
              start={{
                x:0,
                y:0
              }}
              end={{
                x:1,
                y:0
              }}
              style={{ width: '100%', height: '100%', position: 'absolute' }}
            />}
      
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
      <Image 
        source={{ uri: props.userImage }} 
        style={{ width: 70, height: 70, borderRadius: 100, marginRight: 10 }}
        blurRadius={props.blur}
      />
      <View style={{ flex: 1 }}>
      <Text
        style={{ fontSize: 20,
          fontWeight: '400',
          color: '#fff' }}
      >{text1}</Text>
      <Text
        style={{ fontSize: 15,
          marginTop: 10,
          fontWeight: '400',
          color: '#fff' }}
          numberOfLines={2}
          ellipsizeMode='tail'
      >{text2}</Text>
        </View>
        </View>
    </BlurView>
    </TouchableOpacity>
    )
  }
};
 
function ChatStackScreen(props) {
  return(
    <View style={styles.container}>
      <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        contentStyle: {backgroundColor: '#ffffff'},
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerTitleAlign: 'center',
        cardStyle: {
          backgroundColor: '#172136'
        },
        contentStyle: { backgroundColor: '#172136' },
        cardOverlayEnabled: false,
        detachPreviousScreen: false
      }}
      >
        <Stack.Screen name = "Home" component={Home}
          options = {{
            ...myStyles, headerLeft: null,
            headerStyle: { backgroundColor: '#0F1826', shadowColor: "transparent" },
            contentStyle: { backgroundColor: '#ededed' },
            headerShown: true
          }}
        /> 
        <Stack.Screen name = "Chat" component={Chat}
          options = {{...myStyles,
            title: "Chat",
            headerStyle: { backgroundColor: '#0F1826', shadowColor: "transparent"},
            contentStyle: { backgroundColor: '#ededed' },
            headerShown: true
          }}
        /> 
        <Stack.Screen name="PartyOpenedStack" component={PartyOpened}
          options={{
            ...myStyles, title: "Party", headerShown: false, contentStyle: { backgroundColor: '#ededed' }
          }}
        />
        <Stack.Screen name = "Profile" component={Profile}
          options = {{
            ...myStyles, title: "Profile", headerShown: false, contentStyle: { backgroundColor: '#ededed' }
          }}
        />
      </Stack.Navigator>
    </View>
  )
}

function RatingListStackScreen() {
  return(
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        headerTransparent: true,
        animationEnabled: true,
        presentation: 'card',
        gestureDirection: 'vertical',
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        cardStyle: {
          backgroundColor: '#172136'
        },
        contentStyle: { backgroundColor: '#172136' },
        headerTitleAlign: 'center',
        cardOverlayEnabled: false,
        detachPreviousScreen: false
      }}
    > 
      <Stack.Screen name="SelectionStack" component={SelectionScreen}
        options={{...myStyles, title: "Entertainment", headerLeft: null}}
      />
      <Stack.Screen name="RatingStack" component={RatingList}
        options={{ ...myStyles, title: "Rating list of your city", headerBackTitleVisible: false, headerTintColor: 'white' }}
      />
      <Stack.Screen name="BattleHistoryStack" component={BattleHistory}
        options={{ ...myStyles, title: "Battle History", headerShown: false }}
      />
      <Stack.Screen name="BattleProcessStack" component={BattleProcess}
        options={{ ...myStyles, title: "Battle Process", headerShown: false }}
      />
      <Stack.Screen name="StoresStack" component={Stores}
        options={{ ...myStyles, title: "Stores", contentStyle: { backgroundColor: '#ededed' }, headerBackTitleVisible: false, headerTintColor: 'white' }}
      />
      <Stack.Screen name = "Store" component={Store}
        options = {{...myStyles, title: "Store", headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, gestureDirection: 'horizontal', contentStyle: { backgroundColor: '#ededed' }}}
      />
      <Stack.Screen name="CompaniesStack" component={Companies}
        options={{ ...myStyles, title: "Companies", headerTintColor: 'white', headerShown: false}}
      /> 
      <Stack.Screen name="GoodsStack" component={Goods}
        options={{ ...myStyles, title: "Goods", headerBackTitleVisible: false, headerShown: true, headerTintColor: 'white', cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, gestureDirection: 'horizontal' }}
      />
      <Stack.Screen name = "Good" component={Good}
        options = {{...myStyles, title: "Good", headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, gestureDirection: 'horizontal'}}
      />
      <Stack.Screen name="CelebrityStack" component={CelebrityList}
        options={{...myStyles, title: "Top celebrities", headerBackTitleVisible: false}}
      />
      <Stack.Screen name="DatingNewsStack" component={DatingNews}
        options={{...myStyles, title: "Dating News", headerBackTitleVisible: false,}}
      />
      <Stack.Screen name="DatingNewsOpenedStack" component={DatingNewsOpened}
        options={{...myStyles, title: "News", headerShown: false}}
      />
      <Stack.Screen name="PartiesStack" component={Parties}
        options={{...myStyles, title: "Parties", headerBackTitleVisible: false,}}
      />
      <Stack.Screen name="PartyOpenedStack" component={PartyOpened}
        options={{...myStyles, title: "Party", headerShown: false}}
      />
      <Stack.Screen name = "Profile" component={Profile}
        options = {{...myStyles, title: "Profile", headerShown: false, cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, gestureDirection: 'horizontal'}}
      />
      <Stack.Screen name = "Roulette" component={Roulette}
          options = {{...myStyles, title: "Roulette", headerShown: false, headerLeft: null}}
      />
      <Stack.Screen name = "Tarot" component={Tarot}
          options = {{...myStyles, title: "Tarot", headerShown: false, headerLeft: null}}
      />
      <Stack.Screen name = "LobbyRandom" component={LobbyRandom}
          options = {{...myStyles, title: "Lobby random", headerShown: false, headerLeft: null}}
      />
      <Stack.Screen name = "AlfredRating" component={AlfredRating}
          options = {{...myStyles, title: "Alfred and fan girl", headerShown: false, headerLeft: null}}
      />
      <Stack.Screen name = "MissHourney" component={MissHourney}
           options = {{...myStyles, title: "Miss Hourney", headerShown: false, headerLeft: null}}
       />
    </Stack.Navigator>
  )
}

function MainStackScreen() {
  return(
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animationEnabled: true,
        gestureDirection: 'vertical',
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        cardStyle: {
          backgroundColor: '#000'
        },
        headerTitleAlign: 'center'
      }}
    >
      <Stack.Screen name="SelectionStack" component={MainScreen}
        options={{...myStyles, title: "Main", headerLeft: null}}
      />
    </Stack.Navigator>
  )
}

function ProfileStackScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        detachPreviousScreen: false
      }}
    >
      <Stack.Screen name="MyProfile" component={MyProfile}
      options={{...myStyles, title: "My Profile", headerLeft: null, headerShown: false}}
       />
    </Stack.Navigator>
  );
}

function SwipeStackScreen() {
  return (
    <Stack.Navigator
    >
      <Stack.Screen name="SwipesPage" component={Swipes}
      options={{...myStyles,
         title: "Swipes", 
         headerLeft: null,
         headerShown: false
        }}
      />
      
      <Stack.Screen name = "Profile" component={Profile}
        options = {{...myStyles, title: "Profile", headerShown: false}}
      />
    </Stack.Navigator>
  )
}

// function GamesStackScreen() {
//   return(
//     <View style={styles.container}>
//     <Stack.Navigator
//       screenOptions={{
//         gestureEnabled: false,
//         headerTransparent: true,
//         animationEnabled: true,
//         gestureDirection: 'vertical',
//         cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
//         cardStyle: {
//           backgroundColor: '#000'
//         },
//         headerTitleAlign: 'center'
//       }}
//     >
//       <Stack.Screen name="Games" component={Games}
//       options={{...myStyles, title: "Games", headerLeft: null}}
//       />
//       <Stack.Screen name = "MissHourney" component={MissHourney}
//           options = {{...myStyles, title: "Miss Hourney", headerShown: false, headerLeft: null}}
//       />
//       <Stack.Screen name = "Roulette" component={Roulette}
//           options = {{...myStyles, title: "Roulette", headerShown: false, headerLeft: null}}
//       />
//       <Stack.Screen name = "Tarot" component={Tarot}
//           options = {{...myStyles, title: "Tarot", headerShown: false, headerLeft: null}}
//       />
//       <Stack.Screen name = "LobbyRandom" component={LobbyRandom}
//           options = {{...myStyles, title: "Lobby random", headerShown: false, headerLeft: null}}
//       />
//     </Stack.Navigator>
//     </View>
//   )
// }

function LikeStackScreen() {
  return(
    <Stack.Navigator
      screenOptions={{
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        headerTitleAlign: 'center'
      }}
    >
      <Stack.Screen name="Likes List" component={LikesList}
      options={{...myStyles, title: "Likes", headerLeft: null}}
      />
      <Stack.Screen name = "Profile" component={MatchProfile}
        options = {{...myStyles, title: "Profile", headerShown: false}}
      />
    </Stack.Navigator>
  )
}

function SignupStackScreen() {
  return(
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        detachPreviousScreen: false
      }}
    >
      <Stack.Screen name = "Sex" component={Sex}
        options = {{...myStyles, headerShown: false}}
      />
      <Stack.Screen name = "NameBirthday" component={NameBirthday}
        options = {{...myStyles, headerShown: false}}
      />
      <Stack.Screen name = "PhotoAdd" component={PhotoRegistration}
        options = {{...myStyles, headerShown: false}}
      />
      <Stack.Screen name = "UserInfo" component={SignUp}
        options = {{...myStyles, headerShown: false}}
      />
    </Stack.Navigator>
  )
}

function LoginScreen() {
  return(
    <Stack.Navigator
      screenOptions={{
        gestureDirection: 'vertical-inverted',
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
        detachPreviousScreen: false
      }}
    >
      <Stack.Screen name = "StartScreen" component={StartPage}
          options = {{...myStyles, headerLeft: null, headerShown: false}}
        />
        <Stack.Screen name = "ModalSlider" component={ModalSlider}
        options = {{...myStyles, title: "Modal", headerShown: false, presentation: 'transparentModal' }}
      />
      <Stack.Screen name="App" component={App}
          options = {{...myStyles, headerLeft: null, headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen name = "Signin" component={SignIn}
          options = {{...myStyles, title: "Sign in", headerLeft: null, gestureEnabled: false, headerTransparent: true}}
      />
      {/* <Stack.Screen name = "Signup" component={SignupStackScreen}
          options = {{...myStyles, title: "Sign up", gestureEnabled: false, headerStyle: {backgroundColor: '#0F1826', shadowColor: '#0F1826'} , headerTintColor: 'white'}}
      /> */}
      <Stack.Screen name = "Signup" component={SignupStackScreen}
          options = {{...myStyles, title: "Sign up", headerShown: false, headerLeft: null}}
      />
    </Stack.Navigator>
  )
}

function App(props) {
  const routeOne = useRoute()
  const [tabBarPosition, setTabBarPosition] = useState('relative');
  const { hasMessages } = useContext(UnreadContext);
  const { hasLobby } = useContext(UnreadContext);
  const { hasMatches } = useContext(UnreadContext);
  const { hasLikes } = useContext(UnreadContext);
  const { hasReactions } = useContext(UnreadContext);
  const { hasAlfredMes } = useContext(UnreadContext);
  const { hasPartyRequests } = useContext(UnreadContext);
  const { hasAcceptedPartyRequests } = useContext(UnreadContext);
  // useEffect(() => {
  //   const routeName = getFocusedRouteNameFromRoute(routeOne) ?? '';
  //   if (routeName === "SelectionStack" || routeName === "RatingStack" || routeName === "RatingList" || routeName === "Roulette") {
  //     setTabBarPosition('absolute');
  //   } else {
  //     setTabBarPosition('relative');
  //   }
  // }, [routeOne]);
  const IconComponent = ({color1, color2, color3, color4}) => {
    return (
      <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="54"
      height="62"
      fill="none"
      viewBox="0 0 47 54"
    >
      <G clipPath="url(#clip0_616_4109)">
        <Path
          fill={color1}
          d="M45.266 29.628c-1.486-.257-11.225-1.17-16.258-.171-7.305.86-4.536.859-10.999 0-5.118-1-14.79-.086-16.276.17-1.485.258-1.864.6-1.696 1.74.136.923.364 1.11 1.205 1.737.841.627 1.416 4.674 2.313 7.554.897 2.878.953 3.904 8.101 3.904 3.753 0 5.828-.532 7.117-1.66 1.629-1.427 1.952-3.604 2.26-4.595.551-1.776.827-3.35 1.22-4.26.637-1.483 1.857-1.483 2.495 0 .392.912.668 2.484 1.22 4.26.308.992.631 3.168 2.26 4.594 1.288 1.129 3.364 1.661 7.116 1.661 7.148 0 7.204-1.025 8.101-3.904.898-2.879 1.472-6.926 2.313-7.554.84-.627 1.07-.815 1.206-1.738.166-1.14-.213-1.481-1.698-1.738zM17 42c-1.202 1.2-4.135 1.06-7 1-1.72-.035-2 0-3-.5-1.007-.688-1.571-1.56-2-3C3.5 33 5 32 5 32c1-1 4.4-.998 7-1 3.32-.003 6.173.181 7 1 1.555 1.54.439 7.563-2 10zm25-2.5c-.34 1.528-.993 2.312-2 3-1 .5-1.4.467-3 .5-2.865.06-5.798.2-7-1-2.439-2.437-3.556-8.46-2-10 .871-.862 3.68-1.003 7-1 2.6.002 6 0 7 1 0 0 1.445 1 0 7.5z"
        ></Path>
        <Path
          fill={color2}
          d="M14.652 40.227a.588.588 0 01-.422-.179l-5.489-5.58a.615.615 0 010-.86.59.59 0 01.846 0l5.489 5.58a.615.615 0 010 .86.593.593 0 01-.424.179z"
        ></Path>
        <Path
          fill={color2}
          d="M9.199 40.21a.587.587 0 01-.422-.178.615.615 0 010-.86l5.489-5.58a.59.59 0 01.845 0 .615.615 0 010 .859l-5.489 5.58a.595.595 0 01-.423.179z"
        ></Path>
        <Path
          fill={color3}
          d="M37.54 37.432c-.742 1.03-1.827 1.88-2.936 2.467h.503c-1.143-.606-2.269-1.491-3.01-2.573-.364-.53-.726-1.181-.543-1.845.15-.543.606-.971 1.16-1.049.751-.105 1.38.363 1.711 1.016.167.33.694.33.86 0 .232-.46.584-.827 1.083-.968.443-.124.934-.055 1.297.243.338.278.548.707.541 1.15-.009.58-.344 1.104-.665 1.56-.157.222-.039.563.178.693.25.148.525.041.682-.182.452-.643.855-1.416.797-2.232a2.523 2.523 0 00-.985-1.83c-.588-.45-1.364-.571-2.071-.389-.754.194-1.366.75-1.717 1.443h.86c-.567-1.123-1.852-1.812-3.079-1.422-1.148.365-1.843 1.554-1.66 2.75.175 1.139 1.034 2.139 1.839 2.898.438.413.913.794 1.413 1.129.235.159.478.312.73.443.206.105.36.143.578.039.153-.073.3-.163.444-.251 1.09-.66 2.098-1.537 2.85-2.58.158-.22.036-.565-.179-.693-.25-.149-.52-.037-.68.183z"
        ></Path>
        <G filter="url(#filter0_d_616_4109)">
          <Path
            fill={color4}
            d="M3.525 0h39.95a4 4 0 01-4 4H7.525a4 4 0 01-4-4z"
          ></Path>
        </G>
      </G>
    </Svg>
    );
  }

  return (

    <View style={styles.container}>
      <StatusBar style="light" />
      <Tab.Navigator
       initialRouteName='Swipes'
       screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'ChatList') {
            iconName = hasMessages || hasReactions ? <UnreadMessages width={90} color={focused ? '#6183FF' : '#58606B'} fill={focused ? '#6183FF' : '#0F1825'}/> : <ActiveDialog width={90} color={focused ? '#6183FF' : '#58606B'} fill={focused ? '#6183FF' : '#0F1825'}/>;
          } else if (route.name === 'Settings') {
            iconName = <ActiveProfile width={90} color={focused ? '#6183FF' : '#58606B'} fill={focused ? '#6183FF' : '#0F1825'}/>;
          } else if (route.name === 'GamesList') {
            iconName = <ActiveGames width={90} color={focused ? '#6183FF' : '#58606B'} fill={focused ? '#6183FF' : '#0F1825'}/>;
          // } else if (route.name === 'RatingList') {
          //   iconName = focused ? 'users' : 'users';
          } else if (route.name === 'RatingList') {
            iconName = hasLobby || hasAlfredMes || hasPartyRequests.length > 0 || hasAcceptedPartyRequests.length > 0 ? <UnreadSelection width={90} color={focused ? '#6183FF' : '#58606B'} fill={focused ? '#6183FF' : '#0F1825'}/> : <ActiveSelection width={90} color={focused ? '#6183FF' : '#58606B'} fill={focused ? '#6183FF' : '#0F1825'} stroke={focused ? '#6183FF' : '#0F1825'}/>;
          }
          else if (route.name === 'Main') {
            iconName = <IconComponent width={90} color1={focused ? '#6183FF' : '#58606B'} color2={focused ? '#FF1D1D' : '#58606B'} color3={focused ? '#FFFF12' : '#58606B'} color4={focused ? '#6183FF' : '#0F1825'}/>;
          }
          else if (route.name === 'Swipes') {
            iconName = <IconComponent width={90} color1={focused ? '#6183FF' : '#58606B'} color2={focused ? '#FF1D1D' : '#58606B'} color3={focused ? '#FFFF12' : '#58606B'} color4={focused ? '#6183FF' : '#0F1825'}/>;
          } else if (route.name === 'Likes') {
            iconName = hasMatches || hasLikes ? <UnreadLikes width={90} color={focused ? '#6183FF' : '#58606B'} fill={focused ? '#6183FF' : '#0F1825'}/> : <ActiveLikes width={90} color={focused ? '#6183FF' : '#58606B'} fill={focused ? '#6183FF' : '#0F1825'}/>;
          } 
          return <View style={[focused ? {shadowOpacity: 0.5, borderTopColor: '#6183FF'} : {shadowOpacity: 0, borderTopColor: '#0F1825'}, { shadowColor: '#6183FF', shadowOffset: {width: 0, height: 2},
          shadowRadius: 15, position: 'absolute', top: 0 }]}>
            <View style={[focused ? {shadowOpacity: 1} : {shadowOpacity: 0}, { shadowColor: '#6183FF', shadowOffset: {width: 0, height: 2},
          shadowRadius: 15, elevation: 5 }]}>
            {/* <Icon name={iconName} size={28} color={color} style={[{ shadowColor: '#6083FF', shadowOffset: {width: 0, height: 2},
          shadowRadius: 5, elevation: 5, shadowOpacity: 0, overflow: 'visible'}, Platform.OS ==='android' && ([{textShadowColor: '#6083FF',
          textShadowOffset: {width:0, height: 2}, height: '100%', width: 60, textAlign: 'center', alignItems: 'center',
          paddingTop: 20}, focused ? {textShadowRadius: 40}: {textShadowRadius: 0}])]} /> */}
          {iconName}
          </View>
          </View>
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#6082FF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          zIndex: 0,
          paddingHorizontal: 10,
          backgroundColor: '#0F1825',
          position: (route.name === "SelectionStack" || route.name === "RatingStack" || route.name === "RatingList" || route.name === "Roulette") ? 'absolute' : 'relative',
          // zIndex: getFocusedRouteNameFromRoute(route) === "MissHourney" && -100,
          borderTopWidth: 0,
          height: 90,
          display: getFocusedRouteNameFromRoute(route) === "Chat" || getFocusedRouteNameFromRoute(route) === "Profile" || getFocusedRouteNameFromRoute(route) === "MissHourney" || getFocusedRouteNameFromRoute(route) === "Roulette" || getFocusedRouteNameFromRoute(route) === "Tarot" || getFocusedRouteNameFromRoute(route) === "LobbyRandom" || getFocusedRouteNameFromRoute(route) === "AlfredRating" || getFocusedRouteNameFromRoute(route) === "DatingNewsOpenedStack" || getFocusedRouteNameFromRoute(route) === "PartyOpenedStack" || getFocusedRouteNameFromRoute(route) === "BattleHistoryStack" || getFocusedRouteNameFromRoute(route) === "BattleProcessStack" ? "none" : "flex"
        }
      })}
      >
        {/* <Tab.Screen name = "GamesList" component={GamesStackScreen}
        options = {{...myStyles, title: "Games list", headerShown: false}}
        /> */}
        <Tab.Screen name = "RatingList" component={RatingListStackScreen}
        options = {{...myStyles, title: "Rating list", headerShown: false}}
        />
        {/* <Tab.Screen name = "Likes" component={LikeStackScreen} 
        options = {{...myStyles, title: "Likes", headerShown: false}}
        />
        <Tab.Screen name = "Swipes" component={SwipeStackScreen} 
        options = {{...myStyles, title: "Swipes", headerShown: false}}
        /> */}
        <Tab.Screen name = "ChatList" component={ChatStackScreen}
        options = {{...myStyles, title: "Chats", headerShown: false}}
        />
        <Tab.Screen name = "Settings" component={ProfileStackScreen}
        options = {{...myStyles, title: "Profile", headerShown: false}}
        />
      </Tab.Navigator>
    </View>
  );
}

export default() => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [hasMessages, setHasMessages] = useState(false);
  const [hasLobby, setHasLobby] = useState(false);
  const [hasMatches, setHasMatches] = useState(false);
  const [hasLikes, setHasLikes] = useState(false);
  const [hasReactions, setHasReactions] = useState(false);
  const [hasAlfredMes, setHasAlfredMes] = useState(false);
  const [hasPartyRequests, setHasPartyRequests] = useState(false);
  const [hasAcceptedPartyRequests, setHasAcceptedPartyRequests] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(Entypo.font);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SwipesProvider>
      <StatusBar
        translucent={true}
      />
    <UnreadContext.Provider value={{hasMessages, setHasMessages, hasLobby, setHasLobby, hasMatches, setHasMatches, hasLikes, setHasLikes, hasReactions, setHasReactions, hasAlfredMes, setHasAlfredMes, hasPartyRequests, setHasPartyRequests, hasAcceptedPartyRequests, setHasAcceptedPartyRequests}}>
    <View style={styles.container} onLayout={onLayoutRootView}>
    <NavigationContainer ref={ref => AppContext.navigationRef = ref}>
      <LoginScreen/>
      <Toast config={toastConfig} />
    </NavigationContainer>
    </View>
    </UnreadContext.Provider>
    </SwipesProvider>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
    // marginTop: Constants.statusBarHeight,
  },
});