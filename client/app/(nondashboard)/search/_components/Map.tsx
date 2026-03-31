"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppSelector } from "@/state/store";
import { Property } from "@/lib/types/prismaTypes";
// import { propertyData as properties } from "@/lib/data";
import { cleanParams } from "@/lib/utils";
import { getProperties } from "@/lib/actions/property";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const Map = () => {
  const mapContainerRef = useRef(null);
  const filters = useAppSelector((state) => state.global.filters);
  const [properties, setProperties] = useState([])

  useEffect(() => {
    const params = cleanParams(filters)
    const getAvailableProperties = async () => {
      try {
        const result = await getProperties(params)
        setProperties(result.data);
      } catch (err) {
        setProperties([])
      }
    };

    getAvailableProperties();
  }, [filters])


  useEffect(() => {
    // if (properties.length == 0) return
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/tik-eskanor/cmmdrlc1i008c01ra1ufz8evx",
      center: filters.coordinates || [7.3775, 3.9470],
      zoom: 9,
    });

    properties.forEach((property) => {
      const marker = createPropertyMarker(property, map);
      const markerElement = marker.getElement();
      const path = markerElement.querySelector("path[fill='#3FB1CE']");
      if (path) path.setAttribute("fill", "#000000");
    });

    const resizeMap = () => {
      if (map) setTimeout(() => map.resize(), 700);
    };
    resizeMap();

    return () => map.remove();
  }, [filters.coordinates, properties]);

  // if (isLoading) return <>Loading...</>;
  // if (properties.length == 0) return <div>Failed to fetch properties</div>;

  return (
    <div className="basis-5/12 grow relative rounded-xl border border-gray-200">
      <div
        className="map-container rounded-xl"
        ref={mapContainerRef}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
};

const createPropertyMarker = (property: Property, map: mapboxgl.Map) => {
  const marker = new mapboxgl.Marker()
    .setLngLat([
      property.location.coordinates.longitude,
      property.location.coordinates.latitude,
    ])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `
        <div class="marker-popup">
          <div class="marker-popup-image"></div>
          <div>
            <a href="/search/${property.id}" target="_blank" class="marker-popup-title">${property.name}</a>
            <p class="marker-popup-price">
              #${property.pricePerMonth}
              <span class="marker-popup-price-unit"> / month</span>
            </p>
          </div>
        </div>
        `
      )
    )
    .addTo(map);
  return marker;
};

export default Map;