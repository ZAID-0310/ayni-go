import React from 'react';
import { View, Text } from 'react-native';

export default function PinInicio({ color = '#0F5132' }) {
  return (
    <View style={{ width: 56, height: 66, alignItems: 'center' }}>
      <View
        style={{
          position: 'absolute',
          bottom: 6,
          width: 18,
          height: 18,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: color,
          borderWidth: 3,
          borderColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: '800', color }}>INICIO</Text>
        </View>
      </View>
    </View>
  );
}