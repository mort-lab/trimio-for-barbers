"use client";

import React, { useState } from "react";
import AppointmentsTable from "./appointments/AppointmentsTable";

const AppointmentsView = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-4">
      <AppointmentsTable key={refreshKey} />
    </div>
  );
};

export default AppointmentsView;
