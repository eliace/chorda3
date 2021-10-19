module.exports = {
  presets: [require.resolve('@docusaurus/core/lib/babel/preset')],
  plugins: [
    [
      "babel-plugin-module-resolver",
      {
        "alias": {
          // Add your aliases here
          "@chorda/core": "../chorda-core/src",
          "@chorda/react": "../chorda-react/src",
        }
      }
    ]
  ]
};
