import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList, MainTabParamList } from '../types';
import { DevBanner } from '../components/DevBanner';

// Auth Screens
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';

// Main Screens
import { HomeScreen } from '../screens/HomeScreen';
import { AppointmentsScreen } from '../screens/AppointmentsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AIScreen } from '../screens/AIScreen';
import { CreateAppointmentScreen } from '../screens/CreateAppointmentScreen';
import { AppointmentDetailScreen } from '../screens/AppointmentDetailScreen';
import { VoiceCallScreen } from '../screens/VoiceCallScreen';
import { MedicineRemindersScreen } from '../screens/MedicineRemindersScreen';
import { MedicineScheduleScreen } from '../screens/MedicineScheduleScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarActiveTintColor: '#3498db',
        tabBarInactiveTintColor: '#7f8c8d',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24 }}>{focused ? '🏠' : '🏡'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24 }}>{focused ? '📅' : '📆'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="AI"
        component={AIScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24 }}>{focused ? '🤖' : '🤖'}</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24 }}>{focused ? '👤' : '👥'}</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen
        name="CreateAppointment"
        component={CreateAppointmentScreen}
        options={{
          headerShown: true,
          title: 'Book Appointment',
          headerStyle: {
            backgroundColor: '#3498db',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      <Stack.Screen
        name="AppointmentDetail"
        component={AppointmentDetailScreen}
        options={{
          headerShown: true,
          title: 'Appointment Details',
          headerStyle: {
            backgroundColor: '#3498db',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      <Stack.Screen
        name="VoiceCall"
        component={VoiceCallScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="MedicineReminders"
        component={MedicineRemindersScreen}
        options={{
          headerShown: true,
          title: 'Medicine Reminders',
          headerStyle: {
            backgroundColor: '#27ae60',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      <Stack.Screen
        name="MedicineSchedule"
        component={MedicineScheduleScreen}
        options={{
          headerShown: true,
          title: 'Medicine Schedule',
          headerStyle: {
            backgroundColor: '#27ae60',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('🔍 AppNavigator - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

  if (isLoading) {
    console.log('📱 Showing loading screen');
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Loading" component={LoadingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  console.log('📱 Showing', isAuthenticated ? 'Main Navigator' : 'Auth Navigator');

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <DevBanner />
        {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
      </View>
    </NavigationContainer>
  );
};

// Simple loading screen component
const LoadingScreen = () => {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
    }}>
      <Text style={{
        fontSize: 24,
        marginBottom: 16,
      }}>🏥</Text>
      <Text style={{
        fontSize: 18,
        fontWeight: '600',
        color: '#2c3e50',
      }}>Aura</Text>
      <Text style={{
        fontSize: 14,
        color: '#7f8c8d',
        marginTop: 8,
      }}>Loading...</Text>
    </View>
  );
};

