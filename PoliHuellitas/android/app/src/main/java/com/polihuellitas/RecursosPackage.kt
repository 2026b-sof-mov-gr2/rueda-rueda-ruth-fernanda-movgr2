package com.polihuellitas

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

/** Registra RecursosModule para que JavaScript pueda usarlo. */
class RecursosPackage : BaseReactPackage() {

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
    if (name == RecursosModule.NAME) RecursosModule(reactContext) else null

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider =
    ReactModuleInfoProvider {
      mapOf(
        RecursosModule.NAME to
          ReactModuleInfo(
            name = RecursosModule.NAME,
            className = RecursosModule::class.java.name,
            canOverrideExistingModule = false,
            needsEagerInit = false,
            isCxxModule = false,
            isTurboModule = false, // módulo clásico (usa la capa de compatibilidad)
          ),
      )
    }
}
