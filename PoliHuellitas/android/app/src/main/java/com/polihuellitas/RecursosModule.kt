package com.polihuellitas

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

/**
 * Native Module del desafío de recursos.
 *
 * JavaScript NO decide nada: Android elige la carpeta correcta
 * (values, values-en, values-land o values-en-land) según el idioma y la
 * orientación actuales, y este módulo solo devuelve lo que Android eligió.
 */
class RecursosModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = NAME

  /** Resuelve la Promise con { texto, subtitulo, carpeta, colorFuente, colorFondo }. */
  @ReactMethod
  fun obtenerRecursos(promise: Promise) {
    try {
      // Los Resources de la Activity tienen la configuración ACTUAL
      // (orientación e idioma); si no hay Activity, usamos los de la app.
      val res =
        reactApplicationContext.currentActivity?.resources
          ?: reactApplicationContext.resources

      val resultado =
        Arguments.createMap().apply {
          putString("texto", res.getString(R.string.desafio_texto))
          putString("subtitulo", res.getString(R.string.desafio_subtitulo))
          putString("carpeta", res.getString(R.string.desafio_carpeta))
          putString("colorFuente", aHex(res.getColor(R.color.desafio_fuente, null)))
          putString("colorFondo", aHex(res.getColor(R.color.desafio_fondo, null)))
        }
      promise.resolve(resultado)
    } catch (e: Exception) {
      promise.reject("ERROR_RECURSOS", e.message, e)
    }
  }

  /** Color de Android (Int ARGB) → "#RRGGBB". */
  private fun aHex(color: Int): String = String.format("#%06X", 0xFFFFFF and color)

  companion object {
    const val NAME = "Recursos"
  }
}
