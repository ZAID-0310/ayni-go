import React, { useState } from 'react';
import { View, Image, Text } from 'react-native';

// Foto redonda; si no hay foto (o falla la carga) muestra las iniciales.
export default function Avatar({
  uri,
  nombre = '',
  tamano = 64,
  colorFondo = '#E6E0CC',
  colorTexto = '#4A4A4A',
  style,
}) {
  const [fallo, setFallo] = useState(false);

  const iniciales = nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');

  const base = {
    width: tamano,
    height: tamano,
    borderRadius: tamano / 2,
    overflow: 'hidden',
    backgroundColor: colorFondo,
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <View style={[base, style]}>
      {uri && !fallo ? (
        <Image
          source={{ uri }}
          style={{ width: tamano, height: tamano }}
          onError={() => setFallo(true)}
        />
      ) : (
        <Text style={{ fontSize: tamano * 0.38, fontWeight: '600', color: colorTexto }}>
          {iniciales || '?'}
        </Text>
      )}
    </View>
  );
}