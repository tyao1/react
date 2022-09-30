/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

// TODO: Ideally these types would be opaque
export type UpdateType = number;
export const AsynchronousUpdate: UpdateType = 4; // TODO: rename: DefaultUpdate
export const FrameAlignedUpdate: UpdateType = 3;
export const ContinuousUpdate: UpdateType = 2;
export const DiscreteUpdate: UpdateType = 1;
export const SynchronousUpdate: UpdateType = 0;
