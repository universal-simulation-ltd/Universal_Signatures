import app from './app'
import create from './create'
import sign from './sign'
import save from './save'
import send from './send'
import verify from './verify'

export const en = { app, create, sign, save, send, verify }

/** The shape every language must match exactly. */
export type Messages = {
  [N in keyof typeof en]: { [K in keyof (typeof en)[N]]: string }
}
