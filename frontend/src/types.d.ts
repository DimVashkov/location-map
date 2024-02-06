interface WMSEntry {
  id: string;
  name: string;
  url: string;
}

interface BaseLayerEntry {
  name: string;
  attribution: string;
  url: string;
}

interface MapLocation {
  formatted: string;
  latitude: number;
  longitude: number;
}
