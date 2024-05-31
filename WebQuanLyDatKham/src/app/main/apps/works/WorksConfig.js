import { AppointmentConfig } from "./appointments/AppointmentConfig";
import { PaymentConfig } from "./payments/PaymentConfig";
import { MedicalSessionsConfig } from "./medical-sessions/MedicalSessionsConfig";
import { MedicalSessionsDoctorConfig } from "./medical-sessions-doctor/MedicalSessionsDoctorConfig";
import { IndicationConfig } from "./indications/IndicationConfig";

export const WorksConfig = [
  AppointmentConfig,
  PaymentConfig,
  MedicalSessionsConfig,
  MedicalSessionsDoctorConfig,
  IndicationConfig,
];
