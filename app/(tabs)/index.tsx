import { Redirect } from 'expo-router';

const Index = () => {
  // 应用启动后立即跳转到 /home
  return <Redirect href="/home" />;
};

export default Index;