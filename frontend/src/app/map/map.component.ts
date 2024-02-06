import { Component, OnInit } from '@angular/core';
import { tileLayer, latLng } from 'leaflet';
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  public map?: L.Map;
  public baseLayers: { [name: string]: L.TileLayer } = {};
  public overlays: { [name: string]: L.TileLayer.WMS } = {};
  public searchTerm: string = '';
  public options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }),
    ],
    zoom: 5,
    center: latLng(46.879966, -121.726909),
  };

  constructor(private mapService: MapService) {}

  ngOnInit(): void {
    this.createBaseLayers();
    this.createOverlayLayers();
  }

  public search() {
    if (this.searchTerm.length > 0) {
      this.mapService.getLocation(this.searchTerm).subscribe({
        next: (loc: MapLocation) => {
          this.map?.flyTo(latLng(loc.latitude, loc.longitude), 11);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
    }
  }

  private createBaseLayers(): void {
    this.mapService.getBaseLayers().subscribe({
      next: (baseLayers: BaseLayerEntry[]) => {
        baseLayers.forEach((entry) => {
          const { name, attribution, url } = entry;

          if (url) {
            this.baseLayers[name] = tileLayer(url, {
              maxZoom: 18,
              attribution: attribution,
            });
          }
        });
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  private createOverlayLayers(): void {
    this.mapService.getOverlayLayers().subscribe({
      next: (overlayLayers: WMSEntry[]) => {
        overlayLayers.forEach((entry) => {
          const { id, name, url } = entry;

          if (url) {
            this.overlays[name] = tileLayer.wms(url, {
              layers: id,
              format: 'image/png',
              transparent: true,
              opacity: 0.4,
            });
          }
        });
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
