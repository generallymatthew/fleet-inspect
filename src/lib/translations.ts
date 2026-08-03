export type Language = 'en' | 'es'

interface StepText {
  title: string
  description: string
}

interface Translations {
  welcome: {
    title: string
    subtitle: string
    startButton: string
    languageLabel: string
  }
  vehicleSelect: {
    title: string
    scanLabel: string
    scanPlaceholder: string
    useCodeButton: string
    noMatchError: string
  }
  driverSelect: {
    title: string
    customNameLabel: string
    continueButton: string
  }
  odometer: {
    title: string
    startButton: string
  }
  stepCounter: (current: number, total: number) => string
  inspectionStep: {
    back: string
    forward: string
    passButton: string
    failButton: string
    defectNoteLabel: string
    defectNotePlaceholder: string
    photoLabel: string
    photoTake: string
    photoProcessing: string
    photoRetake: string
    severityLabel: string
    severityMinor: string
    severityCritical: string
    continueButton: string
  }
  signature: {
    title: string
    attestation: (driverName: string) => string
    clearButton: string
    submitError: string
    submitting: string
    submitButton: string
  }
  complete: {
    title: string
    body: string
    nextButton: string
    dashboardLink: string
  }
  steps: Record<string, StepText>
}

export const translations: Record<Language, Translations> = {
  en: {
    welcome: {
      title: 'Fleet Inspect',
      subtitle: 'Daily vehicle inspection, made quick.',
      startButton: 'Start Inspection',
      languageLabel: 'Language',
    },
    vehicleSelect: {
      title: 'Select Vehicle',
      scanLabel: 'Or scan / enter asset code',
      scanPlaceholder: 'e.g. truck-102',
      useCodeButton: 'Use Code',
      noMatchError: 'No vehicle matches that code.',
    },
    driverSelect: {
      title: "Who's Inspecting?",
      customNameLabel: 'Or enter your name',
      continueButton: 'Continue',
    },
    odometer: {
      title: 'Odometer / Hours',
      startButton: 'Start Inspection',
    },
    stepCounter: (current, total) => `Step ${current} of ${total}`,
    inspectionStep: {
      back: '← Back',
      forward: 'Forward →',
      passButton: 'PASS',
      failButton: 'FAIL',
      defectNoteLabel: 'Describe the issue',
      defectNotePlaceholder: 'Tap the mic on your keyboard to dictate, or type here',
      photoLabel: 'Photo evidence (required)',
      photoTake: 'Take Photo',
      photoProcessing: 'Processing photo…',
      photoRetake: 'Photo captured — tap to retake',
      severityLabel: 'Severity',
      severityMinor: 'Minor (Monitor)',
      severityCritical: 'Critical (Out of Service)',
      continueButton: 'Continue',
    },
    signature: {
      title: 'Sign to Confirm',
      attestation: (driverName) => `I, ${driverName}, attest this inspection is accurate.`,
      clearButton: 'Clear',
      submitError: 'Something went wrong submitting this inspection. Please try again.',
      submitting: 'Submitting…',
      submitButton: 'Submit Inspection',
    },
    complete: {
      title: 'Inspection Submitted',
      body: "Your inspection has been saved. If you're offline, it will sync automatically once you're back online.",
      nextButton: 'Start Next Inspection',
      dashboardLink: 'View Management Dashboard',
    },
    steps: {
      'tires-wheels': {
        title: 'Tires & Wheels',
        description: 'Pressure, tread depth, lug nuts',
      },
      'fluids-engine': {
        title: 'Fluids & Engine',
        description: 'Oil level, coolant, visible leaks under vehicle',
      },
      'lights-signals': {
        title: 'Lights & Signals',
        description: 'Headlights, brake lights, turn signals, flashers',
      },
      'brakes-steering': {
        title: 'Brakes & Steering',
        description: 'Brake pedal response, steering play',
      },
      'hitch-trailer': {
        title: 'Hitch & Trailer Coupling',
        description: 'Safety chains, breakaway cable, trailer plug',
      },
      'safety-equipment': {
        title: 'Safety Equipment',
        description: 'Fire extinguisher, first-aid kit, high-vis cones',
      },
    },
  },
  es: {
    welcome: {
      title: 'Fleet Inspect',
      subtitle: 'Inspección diaria de vehículos, de forma rápida.',
      startButton: 'Iniciar Inspección',
      languageLabel: 'Idioma',
    },
    vehicleSelect: {
      title: 'Seleccionar Vehículo',
      scanLabel: 'O escanee / ingrese el código del activo',
      scanPlaceholder: 'p. ej. truck-102',
      useCodeButton: 'Usar Código',
      noMatchError: 'Ningún vehículo coincide con ese código.',
    },
    driverSelect: {
      title: '¿Quién Está Inspeccionando?',
      customNameLabel: 'O ingrese su nombre',
      continueButton: 'Continuar',
    },
    odometer: {
      title: 'Odómetro / Horas',
      startButton: 'Iniciar Inspección',
    },
    stepCounter: (current, total) => `Paso ${current} de ${total}`,
    inspectionStep: {
      back: '← Atrás',
      forward: 'Adelante →',
      passButton: 'APROBAR',
      failButton: 'RECHAZAR',
      defectNoteLabel: 'Describa el problema',
      defectNotePlaceholder: 'Toque el micrófono en su teclado para dictar, o escriba aquí',
      photoLabel: 'Evidencia fotográfica (requerida)',
      photoTake: 'Tomar Foto',
      photoProcessing: 'Procesando foto…',
      photoRetake: 'Foto capturada — toque para volver a tomar',
      severityLabel: 'Gravedad',
      severityMinor: 'Menor (Monitorear)',
      severityCritical: 'Crítico (Fuera de Servicio)',
      continueButton: 'Continuar',
    },
    signature: {
      title: 'Firme para Confirmar',
      attestation: (driverName) => `Yo, ${driverName}, certifico que esta inspección es precisa.`,
      clearButton: 'Borrar',
      submitError: 'Algo salió mal al enviar esta inspección. Por favor, inténtelo de nuevo.',
      submitting: 'Enviando…',
      submitButton: 'Enviar Inspección',
    },
    complete: {
      title: 'Inspección Enviada',
      body: 'Su inspección ha sido guardada. Si está sin conexión, se sincronizará automáticamente cuando vuelva a estar en línea.',
      nextButton: 'Iniciar Siguiente Inspección',
      dashboardLink: 'Ver Panel de Administración',
    },
    steps: {
      'tires-wheels': {
        title: 'Llantas y Ruedas',
        description: 'Presión, profundidad de la banda de rodadura, tuercas de las ruedas',
      },
      'fluids-engine': {
        title: 'Fluidos y Motor',
        description: 'Nivel de aceite, refrigerante, fugas visibles debajo del vehículo',
      },
      'lights-signals': {
        title: 'Luces y Señales',
        description: 'Faros delanteros, luces de freno, direccionales, luces intermitentes',
      },
      'brakes-steering': {
        title: 'Frenos y Dirección',
        description: 'Respuesta del pedal de freno, juego de la dirección',
      },
      'hitch-trailer': {
        title: 'Enganche y Acoplamiento del Remolque',
        description: 'Cadenas de seguridad, cable de desconexión de emergencia, conector del remolque',
      },
      'safety-equipment': {
        title: 'Equipo de Seguridad',
        description: 'Extintor de incendios, botiquín de primeros auxilios, conos de alta visibilidad',
      },
    },
  },
}
