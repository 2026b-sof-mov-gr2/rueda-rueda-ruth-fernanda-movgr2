import { ToastAndroid } from 'react-native';

/** Muestra un Toast nativo de Android (android.widget.Toast). */
export function mostrarToast(mensaje: string) {
  ToastAndroid.show(mensaje, ToastAndroid.SHORT);
}
