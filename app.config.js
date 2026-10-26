module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    permissions: [
      ...(config.android?.permissions ?? []),
      'RECEIVE_BOOT_COMPLETED',
      'POST_NOTIFICATIONS',
    ],
  },
  plugins: [
    [
      '@rnmapbox/maps',
      {
        RNMapboxMapsDownloadToken: process.env.RNMAPBOX_MAPS_DOWNLOAD_TOKEN,
      },
    ],
    [
      'expo-location',
      {
        isAndroidBackgroundLocationEnabled: true,
        isAndroidForegroundServiceEnabled: true,
        locationAlwaysAndWhenInUsePermission:
          'Ayni Go usa tu ubicación, incluso con la app en segundo plano, para que tus pasajeros vean por dónde vas durante el viaje.',
        locationWhenInUsePermission:
          'Ayni Go usa tu ubicación para mostrar tu posición y conectar viajes cercanos.',
      },
    ],
  ],
});