import { Request, Response } from "express";
import { matchedData } from "express-validator";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export default class Controller {
  static async getOverlayLayers(req: Request, res: Response) {
    const items = [
      {
        id: "gpw-v4:gpw-v4-population-density_2015",
        name: "Population Density 2015",
      },

      {
        id: "lulc:lulc-global-grid-prob-urban-expansion-2030",
        name: "Urban Expansion 2030",
      },
    ];
    const wmsUrl =
      "http://sedac.ciesin.columbia.edu/geoserver/wms?service=WMS&request=GetMap";

    const data = items.map((item) => {
      return {
        id: item.id,
        name: item.name,
        url: `${wmsUrl}&layers=${item.id}`,
      };
    });

    return res.status(200).json(data);
  }

  static async getBaseLayers(req: Request, res: Response) {
    const data = [
      {
        name: "OpenStreetMap",
        attribution: "OpenStreetMap",
        url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      },
      {
        name: "Esri WorldStreetMap",
        attribution: "Esri",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
      },
      {
        name: "CartoDB DarkMatter",
        attribution: "CartoDB",
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      },
    ];

    return res.status(200).json(data);
  }

  static async getLocation(req: Request, res: Response) {
    const { searchTerm } = matchedData(req);
    const key = process.env.OPEN_CAGE_API_KEY;
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchTerm)}&key=${key}&limit=1`;

    if (!key) {
      return res.status(500).json({ error: "No OpenCage Api Key" });
    }

    try {
      const response = await axios.get(apiUrl);
      const result = response.data.results[0];
      if (result) {
        return res.status(200).json({
          formatted: result.formatted,
          latitude: result.geometry.lat,
          longitude: result.geometry.lng,
        });
      } else {
        return res.status(404).json({ error: "Not found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
