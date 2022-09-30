/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {Lane, Lanes} from './ReactFiberLane.old';
import type {UpdateType} from './ReactUpdateTypes.old';

import {
  NoLane,
  SyncLane,
  IdleLane,
  getHighestPriorityLane,
  includesNonIdleWork,
} from './ReactFiberLane.old';

import {
  ContinuousUpdate,
  DiscreteUpdate,
  FrameAlignedUpdate,
  AsynchronousUpdate,
} from './ReactUpdateTypes.old';

export opaque type EventPriority = number;

export const UnknownEventPriority: EventPriority =
  SyncLane | (FrameAlignedUpdate << 1);
export const DiscreteEventPriority: EventPriority =
  SyncLane | (DiscreteUpdate << 1);
export const ContinuousEventPriority: EventPriority =
  SyncLane | (ContinuousUpdate << 1);
export const DefaultEventPriority: EventPriority = SyncLane | (AsynchronousUpdate << 1);
export const IdleEventPriority: EventPriority = IdleLane;
console.log(UnknownEventPriority, DiscreteEventPriority, ContinuousEventPriority, DefaultEventPriority);


let currentUpdatePriority: EventPriority = NoLane;

export function getCurrentUpdatePriority(): EventPriority {
  console.log('getCurrentUpdatePriority', currentUpdatePriority);
  return currentUpdatePriority;
}

export function setCurrentUpdatePriority(newPriority: EventPriority) {
  currentUpdatePriority = newPriority;
}

export function runWithPriority<T>(priority: EventPriority, fn: () => T): T {
  const previousPriority = currentUpdatePriority;
  try {
    currentUpdatePriority = priority;
    return fn();
  } finally {
    currentUpdatePriority = previousPriority;
  }
}

export function higherEventPriority(
  a: EventPriority,
  b: EventPriority,
): EventPriority {
  return a !== 0 && a < b ? a : b;
}

export function lowerEventPriority(
  a: EventPriority,
  b: EventPriority,
): EventPriority {
  return a === 0 || a > b ? a : b;
}

export function isHigherEventPriority(
  a: EventPriority,
  b: EventPriority,
): boolean {
  return a !== 0 && a < b;
}

export function lanesToEventPriority(
  lanes: Lanes,
  updateType: ?UpdateType,
): EventPriority {
  const lane = getHighestPriorityLane(lanes);
  console.log('highest lane?', lane, updateType);
  if (!isHigherEventPriority(SyncLane, lane)) {
    if (updateType === ContinuousUpdate) {
      return ContinuousEventPriority;
    }
    if (updateType === AsynchronousUpdate || updateType === FrameAlignedUpdate) {
      return DefaultEventPriority;
    }
    return DiscreteEventPriority;
  }
  if (includesNonIdleWork(lane)) {
    console.log('default event?');
    return DefaultEventPriority;
  }
  return IdleEventPriority;
}

export function laneAndUpdateTypeToEventPriority(
  lane: Lane,
  updateType: UpdateType,
): EventPriority {
  return lane | (updateType << 1);
}
