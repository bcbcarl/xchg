var webpack = require("webpack");
const pkg = require("./package.json");
module.exports = {
  entry: {
    bundle: "./src/main.tsx",
    vendor: Object.keys(pkg.dependencies),
  },

  output: {
    filename: "[name].js",
    path: "./js"
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      filename: "vendor.js"
    }),
  ],

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },

  module: {
    loaders: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
	test: /\.js/,
	loader: "babel-loader",
	exclude: /node_modules/,
	query: { presets: ['es2015'], },
      },
      {
	test: /\.css/,
	loader: "style-loader!css-loader",
	exclude: /css\//,
      },
      { test: /\.(ttf|woff|eot|svg)/, loader: "url-loader" },
    ],

    preLoaders: [
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { test: /\.js$/, loader: "source-map-loader" }
    ]
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: [
  ],
};
