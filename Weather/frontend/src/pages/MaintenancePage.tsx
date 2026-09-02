import React, { useState, useEffect } from 'react';
import { Wrench, CheckCircle2, AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { MaintenanceAlertRecord } from '../types';

export const MaintenancePage: React.FC = () => {
  const [alerts, setAlerts] = useState<MaintenanceAlertRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMaintenanceAlerts().then((data) => {
      setAlerts(data);
      setLoading(false);
    });
  }, []);

  const handleAcknowledge = async (id: number) => {
    await api.acknowledgeAlert(id);
    const updated = await api.getMaintenanceAlerts();
    setAlerts(updated);
  };

  const handleResolve = async (id: number) => {
    await api.resolveAlert(id);
    const updated = await api.getMaintenanceAlerts();
    setAlerts(updated);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="border-b-2 border-[#11110F] pb-4">
        <h1 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-[#11110F]">
          PREDICTIVE MAINTENANCE & WORK ORDERS CENTER
        </h1>
        <p className="text-xs sm:text-sm font-mono text-[#555550] uppercase mt-1">
          Automated transducer failure risk classification and prioritized operational maintenance recommendations.
        </p>
      </div>

      {/* Alerts List */}
      <div className="space-y-4 pt-2">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-[#FFFFFF] border-2 border-[#11110F] shadow-[3px_3px_0_#11110F] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-3 border-2 border-[#11110F] shadow-[2px_2px_0_#11110F] ${
                alert.severity === 'CRITICAL' 
                  ? 'bg-[#FF5C5C] text-[#FFFFFF]' 
                  : 'bg-[#4057FF] text-[#FFFFFF]'
              }`}>
                <Wrench className="w-5 h-5 stroke-[2.5]" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-lg font-display uppercase text-[#11110F]">
                    {alert.title}
                  </h3>
                  <span className={`text-[10px] font-bold font-mono px-2 py-0.5 border border-[#11110F] shadow-[1px_1px_0_#11110F] ${
                    alert.severity === 'CRITICAL' ? 'bg-[#FF5C5C] text-[#FFFFFF]' : 'bg-[#C8FF2E] text-[#11110F]'
                  }`}>
                    {alert.severity}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#555550] uppercase">
                    STATION #{alert.station_id} ({alert.sensor_type})
                  </span>
                </div>

                <p className="text-xs font-mono font-bold text-[#11110F] mt-2 max-w-2xl uppercase">
                  {alert.recommendation}
                </p>

                <span className="text-[10px] font-mono font-bold text-[#555550] mt-2 block uppercase">
                  LOGGED: {new Date(alert.created_at).toLocaleString()} • STATUS: <strong className="uppercase text-[#11110F]">{alert.status}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              {alert.status === 'ACTIVE' && (
                <button
                  onClick={() => handleAcknowledge(alert.id)}
                  className="brutal-btn brutal-btn-tertiary text-[10px] py-2 px-4"
                >
                  ACKNOWLEDGE
                </button>
              )}

              {alert.status !== 'RESOLVED' && (
                <button
                  onClick={() => handleResolve(alert.id)}
                  className="brutal-btn brutal-btn-primary text-[10px] py-2 px-4"
                >
                  RESOLVE ALERT
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
