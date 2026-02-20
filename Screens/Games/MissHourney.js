import React, {useState ,useEffect, useRef} from 'react'
import { Text, View, FlatList, StyleSheet, Image, TouchableOpacity,
    ActivityIndicator, ImageBackground, Animated, Vibration } from 'react-native'
import * as Haptics from 'expo-haptics';
import { useIsFocused } from "@react-navigation/native";
import Male from '../../images/male.png'
import MissH from '../../images/missh/missh_nobg_standart.png'
import MissHSmile from '../../images/missh/missh_nobg_smile.png'
import MissHRed from '../../images/missh/missh_nobg_red.png'
import MissHAngry from '../../images/missh/miss_nobg_angry.png'
import MissH2 from '../../images/missh/missH2.jpg'
import HouseOutside from '../../images/missh/house_outside.jpg'
import Porch from '../../images/missh/porch.jpg'
import PorchOpened from '../../images/missh/door_opened.png'
import Entrance from '../../images/missh/entrance_inside.jpg'
import MissHBedroom from '../../images/missh/missh_bedroom.jpg'
import PlayerBedroom from '../../images/missh/player_bedroom.jpg'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { CommonActions } from '@react-navigation/native';
import Tipewriter from './Tipewriter';

function MissHourney(props) {
    getTokenData = async () => {
        try {
            tokenData = await AsyncStorage.getItem('token')
            return tokenData
        } catch(e) {
            console.log('error', e)
        }
      }
      const [animEnd, setAnimEnd] = useState(false)
      const male = Image.resolveAssetSource(Male).uri
      const missH = Image.resolveAssetSource(MissH).uri
      const missHSmile = Image.resolveAssetSource(MissHSmile).uri
      const missHRed = Image.resolveAssetSource(MissHRed).uri
      const missHAngry = Image.resolveAssetSource(MissHAngry).uri
      const missHourney = Image.resolveAssetSource(MissH2).uri
      const houseOutside = Image.resolveAssetSource(HouseOutside).uri
      const porch = Image.resolveAssetSource(Porch).uri
      const porchOpened = Image.resolveAssetSource(PorchOpened).uri
      const entrance = Image.resolveAssetSource(Entrance).uri
      const missHBedroom = Image.resolveAssetSource(MissHBedroom).uri
      const playerBedroom = Image.resolveAssetSource(PlayerBedroom).uri
      const isFocused = useIsFocused();
      const [currentPage, setCurrentPage] = useState(1);
      const [nextPageIsNull, setNextPageIsNull] = useState(false)
      const token = getTokenData()
      const [data, setData] = useState([])
      const [loading, setLoading] = useState(false)
      const opacityAnim = useRef(new Animated.Value(1)).current;
      const opacityAnimBg = useRef(new Animated.Value(1)).current;
      const opacityAnimAll = useRef(new Animated.Value(1)).current;
      const scaleAnim = useRef(new Animated.Value(1)).current;
      const opacityAnimCharacter = useRef(new Animated.Value(0)).current;
      const opacityAnimCharacterV1 = useRef(new Animated.Value(0)).current;
      const opacityAnimCharacterV2 = useRef(new Animated.Value(0)).current;
      const opacityAnimCharacterV3 = useRef(new Animated.Value(0)).current;
      const opacityScreenWithText = useRef(new Animated.Value(0)).current;
      const opacityTextOnBlackscreen = useRef(new Animated.Value(0)).current;
      const [screenWithTextShown, setScreenWithTextShown] = useState(false)
      const scaleAnimCharacter = useRef(new Animated.Value(1)).current;
      const translateAnimCharacter = useRef(new Animated.Value(-100)).current;
      const opacityAnswers = useRef(new Animated.Value(0)).current;
      const opacityDialog = useRef(new Animated.Value(0)).current;
      const [displayStart, setDisplayStart] = useState('flex')
      const [screenId, setScreenId] = useState(0)
      const [buttonsActive, setButtonsActive] = useState(false)
      let timeOutOne;
      const gameArr = [
        {'id': 1, 'image': missHourney, 'image_next': '', 'image_next_character': '', 'image_next_character_v1': '', 'image_next_character_v2': '', 'image_next_bg': '', 'dialog': '', 'buttonOne': '', 'buttonTwo': '', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {}, 'buttonOneF': () => {}},
        {'id': 2, 'image': houseOutside, 'image_next': '', 'image_next_character': '', 'image_next_character_v1': '', 'image_next_character_v2': '', 'image_next_bg': '', 'dialog': 'Вы: Ну вот. Вроде это тот дом. Надеюсь хозяева адекватные... Не хотелось бы снимать комнату с идиотами.', 'buttonOne': 'Подойти', 'dialog_continue': () => {}, 'buttonTwo': 'Уйти', 'duration': 1000, 'scaleBg': 1.5, 'bgText': '', 'buttonOneF': () => {
            // animateScale(1)
            animateOpacity(3, 1, 2)
            opacityAnswers.setValue(0)
            opacityDialog.setValue(0)
        }, 'buttonTwoF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          setTimeout(() => {
            props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
          }, 1000)
        }},
        {'id': 3, 'image': porch, 'image_next': porchOpened, 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': entrance, 'dialog': 'Вы: ...', 'buttonOne': 'Вежливо постучать', 'buttonTwo': 'Зажать звонок, пока не откроют.', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {}, 'buttonOneF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          const interval = setInterval(() => {
            Haptics.impactAsync(
              Haptics.ImpactFeedbackStyle.Heavy
            )
          }, 300);
          setTimeout(() => clearInterval(interval), 700);
          setTimeout(() => {
            animateOpacity(4, 1, 3)
          }, 2000)
          
        }, 'buttonTwoF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          const interval = setInterval(() => Vibration.vibrate(400), 0);
          setTimeout(() => clearInterval(interval), 3000);
          setTimeout(() => {
            animateOpacity(7, 4, 21)
          }, 3000)
        }},
        {'id': 4, 'image': porchOpened, 'image_next': porchOpened, 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': entrance, 'dialog': 'Мисс Хорни: Какой сексуа... то есть симпатичный молодой человек! Я вся в вашем распоряжении!', 'buttonOne': 'Я по поводу съема комнаты.', 'buttonTwo': 'Я, пожалуй, на улице переночую', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {}, 'buttonOneF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          animateOpacity(5, 1, 4)
        }, 'buttonTwoF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          animateOpacity(7, 2, 23)
        }},
        {'id': 5, 'image': porchOpened, 'image_next': porchOpened, 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': entrance, 'dialog': 'Мисс Хорни: Я тебя уже заждалась, Апполон! Заходи скорее!', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            opacityDialog.setValue(0)
            animateOpacity(3, 1, 5)
          }, 1500)
        }, 'buttonOneF': () => {}},
        {'id': 6, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': entrance, 'dialog': 'Мисс Хорни: Чувствуй себя как дома!', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          setTimeout(() => {
            animateOpacity(7, 3, 6)
          }, 1000)
        }, 'buttonOneF': () => {}},
        {'id': 7, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': entrance, 'dialog': 'Мисс Хорни: Сегодня так жарко, ты весь вспотел. Можешь снять футболочку. Не стесняйся.', 'buttonOne': 'И вправду жарковато, пожалуй сниму', 'buttonTwo': 'Где моя комната?', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {}, 'buttonOneF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 2, 7)
          }, 1000)
        }, 'buttonTwoF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 2, 24)
          }, 1000)
        }},
        {'id': 8, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': entrance, 'dialog': 'Мисс Хорни: Вот это мужчина! Какой мускулистый! Сейчас укушу!', 'buttonOne': 'Что вы себе позволяете?!', 'buttonTwo': '"Стыдливо поблагодарить бабку за мерзкий комплимент"', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {}, 'buttonOneF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 1, 8)
          }, 1000)
        }, 'buttonTwoF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 2, 33)
          }, 1000)
        }},
        {'id': 9, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': entrance, 'dialog': 'Мисс Хорни: Вы посмотрите. У нас тут недотрожка.', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          setTimeout(() => {
            opacityDialog.setValue(0)
            animateOpacity(7, 2, 9)
          }, 1500)
        }, 'buttonOneF': () => {}},
        {'id': 10, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': entrance, 'dialog': 'Мисс Хорни: Ничего, я сделаю из тебя мужчину! Пойдем покажу тебе твой новый дом.', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          setTimeout(() => {
            opacityDialog.setValue(0)
            animateOpacity(3, 1, 10)
          }, 1500)
        }, 'buttonOneF': () => {}},
        {'id': 11, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': missHBedroom, 'dialog': 'Мисс Хорни: Вот здесь наша комната. Кроватка просторная, тесно не будет. Тем более я сейчас на строгой диете!', 'buttonOne': 'Что значит "наша"? Совсем крыша поехала?', 'buttonTwo': 'Робко промолчать', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {}, 'buttonOneF': () => {
          opacityDialog.setValue(0)
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 3, 11)
          }, 1000)
        }, 'buttonTwoF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 2, 26)
          }, 1000)
        }},
        {'id': 12, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': missHBedroom, 'dialog': 'Мисс Хорни: Я подумала, что так будет безопаснее. А вдруг бандиты? Вдвоем мы от них отобъемся!', 'buttonOne': 'Прошу вас немедленно проводить меня в мою комнату!', 'buttonTwo': 'Если ты мне сейчас же не покажешь мою комнату, то здесь и в правду все будет выглядеть так, как будто напали бандиты', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {}, 'buttonOneF': () => {
          opacityDialog.setValue(0)
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 1, 12)
          }, 1000)
        }, 'buttonTwoF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 1, 12)
          }, 1000)
        }},
        {'id': 13, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': missHBedroom, 'dialog': 'Мисс Хорни: Ой, да хорошо, хорошо... Нервный какой. Твоя комната внизу, идем.', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 2000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          setTimeout(() => {
            animateOpacity(7, 1, 13)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 14, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': missHBedroom, 'dialog': 'Вы: Но мы же на первом этаже...', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 2000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          setTimeout(() => {
            animateOpacity(7, 2, 14)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 15, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': missHBedroom, 'dialog': 'Мисс Хорни: Все правильно.', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          setTimeout(() => {
            opacityDialog.setValue(0)
            animateOpacity(88, 1, 15)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 16, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': 'Мисс Хорни: Вот твои аппартаменты. Располагайся!', 'buttonOne': 'Я буду жить в подвале?', 'buttonTwo': 'Ну что вы... Такие шикарные условия я уступлю вам, мисс Хорни', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {}, 'buttonOneF': () => {
          opacityDialog.setValue(0)
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 1, 16)
          }, 1000)
        }, 'buttonTwoF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 2, 43)
          }, 1000)
        }},
        {'id': 17, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': 'Мисс Хорни: Ой, а что случилось, дорогой?', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          setTimeout(() => {
            animateOpacity(7, 1, 17)
          }, 1000)
        }, 'buttonOneF': () => {}},
        {'id': 18, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': 'Мисс Хорни: Сладкой попочке не понравились условия проживания?', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 100, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          setTimeout(() => {
            animateOpacity(7, 3, 18)
          }, 2000)
        }, 'buttonOneF': () => {}},
        {'id': 19, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': 'Мисс Хорни: Что ж, я знаю одну красивую комнатку наверху. Правда там уже проживает одна уважаемая леди. Но, думаю, она согласится немножко потесниться.', 'buttonOne': 'Меня все устраивает, я остаюсь здесь', 'buttonTwo': '"Высказать старой дряни все, что я думаю по этому поводу"', 'duration': 1000, 'bgText': '', 'scaleBg': 1, 'dialog_continue': () => {}, 'buttonOneF': () => {
          opacityDialog.setValue(0)
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 2, 19)
          }, 1000)
        }, 'buttonTwoF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 3, 35)
          }, 1000)
        }},
        {'id': 20, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': 'Мисс Хорни: Ну, тогда спокойной ночи. Ни в чем себе не отказывай.', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          setTimeout(() => {
            animateOpacity(7, 5, 20)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 21, 'image': playerBedroom, 'image_next': playerBedroom, 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': ' ', 'buttonOne': 'Лечь спать', 'buttonTwo': 'Догнать суку, и показать как разговаривать с мужчиной', 'duration': 2500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {}, 'buttonOneF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 5, 48)
          }, 1000)
        }, 'buttonTwoF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 5, 47)
          }, 1000)
        }},


        {'id': 22, 'image': porchOpened, 'image_next': porchOpened, 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': entrance, 'dialog': 'Мисс Хорни: ЧТО ЗА МУДА....', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            opacityDialog.setValue(0)
            animateOpacity(7, 3, 22)
          }, 1500)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 23, 'image': porchOpened, 'image_next': porchOpened, 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': entrance, 'dialog': 'Мисс Хорни: То есть - Какой симпатичный молодой человек! Чем могу быть любезна?', 'buttonOne': 'Я по поводу съема комнаты.', 'buttonTwo': 'Я, пожалуй, на улице переночую', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {}, 'buttonOneF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 2, 4)
          }, 1500)
        }, 'buttonTwoF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 2, 23)
          }, 1500)
        }},
        {'id': 24, 'image': porchOpened, 'image_next': porchOpened, 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': entrance, 'dialog': 'Мисс Хорни: Ой, ну что ты... Ты ведь по поводу проживания? Я тебя уже заждалась, Апполон! Проходи скорее!', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            opacityDialog.setValue(0)
            animateOpacity(3, 1, 5)
          }, 1500)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 25, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': entrance, 'dialog': 'Мисс Хорни: Вот это мужчина! Сразу переходит к делу!', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            opacityDialog.setValue(0)
            animateOpacity(7, 2, 25)
          }, 1500)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 26, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': entrance, 'dialog': 'Мисс Хорни: Чтож, пойдем, покажу тебе твой новый дом.', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            opacityDialog.setValue(0)
            animateOpacity(3, 1, 10)
          }, 1500)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 27, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': missHBedroom, 'dialog': 'Мисс Хорни: Хотя, конечно, на слово верить не стоит... Лучше все проверить прямо сейчас!', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            opacityDialog.setValue(0)
            animateOpacity(8, 2, 27)
          }, 1500)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 28, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': missHBedroom, 'dialog': 'Мисс Хорни: Ты выглядишь довольно уставшим... Нужно срочно отдохнуть! Пойдем-ка приляжем!', 'buttonOne': 'Отойди от меня', 'buttonTwo': '"Демонстративно блевануть"', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {}, 'buttonOneF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          setTimeout(() => {
            animateOpacity(9, 1, 30)
          }, 700)
        }, 'buttonTwoF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          setTimeout(() => {
            animateOpacity(9, 4, 28)
          }, 700)
        }},
        {'id': 29, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': missHBedroom, 'dialog': 'Мисс Хорни: ТЫ СОВСЕМ ЧТОЛИ, ГНИДА, ОХЕРЕЛ?', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 4, 29)
          }, 1500)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 30, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': missHBedroom, 'dialog': 'Мисс Хорни: ЭТО ЧТО ЕЩЕ ЗА ВЫХОДКИ, СВИНЬЯ?!', 'buttonOne': 'Я начинаю терять терпение!', 'buttonTwo': 'Я вызываю неотложку!', 'duration': 1000, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {}, 'buttonOneF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 1, 12)
          }, 700)
        }, 'buttonTwoF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 1, 12)
          }, 700)
        }},
        {'id': 31, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': missHBedroom, 'dialog': 'Мисс Хорни: Это что еще за тон, чумазая ты макака?!', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 1, 31)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 32, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': missHBedroom, 'dialog': 'Мисс Хорни: Ты разговаривать так будешь со своим проктологом, понял?!', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 1, 32)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 33, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': missHBedroom, 'dialog': 'Мисс Хорни: Раз уж ты такая нежная пися, то ладно, будешь жить этажем ниже, идем...', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 1, 13)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 34, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': entrance, 'dialog': 'Мисс Хорни: Вы посмотрите на этого застенчивого поросеночка...', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 2, 34)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 35, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': entrance, 'dialog': 'Мисс Хорни: Пятачек сейчас так и лопнет от неловкости...', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 2, 9)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 36, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': 'Вы: Ты в своем уме, сумасшедшая?', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 1, 36)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 37, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': 'Вы: Я ехал сюда из другого штата...', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 1, 37)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 38, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': 'Вы: ТАМ ВОН КРЫСА БЕГАЕТ!', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 1, 38)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 39, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': 'Вы: Я ЗАПЛАТИЛ 600 БЛ*ДСКИХ ДОЛЛАРОВ!!!', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 1, 39)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 40, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': 'Вы: ГДЕ ОБЕЩАННЫЕ В ОБЪЯВЛЕНИИ "КАРАМЕЛЬНЫЕ" УСЛОВИЯ?!', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 1, 40)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 41, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': 'Вы: ВСЕ, ЧТО Я ВИЖУ, ЭТО ШКОНКУ, КРЫСУ, СУДЯ ПО ВСЕМУ ТОЖЕ ОХЕРЕВШУЮ ОТ ЭТИХ УСЛОВИЙ... И БЕШЕНУЮ СТАРУЮ ПОЕХАВШУЮ ОЗАБОЧЕННУЮ ДРЯНЬ!!!', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 2500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 1, 41)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 42, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': 'Вы: ЧТО ТЫ МОЛЧИШЬ, ЧУЧЕЛО???', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 4500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 2, 42)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 43, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': 'Мисс Хорни: Ну ты же сам отказался от карамельных условий. Что теперь жалуешься? Утро вечера мудреннее! Ни в чем себе не отказывай!', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          setTimeout(() => {
            animateOpacity(7, 5, 20)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 44, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': 'Мисс Хорни: Дрожащая пуся, судя по всему, решила поиграть в смелого ковбоя...', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 2500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 2, 44)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 45, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': 'Мисс Хорни: Жаль только, что патроны у пуси холостые', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 2500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 2, 45)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 46, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': 'Мисс Хорни: Поэтому располагайся, моя прелесть', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 3, 46)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 47, 'image': '', 'image_next': '', 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': 'Мисс Хорни: Если, конечно, ты не хочешь составить компанию одной мудрой леди, что проводит свои томные ночи в одиночестве наверху', 'buttonOne': 'Я остаюсь здесь', 'buttonTwo': '"Высказать старой дряни все, что я думаю по этому поводу"', 'duration': 1500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {}, 'buttonOneF': () => {
          opacityDialog.setValue(0)
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 2, 19)
          }, 1000)
        }, 'buttonTwoF': () => {
          opacityAnswers.setValue(0)
          opacityDialog.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 3, 35)
          }, 1000)
        }},
        {'id': 48, 'image': playerBedroom, 'image_next': playerBedroom, 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': 'Вы: ЭТА ДРЯНЬ ЗАПЕРЛА МЕНЯ В ПОДВАЛЕ?!', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 1500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(7, 5, 48)
          }, 1000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 49, 'image': playerBedroom, 'image_next': playerBedroom, 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': 'Вы: Чтож, пойду спать с крысой', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 2500, 'scaleBg': 1, 'bgText': '', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            animateOpacity(10, 1, 49)
          }, 2000)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
        {'id': 50, 'image': playerBedroom, 'image_next': playerBedroom, 'image_next_character': missH, 'image_next_character_v1': missHSmile, 'image_next_character_v2': missHRed, 'image_next_character_v3': missHAngry, 'image_next_bg': playerBedroom, 'dialog': ' ', 'buttonOne': ' ', 'buttonTwo': ' ', 'duration': 10, 'scaleBg': 1, 'bgText': 'Chapter 1 Complete', 'dialog_continue': () => {
          opacityAnswers.setValue(0)
          setTimeout(() => {
            props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
          }, 10)
        }, 'buttonOneF': () => {}, 'buttonTwoF': () => {}},
      ]
      const [dialog, setDialog] = useState('')
      const loadData = () => {
        // setLoading(true)
        setData([{'id': 1, 'title': 'Miss Hourney'}])
      }
      
      useEffect(() => {
        getTokenData()
          .then(() => {
            if (isFocused) {
              loadData()
            }
          })
      }, [isFocused])


      const bgImage = () => {
        return(
            
            <Animated.View
                style={{position: 'absolute', height: '100%', width: '100%', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#fff'}}
            >
              
              <Animated.View
                style={{position: 'absolute', height: '100%', width: '100%', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#fff', opacity: opacityAnimAll}}
            >
              
              {gameArr[screenId]['image'] != '' && <Animated.Image
                style={{ position: 'absolute', width: '100%', height: '100%', opacity: opacityAnim,
                transform: [{scale: scaleAnim}]}}
                source={{uri: gameArr[screenId]['image']}}
            />}
            {gameArr[screenId]['image_next_bg'] != '' && <Animated.Image
                style={{ position: 'absolute', width: '100%', height: '100%', opacity: opacityAnimBg,
                transform: [{scale: scaleAnim}], zIndex: -3 }}
                source={{uri: gameArr[screenId]['image_next_bg']}}
            />}
            {gameArr[screenId]['image_next_character'] != '' && <Animated.Image
                style={{ position: 'absolute', width: '100%', aspectRatio: 1/1.5, opacity: opacityAnimCharacter, bottom:0,
                transform: [{scale: scaleAnimCharacter}, {translateX: translateAnimCharacter}], zIndex: -2, overflow: 'visible' }}
                source={{uri: gameArr[screenId]['image_next_character']}}
            />}
            {gameArr[screenId]['image_next_character_v1'] != '' && <Animated.Image
                style={{ position: 'absolute', width: '100%', aspectRatio: 1/1.5, opacity: opacityAnimCharacterV1, bottom:0,
                transform: [{scale: scaleAnimCharacter}, {translateX: translateAnimCharacter}], zIndex: -2, overflow: 'visible' }}
                source={{uri: gameArr[screenId]['image_next_character_v1']}}
            />}
            {gameArr[screenId]['image_next_character_v2'] != '' && <Animated.Image
                style={{ position: 'absolute', width: '100%', aspectRatio: 1/1.5, opacity: opacityAnimCharacterV2, bottom:0,
                transform: [{scale: scaleAnimCharacter}, {translateX: translateAnimCharacter}], zIndex: -2, overflow: 'visible' }}
                source={{uri: gameArr[screenId]['image_next_character_v2']}}
            />}
            {gameArr[screenId]['image_next_character_v3'] != '' && <Animated.Image
                style={{ position: 'absolute', width: '100%', aspectRatio: 1/1.5, opacity: opacityAnimCharacterV3, bottom:0,
                transform: [{scale: scaleAnimCharacter}, {translateX: translateAnimCharacter}], zIndex: -2, overflow: 'visible' }}
                source={{uri: gameArr[screenId]['image_next_character_v3']}}
            />}
            {gameArr[screenId]['image_next'] != '' && <Animated.Image
                style={{ position: 'absolute', width: '100%', height: '100%', opacity: opacityAnimBg,
                transform: [{scale: scaleAnim}], zIndex: -1 }}
                source={{uri: gameArr[screenId]['image_next']}}
            />}
            {dialog != '' && <Animated.View
                style={{borderWidth: 1, width: '100%', borderColor: 'skyblue', borderRadius: 5,
                backgroundColor: 'rgba(255, 255, 255, 0.7)', marginBottom: 30, opacity: opacityDialog}}
            >
                <Tipewriter
                inputText={dialog}
                typingSpeed={20}
                onTypingComplete={() => {
                  if(gameArr[screenId]['buttonOne'] != ' ') {
                    animateOpacity(2)
                  }
                  gameArr[screenId]['dialog_continue']()
                }}
                />
            </Animated.View>}
            {gameArr[screenId]['buttonOne'] != '' && <Animated.View
                style={{ width: '90%', opacity: opacityAnswers }}
            ><TouchableOpacity
                onPress={() => {
                    buttonsActive && gameArr[screenId]['buttonOneF']()
                    buttonsActive && setButtonsActive(false)
                }}
                activeOpacity={0.8}
                style={{ borderWidth: 1, width: '100%', borderColor: 'skyblue', borderRadius: 5,
                backgroundColor: 'skyblue' }}
            >
                <Text
                    style={{ color: '#fff', fontSize: 15, padding: 10, textAlign: 'center' }}
                >{gameArr[screenId]['buttonOne']}</Text>
            </TouchableOpacity></Animated.View>}
            {gameArr[screenId]['buttonTwo'] != '' && <Animated.View
                style={{ width: '90%', opacity: opacityAnswers }}
            ><TouchableOpacity
                onPress={() => {
                  buttonsActive && gameArr[screenId]['buttonTwoF']()
                  buttonsActive && setButtonsActive(false)
                }}
                activeOpacity={0.8}
                style={{ borderWidth: 1, width: '100%', borderColor: 'skyblue', borderRadius: 5,
                backgroundColor: 'skyblue', marginTop: 15, marginBottom: 25 }}
            >
                <Text
                    style={{ color: '#fff', fontSize: 15, padding: 10, textAlign: 'center' }}
                >{gameArr[screenId]['buttonTwo']}</Text>
            </TouchableOpacity></Animated.View>}
            {screenWithTextShown && <Animated.View
              style={{ position: 'absolute', width: '100%', height: '100%', left: 0, right: 0, backgroundColor: '#000', zIndex: 1,
              justifyContent: 'center', alignItems: 'center', opacity: opacityScreenWithText
              }}
            >
              <Animated.View
                style={{opacity: opacityTextOnBlackscreen}}
              >
              <Text
                style={{ color: '#fff', fontSize: 25 }}
              >
                Chapter 1 Complete
              </Text>
              </Animated.View>
            </Animated.View>}
            </Animated.View>
            </Animated.View>
        )
      }
      const animateOpacity = (type, character=1, nextId=0) => {
        if (type == 1 && animEnd == false) {
          setAnimEnd(true)
          setDisplayStart('none')
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }).start(() => {
            setScreenId(nextId)
            
            setAnimEnd(false)
          })
        }
        else if (type == 0) {
          setAnimEnd(true)
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }).start()
          Animated.timing(opacityAnimAll, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          })
          .start(() => {
            opacityAnimBg.setValue(1)
            Animated.timing(opacityAnimCharacter, {
              toValue: 1,
              duration: 500,
              useNativeDriver: false,
            }).start()
            setAnimEnd(false)
          })
        }
        else if (type == 2) {
            setAnimEnd(true)
            setTimeout(() => {
                Animated.timing(opacityAnswers, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: false,
                  }).start(() => {
                    setAnimEnd(false)
                    setButtonsActive(true)
                  })
            }, 400)
            
          }
          else if (type == 3) {
            setAnimEnd(true)
            // opacityAnimBg.setValue(0)
            opacityAnimCharacter.setValue(0)
            Animated.timing(scaleAnim, {
              toValue: gameArr[screenId]['scaleBg'],
              duration: 1000,
              useNativeDriver: false,
            }).start()
            Animated.timing(opacityAnimAll, {
              toValue: 0,
              duration: 500,
              useNativeDriver: false,
            }).start(() => {
              setScreenId(nextId)
              scaleAnim.setValue(1)
              setAnimEnd(false)
            })
          }
          else if (type == 4) {
            setAnimEnd(true)
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: false,
            }).start()
            Animated.timing(translateAnimCharacter, {
              toValue: 0,
              duration: 700,
              useNativeDriver: false,
            }).start()
            Animated.timing(scaleAnimCharacter, {
              toValue: 1.1,
              duration: 700,
              useNativeDriver: false,
            }).start(() => {
              timeOutOne = setTimeout(() => {
                Animated.timing(opacityAnimCharacterV1, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: false,
                }).start(() => {
                  setScreenId(nextId)
                })
              }, 1000)
            })
          }
          else if (type == 5) {
            setAnimEnd(true)
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: false,
            }).start(() => {
              setScreenId(nextId)
            })
          }
          else if (type == 6) {
            setAnimEnd(true)
            Animated.timing(opacityAnimBg, {
              toValue: 0,
              duration: 500,
              useNativeDriver: false,
            }).start(() => {
              setScreenId(nextId)
            })
          }
          else if (type == 7) {
            setAnimEnd(true)
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: false,
            }).start()
            Animated.timing(translateAnimCharacter, {
              toValue: 0,
              duration: 700,
              useNativeDriver: false,
            }).start()
            if (character == 1) {
              opacityAnimCharacter.setValue(1)
              Animated.timing(opacityAnimCharacterV3, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }).start()
              Animated.timing(opacityAnimCharacterV2, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }).start()
              Animated.timing(opacityAnimCharacterV1, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }).start(() => {
                setScreenId(nextId)
              })
            }
            else if (character == 2) {
              Animated.timing(opacityAnimCharacterV3, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }).start()
              Animated.timing(opacityAnimCharacterV2, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }).start()
              Animated.timing(opacityAnimCharacterV1, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
              }).start(() => {
                setScreenId(nextId)
              })
            }
            else if (character == 3) {
              Animated.timing(opacityAnimCharacterV3, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }).start()
              Animated.timing(opacityAnimCharacterV2, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
              }).start(() => {
                setScreenId(nextId)
              })
            }
            else if (character == 4) {
              Animated.timing(opacityAnimCharacterV3, {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
              }).start()
              Animated.timing(opacityAnimCharacterV2, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }).start(() => {
                setScreenId(nextId)
              })
            }
            else if (character == 5) {
              Animated.timing(translateAnimCharacter, {
                toValue: 400,
                duration: 600,
                useNativeDriver: false,
              }).start()
              Animated.timing(scaleAnimCharacter, {
                toValue: 1.4,
                duration: 600,
                useNativeDriver: false,
              }).start(() => {
                setScreenId(nextId)
                scaleAnimCharacter.setValue(1.1)
                translateAnimCharacter.setValue(0)
              })
              Animated.timing(opacityAnimCharacter, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }).start()
              Animated.timing(opacityAnimCharacterV1, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }).start()
              Animated.timing(opacityAnimCharacterV2, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }).start()
              Animated.timing(opacityAnimCharacterV3, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
              }).start()
            }
          }
          else if (type == 88) {
            setAnimEnd(true)
            Animated.timing(scaleAnim, {
              toValue: gameArr[screenId]['scaleBg'],
              duration: 1000,
              useNativeDriver: false,
            }).start()
            Animated.timing(opacityAnimAll, {
              toValue: 0,
              duration: 500,
              useNativeDriver: false,
            }).start(() => {
              opacityAnimCharacter.setValue(0)
              opacityAnimCharacterV1.setValue(0)
              opacityAnimCharacterV2.setValue(0)
              setScreenId(screenId + 1)
              scaleAnim.setValue(1)
              setAnimEnd(false)
            })
          }
          else if (type == 8) {
            setAnimEnd(true)
            Animated.timing(scaleAnimCharacter, {
              toValue: 1.2,
              duration: 500,
              useNativeDriver: false,
            }).start()
              if(character == 1) {
                opacityAnimCharacter.setValue(1)
                Animated.timing(opacityAnimCharacterV3, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false,
                }).start()
                Animated.timing(opacityAnimCharacterV2, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false,
                }).start()
                Animated.timing(opacityAnimCharacterV1, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false
                }).start()
              } else if(character == 2) {
                Animated.timing(opacityAnimCharacterV3, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false,
                }).start()
                Animated.timing(opacityAnimCharacterV2, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false,
                }).start()
                Animated.timing(opacityAnimCharacterV1, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: false
                }).start()
              } else if(character == 3) {
                Animated.timing(opacityAnimCharacterV3, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false,
                }).start()
                Animated.timing(opacityAnimCharacterV2, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: false,
                }).start()
                Animated.timing(opacityAnimCharacterV1, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false
                }).start()
              } else if(character == 4) {
                Animated.timing(opacityAnimCharacterV3, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: false,
                }).start()
                Animated.timing(opacityAnimCharacterV2, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false,
                }).start()
                Animated.timing(opacityAnimCharacterV1, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false
                }).start()
              }
              setScreenId(nextId)
              setAnimEnd(false)
          }
          else if (type == 9) {
            setAnimEnd(true)
            Animated.timing(scaleAnimCharacter, {
              toValue: 1,
              duration: 500,
              useNativeDriver: false,
            }).start()
              if(character == 1) {
                opacityAnimCharacter.setValue(1)
                Animated.timing(opacityAnimCharacterV3, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false,
                }).start()
                Animated.timing(opacityAnimCharacterV2, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false,
                }).start()
                Animated.timing(opacityAnimCharacterV1, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false
                }).start()
              } else if(character == 2) {
                Animated.timing(opacityAnimCharacterV3, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false,
                }).start()
                Animated.timing(opacityAnimCharacterV2, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false,
                }).start()
                Animated.timing(opacityAnimCharacterV1, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: false
                }).start()
              } else if(character == 3) {
                Animated.timing(opacityAnimCharacterV3, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false,
                }).start()
                Animated.timing(opacityAnimCharacterV2, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: false,
                }).start()
                Animated.timing(opacityAnimCharacterV1, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false
                }).start()
              } else if(character == 4) {
                Animated.timing(opacityAnimCharacterV3, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: false,
                }).start()
                Animated.timing(opacityAnimCharacterV2, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false,
                }).start()
                Animated.timing(opacityAnimCharacterV1, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: false
                }).start()
              }
              setScreenId(nextId)
              setAnimEnd(false)
          } else if (type == 10) {
            setAnimEnd(true)
            opacityAnimCharacter.setValue(0)
            opacityAnimCharacterV1.setValue(0)
            opacityAnimCharacterV2.setValue(0)
            opacityAnimCharacterV3.setValue(0)
            Animated.timing(scaleAnim, {
              toValue: gameArr[screenId]['scaleBg'],
              duration: 1000,
              useNativeDriver: false,
            }).start()
            Animated.timing(opacityAnimAll, {
              toValue: 1,
              duration: 10,
              useNativeDriver: false,
            }).start(() => {
              setScreenWithTextShown(1)
              Animated.timing(opacityScreenWithText, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false,
              }).start(() => {
                Animated.timing(opacityTextOnBlackscreen, {
                  toValue: 1,
                  duration: 1000,
                  useNativeDriver: false,
                }).start(() => {
                    setTimeout(() => {
                      Animated.timing(opacityTextOnBlackscreen, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: false,
                      }).start(() => {
                        setScreenId(nextId)
                    scaleAnim.setValue(1)
                    setAnimEnd(false)
                      })
                    }, 2000)
                  })
                })
              }) 
          }
      }

      const animateScale = (type) => {
        if (type == 1) {
          setAnimEnd(true)
          Animated.spring(scaleAnim, {
            toValue: 1.5,
            duration: 200,
            bounciness: 20,
            useNativeDriver: false,
          }).start(() => {
            setScreenId(screenId + 1)
            setAnimEnd(false)
          })
        }
        else if (type != 1) {
          setAnimEnd(true)
          Animated.spring(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            setAnimEnd(false)
          })
        }
      }

      useEffect(() => {
        if(screenId != 0 && gameArr[screenId]['dialog'] == ' ') {
          console.log(screenId)
          clearTimeout(timeOutOne);
          animateOpacity(0)
          setTimeout(() => {
              setDialog(gameArr[screenId]['dialog'])
              opacityDialog.setValue(0)
          }, gameArr[screenId]['duration'])
        }
        else if(screenId != 0) {
            console.log(screenId)
            clearTimeout(timeOutOne);
            animateOpacity(0)
            setTimeout(() => {
                setDialog(gameArr[screenId]['dialog'])
                opacityDialog.setValue(1)
            }, gameArr[screenId]['duration'])
        }
      }, [screenId])

      
      return (
        <View style = {{flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center'}}>
            {/* <Image
                style={{ position: 'absolute', width: '100%', height: '100%', opacity: 1 }}
                source={{uri: missHourney}}
            /> */}
            {bgImage()}
            <View
                style={{display: displayStart}}
            >
            <TouchableOpacity
                onPress={() => {
                    console.log('Start')
                    animateOpacity(1, 1, 1)
                }}
                activeOpacity={0.8}
                style={{ borderWidth: 1, width: 170, borderColor: 'lightgreen', borderRadius: 5,
                backgroundColor: 'lightgreen' }}
            >
                <Text
                    style={{ color: '#fff', fontSize: 25, padding: 10, textAlign: 'center' }}
                >Start</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                    console.log('Exit')
                    props.navigation.dispatch(state => ({ ...CommonActions.goBack(), target: state.key }));
                }}
                activeOpacity={0.8}
                style={{ borderWidth: 1, width: 170, borderColor: 'tomato', borderRadius: 5,
                backgroundColor: 'tomato', marginTop: 15 }}
            >
                <Text
                    style={{ color: '#fff', fontSize: 25, padding: 10, textAlign: 'center' }}
                >Exit</Text>
            </TouchableOpacity>
            </View>
        </View>
      )
}

const styles = StyleSheet.create({
    cardStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 7,
        width: '100%'
    },
})

export default MissHourney