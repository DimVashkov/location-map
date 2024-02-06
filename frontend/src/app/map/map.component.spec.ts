import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { MapComponent } from './map.component';
import { MapService } from '../services/map.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

const leafletMapMock: any = {
  flyTo: jasmine.createSpy('flyTo'),
};

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let mapServiceSpy: jasmine.SpyObj<MapService>;

  beforeEach(() => {
    mapServiceSpy = jasmine.createSpyObj('MapService', [
      'getLocation',
      'getBaseLayers',
      'getOverlayLayers',
    ]);
    mapServiceSpy.getBaseLayers.and.returnValue(of([]));
    mapServiceSpy.getOverlayLayers.and.returnValue(of([]));

    TestBed.configureTestingModule({
      declarations: [MapComponent],
      imports: [FormsModule, LeafletModule],
      providers: [{ provide: MapService, useValue: mapServiceSpy }],
    });
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call mapService.getLocation() when searchTerm is provided', fakeAsync(() => {
    const mockLocation = {
      latitude: 123,
      longitude: 456,
      formatted: 'Test Loc',
    };

    component.map = leafletMapMock;
    component.searchTerm = 'test';

    mapServiceSpy.getLocation.and.returnValue(of(mockLocation));

    component.search();

    expect(mapServiceSpy.getLocation).toHaveBeenCalledWith('test');

    tick();
    fixture.detectChanges();

    expect(component.map?.flyTo).toHaveBeenCalledWith(
      { lat: mockLocation.latitude, lng: mockLocation.longitude },
      11,
    );
  }));

  it('should not call mapService.getLocation() when searchTerm is empty', () => {
    component.searchTerm = '';
    component.search();

    expect(mapServiceSpy.getLocation).not.toHaveBeenCalled();
  });
});
