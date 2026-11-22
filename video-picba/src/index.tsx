import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {FPS, H, TOTAL, W} from './lib';
import {Video} from './Video';

const Root: React.FC = () => <Composition id="PicBA" component={Video} durationInFrames={TOTAL} fps={FPS} width={W} height={H} />;
registerRoot(Root);
