import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';

const ALTO = 40;
const FILAS = 5;
const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function Rueda({ items, indice, onCambio, flex }) {
  const ref = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => {
      ref.current?.scrollTo({ y: indice * ALTO, animated: false });
    }, 50);
    return () => clearTimeout(t);
  }, []);

  const terminar = (e) => {
    const i = Math.round(e.nativeEvent.contentOffset.y / ALTO);
    onCambio(Math.max(0, Math.min(items.length - 1, i)));
  };

  return (
    <ScrollView
      ref={ref}
      style={{ height: ALTO * FILAS, flex }}
      showsVerticalScrollIndicator={false}
      snapToInterval={ALTO}
      decelerationRate="fast"
      nestedScrollEnabled
      onMomentumScrollEnd={terminar}
      onScrollEndDrag={terminar}
      contentContainerStyle={{ paddingVertical: ALTO * 2 }}
    >
      {items.map((t, i) => (
        <View key={i} style={{ height: ALTO, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: i === indice ? 18 : 16,
              fontWeight: i === indice ? '700' : '400',
              color: i === indice ? '#111' : '#999',
            }}
          >
            {t}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

export default function SelectorFechaHora({ onChange, valorInicial }) {
  // Hoy en Lima (UTC-5 todo el año)
  const base = useMemo(() => new Date(Date.now() - 5 * 3600 * 1000), []);

  const dias = useMemo(() => {
    const lista = [];
    for (let i = 0; i <= 30; i++) {
      const d = new Date(
        Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() + i)
      );
      const etiqueta =
        i === 0
          ? 'Hoy'
          : i === 1
          ? 'Mañana'
          : `${DIAS[d.getUTCDay()]} ${d.getUTCDate()} ${MESES[d.getUTCMonth()]}`;
      lista.push({ etiqueta, valor: d.toISOString().slice(0, 10) });
    }
    return lista;
  }, [base]);

   // Valor inicial: el guardado (si viene) o dentro de una hora
  const inicial = useMemo(() => {
    if (valorInicial?.horaTxt) {
      const [hh, mm] = valorInicial.horaTxt.split(':').map(Number);
      if (Number.isFinite(hh) && Number.isFinite(mm)) {
        const idx = dias.findIndex((d) => d.valor === valorInicial.fecha);
        return {
          dia: idx >= 0 ? idx : 0,
          h: (hh % 12 === 0 ? 12 : hh % 12) - 1,
          m: mm,
          p: hh >= 12 ? 1 : 0,
        };
      }
    }
    const l = new Date(Date.now() + 60 * 60000 - 5 * 3600 * 1000);
    const h24 = l.getUTCHours();
    return {
      dia: l.toISOString().slice(0, 10) === base.toISOString().slice(0, 10) ? 0 : 1,
      h: (h24 % 12 === 0 ? 12 : h24 % 12) - 1,
      m: l.getUTCMinutes(),
        p: h24 >= 12 ? 1 : 0,
    };
  }, [base]);

  const horas = useMemo(() => Array.from({ length: 12 }, (_, i) => String(i + 1)), []);
  const minutos = useMemo(
    () => Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')),
    []
  );

  const [diaIdx, setDiaIdx] = useState(inicial.dia);
  const [hIdx, setHIdx] = useState(inicial.h);
  const [mIdx, setMIdx] = useState(inicial.m);
  const [pIdx, setPIdx] = useState(inicial.p);

  useEffect(() => {
    const h24 = ((hIdx + 1) % 12) + (pIdx === 1 ? 12 : 0);
    const horaTxt = `${String(h24).padStart(2, '0')}:${String(mIdx).padStart(2, '0')}`;
    onChange({ fecha: dias[diaIdx].valor, horaTxt });
  }, [diaIdx, hIdx, mIdx, pIdx]);

  return (
    <View style={{ marginVertical: 8 }}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: ALTO * 2,
          height: ALTO,
          backgroundColor: '#EEF4F0',
          borderRadius: 8,
        }}
      />
      <View style={{ flexDirection: 'row' }}>
        <Rueda items={dias.map((d) => d.etiqueta)} indice={diaIdx} onCambio={setDiaIdx} flex={2.4} />
        <Rueda items={horas} indice={hIdx} onCambio={setHIdx} flex={1} />
        <Rueda items={minutos} indice={mIdx} onCambio={setMIdx} flex={1} />
        <Rueda items={['AM', 'PM']} indice={pIdx} onCambio={setPIdx} flex={1} />
      </View>
    </View>
  );
}