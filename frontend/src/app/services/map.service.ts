import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private http: HttpClient) {}

  getOverlayLayers(): Observable<WMSEntry[]> {
    return this.http.get<WMSEntry[]>(`/overlay-layers`);
  }

  getBaseLayers(): Observable<BaseLayerEntry[]> {
    return this.http.get<BaseLayerEntry[]>('/base-layers');
  }

  getLocation(searchTerm: string): Observable<MapLocation> {
    return this.http.get<MapLocation>(`/location/${searchTerm}`);
  }
}
