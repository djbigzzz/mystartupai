import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface FormStepperProps {
  steps: Step[];
  currentStep: number;
}

export default function FormStepper({ steps, currentStep }: FormStepperProps) {
  return (
    <div className="mb-8">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const isActive = step.number === currentStep;
            const isComplete = step.number < currentStep;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center flex-1 first:items-start last:items-end"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: step.number * 0.1 }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-300 relative z-10
                    ${
                      isComplete
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50"
                        : isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-primary/50 ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                    }
                  `}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </motion.div>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: step.number * 0.1 + 0.1 }}
                  className={`
                    mt-3 text-center max-w-[120px]
                    ${isActive ? "text-foreground" : "text-muted-foreground"}
                  `}
                >
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs mt-0.5 hidden sm:block">{step.description}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
