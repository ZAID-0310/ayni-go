import React, { useState } from 'react';
import { View, Image, Text } from 'react-native';

// Pin de una parada: foto del pasajero dentro (o su número si no hay foto) y
// el color del tramo en el borde y la punta. Úsalo dentro de un
// Mapbox.PointAnnotation con anchor={{ x: 0.5, y: 1 }}.
// `onCargada`: llámalo para redibujar el pin cuando la imagen termina de cargar.
export default function PinFoto({ uri, orden, color = '#0F5132', resaltado = false, onCargada }) {
  const [fallo, setFallo] = useState(false);
  const tam = resaltado ? 50 : 42;
  const conFoto = !!uri && !fallo;

  return (
    <View style={{ width: tam + 10, height: tam + 18, alignItems: 'center' }}>
      <View
        style={{
          position: 'absolute',
          bottom: 4,
          width: 14,
          height: 14,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          width: tam,
          height: tam,
          borderRadius: tam / 2,
          backgroundColor: color,
          borderWidth: resaltado ? 4 : 3,
          borderColor: color,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {conFoto ? (
          <Image
            source={{ uri }}
            style={{ width: tam, height: tam }}
            onLoad={onCargada}
            onError={() => setFallo(true)}
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignSelf: 'stretch',
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '800', color }}>{orden}</Text>
          </View>
        )}
      </View>
      {conFoto ? (
        <View
          style={{
            position: 'absolute',
            top: -2,
            right: 0,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: color,
            borderWidth: 2,
            borderColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: '800', color: '#FFFFFF' }}>{orden}</Text>
        </View>
      ) : null}
    </View>
  );
}