import { Redirect } from "expo-router"

export default function Index() {
  // 将根路径重定向到 home 页面
  return <Redirect href="/home" />
}