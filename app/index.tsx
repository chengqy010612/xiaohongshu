import { Redirect } from "expo-router"
import { View , Text} from "react-native"

export default function Index() {
  // 将根路径重定向到 home 页面
  return <Redirect href="/home" />

}