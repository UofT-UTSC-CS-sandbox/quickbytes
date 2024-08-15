import booleanPointInPolygon from "@turf/boolean-point-in-polygon"
import { point, polygon } from "@turf/helpers"
import { BUILDINGS, CampusBuilding } from "../data/CampusBuildings";

export function lookupBuilding(lat: number, lng: number): CampusBuilding | null {
    for (const building of BUILDINGS) {
        for (const poly of building.bounds) {
          const isInBounds = booleanPointInPolygon(point([lat, lng]), polygon([poly]));
          if (isInBounds) 
            return building;
        }
      }
    return null;
}