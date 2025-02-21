import { Tabs } from 'expo-router';
import CustomTabs from '@/components/CustomTabs';

const _layout = () => {
    return (
        <Tabs
            screenOptions={{ headerShown: false }}
            tabBar={(props) => <CustomTabs {...props} />} // Doğru kullanım
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="ai" />
            <Tabs.Screen name="statistics" />
            <Tabs.Screen name="wallet" />
            <Tabs.Screen name="profile" />
        </Tabs>
    );
};

export default _layout;
