import * as rx from "rxjs";
import { ofType } from "redux-observable";

import { TEpic } from "~/state/root/root.types";

import { actions } from "./lantern.slice";

export const togglePower: TEpic = (action$) =>
  action$.pipe(
    ofType(actions.press.type),
    rx.switchMap(() =>
      rx.timer(800).pipe(rx.raceWith(action$.pipe(ofType(actions.release))))
    ),
    rx.filter((event) => event === 0),
    rx.map(() => actions.togglePower())
  );
