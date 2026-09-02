import { telemetryEngine } from './telemetryEngine';

const getApiBaseUrl = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_URL;
  if (envUrl) return envUrl;
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    // If on localhost or 127.0.0.1, connect to port 8000
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
      return `${protocol}//${hostname}:8000/api/v1`;
    }
    // If on external domain without specific backend URL, use relative or direct
    return `${protocol}//${hostname}:8000/api/v1`;
  }
  return "http://localhost:8000/api/v1";
};

const API_BASE_URL = getApiBaseUrl();

class ApiService {
  private backendAvailable: boolean | null = null;
  private lastHealthCheckTime: number = 0;

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem("skyguard_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  // Quick health check with fast timeout to avoid blocking page loads
  private async isBackendAlive(): Promise<boolean> {
    const now = Date.now();
    // Cache positive/negative status for 20 seconds
    if (this.backendAvailable !== null && (now - this.lastHealthCheckTime < 20000)) {
      return this.backendAvailable;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_BASE_URL}/dashboard/summary`, {
        headers: this.getHeaders(),
        signal: controller.signal
      });
      clearTimeout(timeout);
      this.backendAvailable = res.ok;
      this.lastHealthCheckTime = now;
      return this.backendAvailable;
    } catch {
      this.backendAvailable = false;
      this.lastHealthCheckTime = now;
      return false;
    }
  }

  async get<T>(endpoint: string, timeoutMs: number = 2500): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: this.getHeaders(),
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || "API Request Failed");
      }
      return res.json();
    } catch (e) {
      clearTimeout(timeout);
      throw e;
    }
  }

  async post<T>(endpoint: string, data?: any, timeoutMs: number = 2500): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || "API Request Failed");
      }
      return res.json();
    } catch (e) {
      clearTimeout(timeout);
      throw e;
    }
  }

  // --- Live Weather & Stations with Seamless Autonomous Fallback ---
  async getLiveCards() {
    try {
      if (await this.isBackendAlive()) {
        return await this.get<any[]>("/weather/live-cards");
      }
    } catch (err) {
      console.warn("Backend /weather/live-cards unreachable, using autonomous live telemetry:", err);
    }
    return telemetryEngine.getLiveCards();
  }

  async searchLocations(query: string) {
    try {
      if (await this.isBackendAlive()) {
        return await this.get<any[]>(`/weather/search-locations?query=${encodeURIComponent(query)}`);
      }
    } catch (err) {
      console.warn("Backend /weather/search-locations unreachable, searching Open-Meteo directly:", err);
    }
    return telemetryEngine.searchLocations(query);
  }

  async getWeatherByCoordinates(lat: number, lon: number, name?: string) {
    try {
      if (await this.isBackendAlive()) {
        const q = `/weather/coordinates?latitude=${lat}&longitude=${lon}${name ? `&location_name=${encodeURIComponent(name)}` : ""}`;
        return await this.get<any>(q);
      }
    } catch (err) {
      console.warn("Backend /weather/coordinates unreachable, fetching Open-Meteo direct:", err);
    }
    return telemetryEngine.getWeatherByCoordinates(lat, lon, name);
  }

  async getStations() {
    try {
      if (await this.isBackendAlive()) {
        return await this.get<any[]>("/stations/");
      }
    } catch (err) {
      console.warn("Backend /stations/ unreachable, using autonomous registry:", err);
    }
    return telemetryEngine.getStations();
  }

  async getStationById(id: number) {
    try {
      if (await this.isBackendAlive()) {
        return await this.get<any>(`/stations/${id}`);
      }
    } catch (err) {
      console.warn(`Backend /stations/${id} unreachable, using autonomous registry:`, err);
    }
    return telemetryEngine.getStationById(id);
  }

  async getStationSeries(id: number, limit = 30) {
    try {
      if (await this.isBackendAlive()) {
        return await this.get<any[]>(`/readings/station/${id}/series?limit=${limit}`);
      }
    } catch (err) {
      console.warn(`Backend /readings/station/${id}/series unreachable, using autonomous series:`, err);
    }
    return telemetryEngine.getStationSeries(id, limit);
  }

  // --- Dashboard KPIs ---
  async getDashboardSummary() {
    try {
      if (await this.isBackendAlive()) {
        return await this.get<any>("/dashboard/summary");
      }
    } catch (err) {
      console.warn("Backend /dashboard/summary unreachable, computing live AI dashboard telemetry:", err);
    }
    return telemetryEngine.getDashboardSummary();
  }

  // --- Anomalies ---
  async getAnomalies(params?: { severity?: string; status?: string }) {
    try {
      if (await this.isBackendAlive()) {
        let q = "/anomalies/";
        const searchParams = new URLSearchParams();
        if (params?.severity) searchParams.append("severity", params.severity);
        if (params?.status) searchParams.append("status", params.status);
        if (searchParams.toString()) q += `?${searchParams.toString()}`;
        return await this.get<any[]>(q);
      }
    } catch (err) {
      console.warn("Backend /anomalies/ unreachable, using autonomous anomaly center:", err);
    }
    return telemetryEngine.getAnomalies(params);
  }

  async getAnomalyDeepDive(id: number) {
    try {
      if (await this.isBackendAlive()) {
        return await this.get<any>(`/anomalies/${id}`);
      }
    } catch (err) {
      console.warn(`Backend /anomalies/${id} unreachable, using autonomous deep dive:`, err);
    }
    return telemetryEngine.getAnomalyDeepDive(id);
  }

  async resolveAnomaly(id: number) {
    try {
      if (await this.isBackendAlive()) {
        return await this.post<any>(`/anomalies/${id}/resolve`);
      }
    } catch (err) {
      console.warn(`Backend /anomalies/${id}/resolve unreachable:`, err);
    }
    return telemetryEngine.resolveAnomaly(id);
  }

  // --- Sensor Health & Maintenance ---
  async getHealthMatrix() {
    try {
      if (await this.isBackendAlive()) {
        return await this.get<any[]>("/health/matrix");
      }
    } catch (err) {
      console.warn("Backend /health/matrix unreachable, using autonomous health matrix:", err);
    }
    return telemetryEngine.getHealthMatrix();
  }

  async getMaintenanceAlerts() {
    try {
      if (await this.isBackendAlive()) {
        return await this.get<any[]>("/alerts/");
      }
    } catch (err) {
      console.warn("Backend /alerts/ unreachable, using autonomous alerts:", err);
    }
    return telemetryEngine.getMaintenanceAlerts();
  }

  async acknowledgeAlert(id: number) {
    try {
      if (await this.isBackendAlive()) {
        return await this.post<any>(`/alerts/${id}/acknowledge`);
      }
    } catch (err) {
      console.warn(`Backend /alerts/${id}/acknowledge unreachable:`, err);
    }
    return telemetryEngine.acknowledgeAlert(id);
  }

  async resolveAlert(id: number) {
    try {
      if (await this.isBackendAlive()) {
        return await this.post<any>(`/alerts/${id}/resolve`);
      }
    } catch (err) {
      console.warn(`Backend /alerts/${id}/resolve unreachable:`, err);
    }
    return telemetryEngine.resolveAlert(id);
  }

  // --- Consensus Self-Healing ---
  async getConsensusOverview() {
    try {
      if (await this.isBackendAlive()) {
        return await this.get<any>("/self-healing/consensus-overview");
      }
    } catch (err) {
      console.warn("Backend /self-healing/consensus-overview unreachable, using autonomous engine:", err);
    }
    return telemetryEngine.getConsensusOverview();
  }

  async getCorrectedRecords() {
    try {
      if (await this.isBackendAlive()) {
        return await this.get<any[]>("/self-healing/records");
      }
    } catch (err) {
      console.warn("Backend /self-healing/records unreachable, using autonomous consensus ledger:", err);
    }
    return telemetryEngine.getCorrectedRecords();
  }

  // --- Explainable AI (XAI) ---
  async getAnomalyExplanation(anomalyId: number) {
    try {
      if (await this.isBackendAlive()) {
        return await this.get<any>(`/explain/anomaly/${anomalyId}`);
      }
    } catch (err) {
      console.warn(`Backend /explain/anomaly/${anomalyId} unreachable, generating autonomous XAI:`, err);
    }
    return telemetryEngine.getAnomalyExplanation(anomalyId);
  }

  // --- Simulation Lab ---
  async getSimulationScenarios() {
    try {
      if (await this.isBackendAlive()) {
        return await this.get<any[]>("/simulation/scenarios");
      }
    } catch (err) {
      console.warn("Backend /simulation/scenarios unreachable, using autonomous library:", err);
    }
    return telemetryEngine.getSimulationScenarios();
  }

  async injectSimulation(payload: { station_id: number; scenario_type: string; parameter?: string; magnitude?: number; duration_steps?: number }) {
    try {
      if (await this.isBackendAlive()) {
        return await this.post<any>("/simulation/inject", payload);
      }
    } catch (err) {
      console.warn("Backend /simulation/inject unreachable, running autonomous injection:", err);
    }
    return telemetryEngine.injectSimulation(payload);
  }

  // --- Audit Ledger ---
  async getAuditLedger(limit = 100) {
    try {
      if (await this.isBackendAlive()) {
        return await this.get<any[]>(`/audit/ledger?limit=${limit}`);
      }
    } catch (err) {
      console.warn("Backend /audit/ledger unreachable, using immutable autonomous ledger:", err);
    }
    return telemetryEngine.getAuditLedger(limit);
  }

  // --- System Status ---
  async getSystemStatus() {
    try {
      if (await this.isBackendAlive()) {
        return await this.get<any>("/admin/system-status");
      }
    } catch (err) {
      console.warn("Backend /admin/system-status unreachable, using autonomous status:", err);
    }
    return telemetryEngine.getSystemStatus();
  }
}

export const api = new ApiService();
