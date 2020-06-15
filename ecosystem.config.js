module.exports = {
  apps: [
    {
      name: "frontend-react",
      script: "node_modules/react-scripts/scripts/start.js",
    },
    {
      name: "proxy-server-express",
      script: "node server.js",
    },
  ],
};
