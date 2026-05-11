import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

export const CheckIcon = ({ width = 100, height = 100, fill = '#ffffff' }) => (
  <Svg width={width} height={height} viewBox="0 0 256 256">
    <G fill={fill} fillRule="nonzero">
      <G transform="scale(5.12,5.12)">
        <Path d="M41.9375,8.625c-0.66406,0.02344 -1.27344,0.375 -1.625,0.9375l-18.8125,28.78125l-12.1875,-10.53125c-0.52344,-0.54297 -1.30859,-0.74609 -2.03125,-0.51953c-0.71875,0.22266 -1.25391,0.83203 -1.37891,1.57422c-0.125,0.74609 0.17578,1.49609 0.78516,1.94531l13.9375,12.0625c0.4375,0.37109 1.01563,0.53516 1.58203,0.45313c0.57031,-0.08594 1.07422,-0.41016 1.38672,-0.89062l20.09375,-30.6875c0.42969,-0.62891 0.46484,-1.44141 0.09375,-2.10547c-0.37109,-0.66016 -1.08594,-1.05469 -1.84375,-1.01953z" />
      </G>
    </G>
  </Svg>
);

export const BackIcon = ({ width = 100, height = 100, fill = '#ffffff' }) => (
  <Svg width={width} height={height} viewBox="0 0 100 100" fill="none">
    <Path d="M54.4888 69.2238L35.2643 50.0983L54.4888 30.2614" stroke={fill} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const CloseIcon = ({ width = 100, height = 100, fill = '#ffffff' }) => (
  <Svg width={width} height={height} viewBox="0 0 100 100" fill="none">
    <Path d="M22.3719 77.5869L77.445 22.5138" stroke={fill} strokeWidth={10} strokeLinecap="round" />
    <Path d="M22.3719 22.5138L77.445 77.5868" stroke={fill} strokeWidth={10} strokeLinecap="round" />
  </Svg>
);

export const BookmarkerEmptyIcon = ({ width = 100, height = 100, fill = '#ffffff' }) => (
  <Svg width={width} height={height} viewBox="0 0 100 100" fill="none">
    <Path
      d="M67 10H33C25.3486 10 21.5781 16.0979 21.5781 21.2824V90L50 69.3572L78.6079 90V21.2824C78.6079 16.0979 74.6802 10 67 10Z"
      stroke={fill}
      strokeWidth={8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export const BookmarkerFullIcon = ({ width = 100, height = 100, fill = '#ffffff' }) => (
  <Svg width={width} height={height} viewBox="0 0 100 100" fill="none">
    <Path
      d="M67 10H33C25.3486 10 21.5781 16.0979 21.5781 21.2824V90L50 69.3572L78.6079 90V21.2824C78.6079 16.0979 74.6802 10 67 10Z"
      stroke={fill}
      fill={fill}
      strokeWidth={8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const HeartEmptyIcon = ({ width = 100, height = 100, fill = '#ffffff' }) => (
  <Svg width={width} height={height} viewBox="0 0 100 100" fill="none">
    <Path
      d="M90 35.5792C90 51.2902 69.0244 72.9707 50 88.524C32.1042 73.1278 10 53.0437 10 36.5219C10 20 21.1616 13.2694 31.1616 13.5839C41.1616 13.8984 50 22.2248 50 22.2248C50 22.2248 58.9695 13.5839 69.0244 13.5839C79.0792 13.5839 90 19.8682 90 35.5792Z"
      stroke={fill}
      strokeWidth={8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export const HeartFullIcon = ({ width = 100, height = 100, fill = '#ffffff' }) => (
  <Svg width={width} height={height} viewBox="0 0 100 100" fill="none">
    <Path
      d="M90 35.5792C90 51.2902 69.0244 72.9707 50 88.524C32.1042 73.1278 10 53.0437 10 36.5219C10 20 21.1616 13.2694 31.1616 13.5839C41.1616 13.8984 50 22.2248 50 22.2248C50 22.2248 58.9695 13.5839 69.0244 13.5839C79.0792 13.5839 90 19.8682 90 35.5792Z"
      stroke={fill}
      fill={fill}
      strokeWidth={8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const PopCornEmptyIcon = ({ width = 100, height = 100, fill = '#ffffff' }) => (
  <Svg width={width} height={height} viewBox="0 0 100 100" fill="none">
    <Path
      d="M34.8086 45.2331C34.8086 36.5646 45.4133 34.5544 48.7998 41.5532C49.548 43.0995 50 45.1206 50 47.6975C50 61.938 50 75.0277 50 75.0277M49.846 45.2331C50 34.523 65.6286 33.1648 65.1063 46.1197M78.2177 40C80.8559 28.3597 75.2025 26.2628 68.0415 25.2577C68.921 15.5841 59.1217 13.8253 54.7246 15.5841C51.3326 6.53868 27.8395 6.66427 31.2316 27.1422C23.211 25.8356 20.7788 34.2195 21.1811 38.5747V39.1857"
      stroke={fill}
      strokeWidth={7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <Path
      d="M79.9258 49.326C82.7713 34.5716 65.6823 34.3201 65.1069 47.266C64.5316 60.2118 62.6616 78.9115 62.6616 78.9115"
      stroke={fill}
      strokeWidth={7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M24.1204 74.9739C24.1204 87.3708 29.8653 90.3999 32.886 90.3999C35.9066 90.3999 62.9852 90.3999 66.9769 90.3999C70.9686 90.3999 73.3111 87.0104 74.3129 82.7952C75.3147 78.58 76.4517 70.3213 78.2433 60.3094"
      stroke={fill}
      strokeWidth={7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M37.0574 77.7608C37.0574 77.7608 36.0117 52.8078 34.4682 43.2383C32.9248 33.6688 18.7072 35.8487 19.2826 45.3424C19.858 54.836 20.6432 52.9014 22.0039 62.4259"
      stroke={fill}
      strokeWidth={7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const PopCornFullIcon = ({ width = 100, height = 100, fill = '#ffffff' }) => (
  <Svg width={width} height={height} viewBox="0 0 100 100" fill="none">
    <Path
      d="M34.8086 45.2331C34.8086 36.5646 45.4133 34.5544 48.7998 41.5532C49.548 43.0995 50 45.1206 50 47.6975C50 61.938 50 75.0277 50 75.0277M49.846 45.2331C50 34.523 65.6286 33.1648 65.1063 46.1197M78.2177 40C80.8559 28.3597 75.2025 26.2628 68.0415 25.2577C68.921 15.5841 59.1217 13.8253 54.7246 15.5841C51.3326 6.53868 27.8395 6.66427 31.2316 27.1422C23.211 25.8356 20.7788 34.2195 21.1811 38.5747V39.1857"
      stroke={fill}
      strokeWidth={7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M31.2316 27.1422C23.211 25.8356 20.7788 34.2194 21.1811 38.5747V39.1857L78.2177 40C80.8559 28.3597 75.2025 26.2628 68.0415 25.2577C68.921 15.5841 59.1217 13.8253 54.7246 15.5841C51.3326 6.53866 27.8395 6.66425 31.2316 27.1422Z"
      fill={fill}
    />
    <Path
      d="M79.9258 49.326C82.7713 34.5716 65.6823 34.3201 65.1069 47.266C64.5316 60.2118 62.6616 78.9115 62.6616 78.9115"
      stroke={fill}
      strokeWidth={7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M24.1204 74.9739C24.1204 87.3708 29.8653 90.3999 32.886 90.3999C35.9066 90.3999 62.9852 90.3999 66.9769 90.3999C70.9686 90.3999 73.3111 87.0104 74.3129 82.7952C75.3147 78.58 76.4517 70.3213 78.2433 60.3094"
      stroke={fill}
      strokeWidth={7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M37.0574 77.7608C37.0574 77.7608 36.0117 52.8078 34.4682 43.2383C32.9248 33.6688 18.7072 35.8487 19.2826 45.3424C19.858 54.836 20.6432 52.9014 22.0039 62.4259"
      stroke={fill}
      strokeWidth={7}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
