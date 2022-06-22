import path from "path";
import { EnvironmentPlugin } from "webpack";
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const config = {
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(wasm)$/i,
        type: 'asset/resource'
      }
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      fs: false,
      path: false,
      crypto: false,
    },
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name]-[fullhash].js",
  },
  devServer: {
    static: path.join(__dirname, "public"),
    compress: true,
    port: 3000,
    hot: true,
    open: false,
  },
  // optimization: {
  //   runtimeChunk: 'single',
  // },
  plugins: [
    new EnvironmentPlugin({
      'PUBLIC_URL': process.env.PUBLIC_URL,
    }),
    new CopyWebpackPlugin({
      patterns: [{ 
        from: 'public', 
        globOptions: {
          ignore: ["**/index.html"],
        },
      }],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname,'public/index.html')
    }),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      // eslint: {
      //   files: "./src/**/*",
      // }
    })
  ]
};

export default config;
