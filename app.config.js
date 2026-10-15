module.exports = ({ config }) => ({
  ...config,
  plugins: [
    [
      '@rnmapbox/maps',
      {
        RNMapboxMapsDownloadToken: process.env.RNMAPBOX_MAPS_DOWNLOAD_TOKEN,
      },
    ],
  ],
});