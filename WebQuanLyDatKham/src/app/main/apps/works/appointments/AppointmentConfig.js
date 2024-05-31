import React from "react";

export const AppointmentConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: "/apps/checkin/appointments",
      component: React.lazy(() => import("./Appointment")),
    },
    {
      path: "/apps/checkin/appointments-agency",
      component: React.lazy(() => import("./AppointmentByCreator")),
    },
  ],
};
